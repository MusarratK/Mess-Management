package com.mess.management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PlanDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlanDTO {
        private Long id;
        private String name;
        private String description;
        private Integer fromDay;
        private Integer toDay;
        private BigDecimal rate;
        private boolean active;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlanRequest {
        @NotBlank(message = "Plan name is required")
        private String name;

        private String description;

        @NotNull(message = "From Day is required")
        @Min(value = 1, message = "From Day must be at least 1")
        private Integer fromDay;

        @NotNull(message = "To Day is required")
        @Min(value = 1, message = "To Day must be at least 1")
        private Integer toDay;

        @NotNull(message = "Rate is required")
        private BigDecimal rate;

        private boolean active = true;
    }
}
