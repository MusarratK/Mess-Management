package com.mess.management.repository;

import com.mess.management.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByRegNo(String regNo);

    Optional<Customer> findByRegNoAndDeletedFalse(String regNo);

    Optional<Customer> findByMobileAndDeletedFalse(String mobile);

    List<Customer> findByDeletedFalse();

    List<Customer> findByDeletedTrue();

    Page<Customer> findByDeleted(boolean deleted, Pageable pageable);

    Page<Customer> findByDeletedFalseAndVerified(boolean verified, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.deleted = false AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "c.mobile LIKE CONCAT('%', :query, '%') OR " +
           "LOWER(c.regNo) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Customer> searchCustomers(@Param("query") String query, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.deleted = false AND MONTH(c.dob) = :month AND DAY(c.dob) = :day")
    List<Customer> findTodayBirthdays(@Param("month") int month, @Param("day") int day);

    List<Customer> findByDeletedFalseAndCreatedAtAfter(LocalDateTime after);

    long countByDeletedFalse();
    long countByDeletedFalseAndVerifiedFalse();
}
