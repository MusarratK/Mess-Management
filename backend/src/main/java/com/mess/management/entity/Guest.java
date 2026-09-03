package com.mess.management.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "guests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "guest_name", nullable = false, length = 100)
    private String guestName;

    @Column(length = 20)
    private String mobile;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 20)
    private String shift = "BOTH";

    @Column(name = "number_of_guests", nullable = false)
    private Integer numberOfGuests = 1;

    @Column(name = "rate_per_guest", nullable = false, precision = 10, scale = 2)
    private BigDecimal ratePerGuest;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "payment_mode", nullable = false, length = 30)
    private String paymentMode = "CASH";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
