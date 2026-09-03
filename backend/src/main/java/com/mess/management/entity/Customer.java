package com.mess.management.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reg_no", nullable = false, unique = true, length = 50)
    private String regNo;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String mobile;

    @Column(name = "father_mobile", length = 20)
    private String fatherMobile;

    @Column(length = 20)
    private String gender;

    @Column(name = "college_or_company", length = 150)
    private String collegeOrCompany;

    @Column(name = "academic_year", length = 50)
    private String academicYear;

    @Column(length = 100)
    private String branch;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    private LocalDate dob;

    @Column(length = 100)
    private String reference;

    @Column(name = "opening_balance", nullable = false)
    private BigDecimal openingBalance = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(name = "photo_url", columnDefinition = "LONGTEXT")
    private String photoUrl;

    @Column(nullable = false)
    private boolean deleted = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
