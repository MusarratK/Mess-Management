package com.mess.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenseDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpenseDTO {
        private Long id;
        private String category;
        private String title;
        private BigDecimal amount;
        private LocalDate expenseDate;
        private String paymentMode;
        private String notes;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpenseRequest {
        @NotBlank(message = "Category is required")
        private String category;

        @NotBlank(message = "Title is required")
        private String title;

        @NotNull(message = "Amount is required")
        private BigDecimal amount;

        @NotNull(message = "Expense date is required")
        private LocalDate expenseDate;

        private String paymentMode = "CASH";
        private String notes;
    }
}
