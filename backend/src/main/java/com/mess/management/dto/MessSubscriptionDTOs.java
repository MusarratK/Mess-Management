package com.mess.management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MessSubscriptionDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessSubscriptionDTO {
        private Long id;
        private Long customerId;
        private String customerName;
        private String customerRegNo;
        private String customerMobile;
        private Long planId;
        private String planName;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer totalDays;
        private String shift;
        private BigDecimal rate;
        private BigDecimal totalAmount;
        private String status;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignPlanRequest {
        @NotNull(message = "Customer ID is required")
        private Long customerId;

        @NotNull(message = "Plan ID is required")
        private Long planId;

        @NotNull(message = "Start date is required")
        private LocalDate startDate;

        private String shift = "BOTH";
    }
}
