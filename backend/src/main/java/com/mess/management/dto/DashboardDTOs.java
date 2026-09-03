package com.mess.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardSummaryDTO {
        private long totalActiveCustomers;
        private long unverifiedCustomersCount;
        private long todayBirthdaysCount;
        private long newRegistrationsCount; // last 5 days
        private long subscriptionsEndingSoonCount; // ending in 5 days
        private long todayAttendanceCount;
        private BigDecimal todayGuestRevenue;
        private BigDecimal todayExpenses;
        private List<CustomerDTOs.CustomerDTO> todayBirthdays;
        private List<MessSubscriptionDTOs.MessSubscriptionDTO> subscriptionsEndingSoon;
        private List<CustomerDTOs.CustomerDTO> outstandingPaymentsCustomers;
        private List<PlanDTOs.PlanDTO> activePlans;
    }
}
