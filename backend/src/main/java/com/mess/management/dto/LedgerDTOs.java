package com.mess.management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class LedgerDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentRequest {
        @NotNull(message = "Customer ID is required")
        private Long customerId;

        @NotNull(message = "Amount is required")
        private BigDecimal amount;

        private String paymentMode = "CASH";
        private String referenceNo;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LedgerTransactionDTO {
        private Long id;
        private Long ledgerId;
        private Long customerId;
        private String customerName;
        private LocalDateTime transactionDate;
        private String type; // DEBIT or CREDIT
        private BigDecimal amount;
        private String paymentMode;
        private String referenceNo;
        private String description;
        private BigDecimal runningBalanceAfter;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerLedgerStatementDTO {
        private Long customerId;
        private String customerName;
        private String regNo;
        private String mobile;
        private BigDecimal openingBalance;
        private BigDecimal totalDebit;
        private BigDecimal totalCredit;
        private BigDecimal remainingBalance;
        private List<LedgerTransactionDTO> transactions;
    }
}
