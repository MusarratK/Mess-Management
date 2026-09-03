package com.mess.management.repository;

import com.mess.management.entity.MessSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MessSubscriptionRepository extends JpaRepository<MessSubscription, Long> {

    List<MessSubscription> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Optional<MessSubscription> findFirstByCustomerIdAndStatusOrderByCreatedAtDesc(Long customerId, MessSubscription.Status status);

    List<MessSubscription> findByStatus(MessSubscription.Status status);

    @Query("SELECT m FROM MessSubscription m WHERE m.status = 'ACTIVE' AND m.endDate BETWEEN :startDate AND :endDate")
    List<MessSubscription> findSubscriptionsEndingBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT m FROM MessSubscription m WHERE m.status = 'ACTIVE' AND m.endDate < :today")
    List<MessSubscription> findExpiredActiveSubscriptions(@Param("today") LocalDate today);

    long countByStatus(MessSubscription.Status status);
}
