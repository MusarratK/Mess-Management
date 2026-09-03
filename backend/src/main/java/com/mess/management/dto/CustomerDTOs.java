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

public class CustomerDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDTO {
        private Long id;
        private String regNo;
        private String name;
        private String email;
        private String mobile;
        private String fatherMobile;
        private String gender;
        private String collegeOrCompany;
        private String academicYear;
        private String branch;
        private String address;
        private String city;
        private LocalDate dob;
        private String reference;
        private BigDecimal openingBalance;
        private boolean verified;
        private String photoUrl;
        private boolean deleted;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private BigDecimal currentBalance;
        private String activeSubscriptionPlan;
        private LocalDate subscriptionEndDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerRequest {
        private String regNo;

        @NotBlank(message = "Customer name is required")
        private String name;

        private String email;

        @NotBlank(message = "Mobile number is required")
        private String mobile;

        private String fatherMobile;
        private String gender;
        private String collegeOrCompany;
        private String academicYear;
        private String branch;
        private String address;
        private String city;
        private LocalDate dob;
        private String reference;
        private BigDecimal openingBalance = BigDecimal.ZERO;
        private String photoUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OtpVerifyRequest {
        @NotBlank(message = "Mobile number is required")
        private String mobile;

        @NotBlank(message = "OTP code is required")
        private String otpCode;
    }
}
