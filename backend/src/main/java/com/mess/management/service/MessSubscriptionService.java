package com.mess.management.service;

import com.mess.management.dto.MessSubscriptionDTOs.*;
import com.mess.management.entity.*;
import com.mess.management.exception.ResourceNotFoundException;
import com.mess.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessSubscriptionService {

    private final MessSubscriptionRepository subscriptionRepository;
    private final CustomerRepository customerRepository;
    private final PlanRepository planRepository;
    private final LedgerRepository ledgerRepository;
    private final LedgerTransactionRepository transactionRepository;

    @Transactional
    public MessSubscriptionDTO assignPlan(AssignPlanRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + request.getPlanId()));

        int totalDays = plan.getToDay() - plan.getFromDay() + 1;
        if (totalDays <= 0) totalDays = 30;

        LocalDate startDate = request.getStartDate();
        LocalDate endDate = startDate.plusDays(totalDays - 1);

        MessSubscription.Shift shift = MessSubscription.Shift.BOTH;
        if (request.getShift() != null) {
            try {
                shift = MessSubscription.Shift.valueOf(request.getShift().toUpperCase());
            } catch (Exception ignored) {}
        }

        MessSubscription subscription = MessSubscription.builder()
                .customer(customer)
                .plan(plan)
                .startDate(startDate)
                .endDate(endDate)
                .totalDays(totalDays)
                .shift(shift)
                .rate(plan.getRate())
                .totalAmount(plan.getRate())
                .status(MessSubscription.Status.ACTIVE)
                .build();

        MessSubscription savedSub = subscriptionRepository.save(subscription);

        // Record Debit Transaction in Customer Ledger
        Ledger ledger = ledgerRepository.findByCustomerId(customer.getId())
                .orElseGet(() -> ledgerRepository.save(Ledger.builder()
                        .customer(customer)
                        .accountName(customer.getName() + " Account")
                        .accountType(Ledger.AccountType.CUSTOMER)
                        .runningBalance(BigDecimal.ZERO)
                        .build()));

        BigDecimal newBalance = ledger.getRunningBalance().add(savedSub.getTotalAmount());
        ledger.setRunningBalance(newBalance);
        ledgerRepository.save(ledger);

        LedgerTransaction tx = LedgerTransaction.builder()
                .ledger(ledger)
                .customer(customer)
                .transactionDate(LocalDateTime.now())
                .type(LedgerTransaction.Type.DEBIT)
                .amount(savedSub.getTotalAmount())
                .paymentMode("SUBSCRIPTION_FEE")
                .description("Mess Subscription Charge: " + plan.getName() + " (" + startDate + " to " + endDate + ")")
                .runningBalanceAfter(newBalance)
                .build();
        transactionRepository.save(tx);

        return mapToDTO(savedSub);
    }

    public List<MessSubscriptionDTO> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<MessSubscriptionDTO> getSubscriptionsByCustomer(Long customerId) {
        return subscriptionRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<MessSubscriptionDTO> getSubscriptionsEndingSoon(int days) {
        LocalDate today = LocalDate.now();
        LocalDate future = today.plusDays(days);
        return subscriptionRepository.findSubscriptionsEndingBetween(today, future)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void updateSubscriptionStatus(Long id, String statusStr) {
        MessSubscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        try {
            sub.setStatus(MessSubscription.Status.valueOf(statusStr.toUpperCase()));
            subscriptionRepository.save(sub);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Invalid subscription status: " + statusStr);
        }
    }

    public MessSubscriptionDTO mapToDTO(MessSubscription sub) {
        return MessSubscriptionDTO.builder()
                .id(sub.getId())
                .customerId(sub.getCustomer().getId())
                .customerName(sub.getCustomer().getName())
                .customerRegNo(sub.getCustomer().getRegNo())
                .customerMobile(sub.getCustomer().getMobile())
                .planId(sub.getPlan().getId())
                .planName(sub.getPlan().getName())
                .startDate(sub.getStartDate())
                .endDate(sub.getEndDate())
                .totalDays(sub.getTotalDays())
                .shift(sub.getShift().name())
                .rate(sub.getRate())
                .totalAmount(sub.getTotalAmount())
                .status(sub.getStatus().name())
                .createdAt(sub.getCreatedAt())
                .build();
    }
}
