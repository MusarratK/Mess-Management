package com.mess.management.config;

import com.mess.management.entity.Plan;
import com.mess.management.entity.User;
import com.mess.management.repository.PlanRepository;
import com.mess.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PlanRepository planRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Ensure Admin User exists with correct BCrypt password 'admin123'
        Optional<User> adminOpt = userRepository.findByEmail("admin@mess.com");
        User admin;
        if (adminOpt.isPresent()) {
            admin = adminOpt.get();
        } else {
            admin = new User();
            admin.setEmail("admin@mess.com");
            admin.setName("System Admin");
            admin.setMobile("9876543210");
            admin.setRole(User.Role.ADMIN);
        }
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setActive(true);
        userRepository.save(admin);
        log.info(">> Guaranteed Admin User credentials: admin@mess.com / admin123");

        // 2. Ensure Staff User exists with correct BCrypt password 'staff123'
        Optional<User> staffOpt = userRepository.findByEmail("staff@mess.com");
        User staff;
        if (staffOpt.isPresent()) {
            staff = staffOpt.get();
        } else {
            staff = new User();
            staff.setEmail("staff@mess.com");
            staff.setName("Canteen Staff Operator");
            staff.setMobile("9123456789");
            staff.setRole(User.Role.STAFF);
        }
        staff.setPassword(passwordEncoder.encode("staff123"));
        staff.setActive(true);
        userRepository.save(staff);
        log.info(">> Guaranteed Staff User credentials: staff@mess.com / staff123");

        // 3. Seed Sample Mess Plans if missing
        if (planRepository.count() == 0) {
            Plan monthlyPlan = Plan.builder()
                    .name("Monthly Standard Mess Plan")
                    .description("Full 30 days unlimited morning and evening meals.")
                    .fromDay(1)
                    .toDay(30)
                    .rate(new BigDecimal("3000.00"))
                    .active(true)
                    .build();

            Plan halfMonthPlan = Plan.builder()
                    .name("15-Day Half Month Plan")
                    .description("15 days morning + evening mess membership.")
                    .fromDay(1)
                    .toDay(15)
                    .rate(new BigDecimal("1600.00"))
                    .active(true)
                    .build();

            Plan vipPlan = Plan.builder()
                    .name("VIP Executive Plan")
                    .description("30 days unlimited meals + special Sunday feast.")
                    .fromDay(1)
                    .toDay(30)
                    .rate(new BigDecimal("4000.00"))
                    .active(true)
                    .build();

            planRepository.save(monthlyPlan);
            planRepository.save(halfMonthPlan);
            planRepository.save(vipPlan);
            log.info(">> Sample Mess Plans seeded successfully.");
        }
    }
}
