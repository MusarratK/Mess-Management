package com.mess.management.service;

import com.mess.management.dto.LedgerDTOs.*;
import com.mess.management.entity.*;
import com.mess.management.exception.ResourceNotFoundException;
import com.mess.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerRepository ledgerRepository;
    private final LedgerTransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public LedgerTransactionDTO recordPayment(PaymentRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        Ledger ledger = ledgerRepository.findByCustomerId(customer.getId())
                .orElseGet(() -> ledgerRepository.save(Ledger.builder()
                        .customer(customer)
                        .accountName(customer.getName() + " Account")
                        .accountType(Ledger.AccountType.CUSTOMER)
                        .runningBalance(customer.getOpeningBalance())
                        .build()));

        BigDecimal newBalance = ledger.getRunningBalance().subtract(request.getAmount());
        ledger.setRunningBalance(newBalance);
        ledgerRepository.save(ledger);

        LedgerTransaction tx = LedgerTransaction.builder()
                .ledger(ledger)
                .customer(customer)
                .transactionDate(LocalDateTime.now())
                .type(LedgerTransaction.Type.CREDIT)
                .amount(request.getAmount())
                .paymentMode(request.getPaymentMode() != null ? request.getPaymentMode() : "CASH")
                .referenceNo(request.getReferenceNo())
                .description(request.getDescription() != null ? request.getDescription() : "Customer Payment Received")
                .runningBalanceAfter(newBalance)
                .build();

        LedgerTransaction saved = transactionRepository.save(tx);
        return mapToDTO(saved);
    }

    public CustomerLedgerStatementDTO getCustomerStatement(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        Ledger ledger = ledgerRepository.findByCustomerId(customer.getId())
                .orElseGet(() -> Ledger.builder()
                        .customer(customer)
                        .accountName(customer.getName() + " Account")
                        .accountType(Ledger.AccountType.CUSTOMER)
                        .runningBalance(customer.getOpeningBalance())
                        .build());

        List<LedgerTransaction> transactions = transactionRepository.findByCustomerIdOrderByTransactionDateDesc(customerId);

        BigDecimal totalDebit = transactions.stream()
                .filter(t -> t.getType() == LedgerTransaction.Type.DEBIT)
                .map(LedgerTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCredit = transactions.stream()
                .filter(t -> t.getType() == LedgerTransaction.Type.CREDIT)
                .map(LedgerTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<LedgerTransactionDTO> txDtos = transactions.stream().map(this::mapToDTO).collect(Collectors.toList());

        return CustomerLedgerStatementDTO.builder()
                .customerId(customer.getId())
                .customerName(customer.getName())
                .regNo(customer.getRegNo())
                .mobile(customer.getMobile())
                .openingBalance(customer.getOpeningBalance())
                .totalDebit(totalDebit)
                .totalCredit(totalCredit)
                .remainingBalance(ledger.getRunningBalance())
                .transactions(txDtos)
                .build();
    }

    public LedgerTransactionDTO mapToDTO(LedgerTransaction tx) {
        return LedgerTransactionDTO.builder()
                .id(tx.getId())
                .ledgerId(tx.getLedger().getId())
                .customerId(tx.getCustomer() != null ? tx.getCustomer().getId() : null)
                .customerName(tx.getCustomer() != null ? tx.getCustomer().getName() : null)
                .transactionDate(tx.getTransactionDate())
                .type(tx.getType().name())
                .amount(tx.getAmount())
                .paymentMode(tx.getPaymentMode())
                .referenceNo(tx.getReferenceNo())
                .description(tx.getDescription())
                .runningBalanceAfter(tx.getRunningBalanceAfter())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
