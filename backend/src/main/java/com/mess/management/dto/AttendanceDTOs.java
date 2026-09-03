package com.mess.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AttendanceDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceDTO {
        private Long id;
        private Long customerId;
        private String customerName;
        private String customerRegNo;
        private String customerMobile;
        private LocalDate date;
        private String shift;
        private String status;
        private String markedBy;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MarkAttendanceRequest {
        @NotNull(message = "Customer ID is required")
        private Long customerId;

        @NotNull(message = "Date is required")
        private LocalDate date;

        private String shift = "BOTH";
        private String status = "PRESENT";
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulkAttendanceRequest {
        @NotNull(message = "Date is required")
        private LocalDate date;

        private String shift = "BOTH";

        @NotNull(message = "Attendance records are required")
        private List<CustomerStatus> records;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class CustomerStatus {
            private Long customerId;
            private String status;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QrScanAttendanceRequest {
        @NotBlank(message = "QR/Barcode string is required")
        private String qrCode;

        private String shift = "BOTH";
    }
}
