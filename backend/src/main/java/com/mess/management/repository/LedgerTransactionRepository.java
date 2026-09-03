package com.mess.management.repository;

import com.mess.management.entity.LedgerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LedgerTransactionRepository extends JpaRepository<LedgerTransaction, Long> {

    List<LedgerTransaction> findByLedgerIdOrderByTransactionDateDesc(Long ledgerId);

    List<LedgerTransaction> findByCustomerIdOrderByTransactionDateDesc(Long customerId);

    @Query("SELECT lt FROM LedgerTransaction lt WHERE lt.transactionDate BETWEEN :startDate AND :endDate ORDER BY lt.transactionDate DESC")
    List<LedgerTransaction> findTransactionsBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
