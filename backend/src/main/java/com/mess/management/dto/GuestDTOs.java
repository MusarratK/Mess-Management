package com.mess.management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class GuestDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuestDTO {
        private Long id;
        private String guestName;
        private String mobile;
        private LocalDate date;
        private String shift;
        private Integer numberOfGuests;
        private BigDecimal ratePerGuest;
        private BigDecimal totalAmount;
        private String paymentMode;
        private String notes;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuestRequest {
        @NotBlank(message = "Guest name is required")
        private String guestName;

        private String mobile;

        @NotNull(message = "Date is required")
        private LocalDate date;

        private String shift = "BOTH";

        @NotNull(message = "Number of guests is required")
        @Min(value = 1, message = "Number of guests must be at least 1")
        private Integer numberOfGuests;

        @NotNull(message = "Rate per guest is required")
        private BigDecimal ratePerGuest;

        private String paymentMode = "CASH";
        private String notes;
    }
}
