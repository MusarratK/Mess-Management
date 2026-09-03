package com.mess.management.service;

import com.mess.management.dto.CustomerDTOs.*;
import com.mess.management.dto.DashboardDTOs.*;
import com.mess.management.dto.MessSubscriptionDTOs.*;
import com.mess.management.dto.PlanDTOs.*;
import com.mess.management.entity.*;
import com.mess.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final MessSubscriptionRepository subscriptionRepository;
    private final AttendanceRepository attendanceRepository;
    private final GuestRepository guestRepository;
    private final ExpenseRepository expenseRepository;
    private final PlanRepository planRepository;
    private final CustomerService customerService;
    private final MessSubscriptionService subscriptionService;
    private final PlanService planService;

    public DashboardSummaryDTO getDashboardSummary() {
        LocalDate today = LocalDate.now();

        // 1. Birthdays today
        List<Customer> birthdayCustomers = customerRepository.findTodayBirthdays(today.getMonthValue(), today.getDayOfMonth());
        List<CustomerDTO> birthdayDTOs = birthdayCustomers.stream().map(customerService::mapToDTO).collect(Collectors.toList());

        // 2. New registrations in last 5 days
        LocalDateTime fiveDaysAgo = LocalDateTime.now().minusDays(5);
        List<Customer> newCustomers = customerRepository.findByDeletedFalseAndCreatedAtAfter(fiveDaysAgo);

        // 3. Subscriptions ending in 5 days
        List<MessSubscription> endingSoonSubs = subscriptionRepository.findSubscriptionsEndingBetween(today, today.plusDays(5));
        List<MessSubscriptionDTO> endingSoonDTOs = endingSoonSubs.stream().map(subscriptionService::mapToDTO).collect(Collectors.toList());

        // 4. Today attendance
        long todayAttendance = attendanceRepository.countPresentByDate(today);

        // 5. Today guest revenue
        BigDecimal guestRevenue = guestRepository.findByDate(today).stream()
                .map(Guest::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 6. Today expenses
        BigDecimal todayExpenseSum = expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(today, today).stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 7. Outstanding payments customers (customers with balance > 0)
        List<CustomerDTO> outstandingCustomers = customerRepository.findByDeletedFalse().stream()
                .map(customerService::mapToDTO)
                .filter(c -> c.getCurrentBalance() != null && c.getCurrentBalance().compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toList());

        // 8. Active Plans
        List<PlanDTO> activePlans = planService.getActivePlans();

        long activeCount = customerRepository.countByDeletedFalse();
        long unverifiedCount = customerRepository.countByDeletedFalseAndVerifiedFalse();

        return DashboardSummaryDTO.builder()
                .totalActiveCustomers(activeCount)
                .unverifiedCustomersCount(unverifiedCount)
                .todayBirthdaysCount(birthdayCustomers.size())
                .newRegistrationsCount(newCustomers.size())
                .subscriptionsEndingSoonCount(endingSoonSubs.size())
                .todayAttendanceCount(todayAttendance)
                .todayGuestRevenue(guestRevenue)
                .todayExpenses(todayExpenseSum)
                .todayBirthdays(birthdayDTOs)
                .subscriptionsEndingSoon(endingSoonDTOs)
                .outstandingPaymentsCustomers(outstandingCustomers)
                .activePlans(activePlans)
                .build();
    }
}
