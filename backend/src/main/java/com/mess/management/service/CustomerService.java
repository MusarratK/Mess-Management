package com.mess.management.service;

import com.mess.management.dto.CustomerDTOs.*;
import com.mess.management.dto.PageResponse;
import com.mess.management.entity.*;
import com.mess.management.exception.BadRequestException;
import com.mess.management.exception.ResourceNotFoundException;
import com.mess.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final LedgerRepository ledgerRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final MessSubscriptionRepository messSubscriptionRepository;
    private final WhatsAppService whatsAppService;
    private final PdfGeneratorService pdfGeneratorService;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public CustomerDTO createCustomer(CustomerRequest request) {
        String regNo = request.getRegNo();
        if (regNo == null || regNo.isBlank()) {
            regNo = "REG-" + (1000 + customerRepository.count() + 1);
        }

        if (customerRepository.findByRegNo(regNo).isPresent()) {
            throw new BadRequestException("Customer with Registration No " + regNo + " already exists");
        }

        Customer customer = Customer.builder()
                .regNo(regNo)
                .name(request.getName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .fatherMobile(request.getFatherMobile())
                .gender(request.getGender())
                .collegeOrCompany(request.getCollegeOrCompany())
                .academicYear(request.getAcademicYear())
                .branch(request.getBranch())
                .address(request.getAddress())
                .city(request.getCity())
                .dob(request.getDob())
                .reference(request.getReference())
                .openingBalance(request.getOpeningBalance() != null ? request.getOpeningBalance() : BigDecimal.ZERO)
                .verified(false)
                .photoUrl(request.getPhotoUrl())
                .deleted(false)
                .build();

        Customer savedCustomer = customerRepository.save(customer);

        // Initialize Customer Ledger
        Ledger ledger = Ledger.builder()
                .customer(savedCustomer)
                .accountName(savedCustomer.getName() + " Account (" + savedCustomer.getRegNo() + ")")
                .accountType(Ledger.AccountType.CUSTOMER)
                .runningBalance(savedCustomer.getOpeningBalance())
                .build();
        ledgerRepository.save(ledger);

        // Auto-trigger WhatsApp OTP on creation
        sendWhatsAppOtp(savedCustomer.getId());

        return mapToDTO(savedCustomer);
    }

    public PageResponse<CustomerDTO> getCustomers(int page, int size, String search, String status) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Customer> customerPage;

        if (search != null && !search.isBlank()) {
            customerPage = customerRepository.searchCustomers(search.trim(), pageRequest);
        } else if ("unverified".equalsIgnoreCase(status)) {
            customerPage = customerRepository.findByDeletedFalseAndVerified(false, pageRequest);
        } else if ("deleted".equalsIgnoreCase(status)) {
            customerPage = customerRepository.findByDeleted(true, pageRequest);
        } else {
            customerPage = customerRepository.findByDeleted(false, pageRequest);
        }

        List<CustomerDTO> dtos = customerPage.getContent().stream().map(this::mapToDTO).collect(Collectors.toList());
        return PageResponse.<CustomerDTO>builder()
                .content(dtos)
                .pageNo(customerPage.getNumber())
                .pageSize(customerPage.getSize())
                .totalElements(customerPage.getTotalElements())
                .totalPages(customerPage.getTotalPages())
                .last(customerPage.isLast())
                .build();
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return mapToDTO(customer);
    }

    public CustomerDTO getCustomerByRegNo(String regNo) {
        Customer customer = customerRepository.findByRegNoAndDeletedFalse(regNo)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with Registration No: " + regNo));
        return mapToDTO(customer);
    }

    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setMobile(request.getMobile());
        customer.setFatherMobile(request.getFatherMobile());
        customer.setGender(request.getGender());
        customer.setCollegeOrCompany(request.getCollegeOrCompany());
        customer.setAcademicYear(request.getAcademicYear());
        customer.setBranch(request.getBranch());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setDob(request.getDob());
        customer.setReference(request.getReference());
        if (request.getPhotoUrl() != null) {
            customer.setPhotoUrl(request.getPhotoUrl());
        }

        Customer updated = customerRepository.save(customer);
        return mapToDTO(updated);
    }

    @Transactional
    public void softDeleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        customer.setDeleted(true);
        customerRepository.save(customer);
    }

    @Transactional
    public void restoreCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        customer.setDeleted(false);
        customerRepository.save(customer);
    }

    @Transactional
    public void sendWhatsAppOtp(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        String otp = String.format("%06d", random.nextInt(1000000));
        OtpToken otpToken = OtpToken.builder()
                .mobile(customer.getMobile())
                .otpCode(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .verified(false)
                .build();

        otpTokenRepository.save(otpToken);
        whatsAppService.sendOtpMessage(customer.getMobile(), otp);
    }

    @Transactional
    public boolean verifyWhatsAppOtp(Long customerId, String otpCode) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        Optional<OtpToken> tokenOpt = otpTokenRepository.findFirstByMobileAndOtpCodeAndVerifiedFalseOrderByCreatedAtDesc(customer.getMobile(), otpCode);
        if (tokenOpt.isEmpty()) {
            throw new BadRequestException("Invalid OTP code entered");
        }

        OtpToken token = tokenOpt.get();
        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP code has expired. Please request a new one.");
        }

        token.setVerified(true);
        otpTokenRepository.save(token);

        customer.setVerified(true);
        customerRepository.save(customer);
        return true;
    }

    public byte[] generateCustomerIdCardPdf(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        Optional<MessSubscription> activeSub = messSubscriptionRepository
                .findFirstByCustomerIdAndStatusOrderByCreatedAtDesc(id, MessSubscription.Status.ACTIVE);

        return pdfGeneratorService.generateCustomerIdCard(customer, activeSub.orElse(null));
    }

    public CustomerDTO mapToDTO(Customer customer) {
        BigDecimal balance = BigDecimal.ZERO;
        Optional<Ledger> ledgerOpt = ledgerRepository.findByCustomerId(customer.getId());
        if (ledgerOpt.isPresent()) {
            balance = ledgerOpt.get().getRunningBalance();
        }

        String activePlanName = null;
        java.time.LocalDate subEndDate = null;
        Optional<MessSubscription> activeSub = messSubscriptionRepository
                .findFirstByCustomerIdAndStatusOrderByCreatedAtDesc(customer.getId(), MessSubscription.Status.ACTIVE);
        if (activeSub.isPresent()) {
            activePlanName = activeSub.get().getPlan().getName();
            subEndDate = activeSub.get().getEndDate();
        }

        return CustomerDTO.builder()
                .id(customer.getId())
                .regNo(customer.getRegNo())
                .name(customer.getName())
                .email(customer.getEmail())
                .mobile(customer.getMobile())
                .fatherMobile(customer.getFatherMobile())
                .gender(customer.getGender())
                .collegeOrCompany(customer.getCollegeOrCompany())
                .academicYear(customer.getAcademicYear())
                .branch(customer.getBranch())
                .address(customer.getAddress())
                .city(customer.getCity())
                .dob(customer.getDob())
                .reference(customer.getReference())
                .openingBalance(customer.getOpeningBalance())
                .verified(customer.isVerified())
                .photoUrl(customer.getPhotoUrl())
                .deleted(customer.isDeleted())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .currentBalance(balance)
                .activeSubscriptionPlan(activePlanName)
                .subscriptionEndDate(subEndDate)
                .build();
    }
}
