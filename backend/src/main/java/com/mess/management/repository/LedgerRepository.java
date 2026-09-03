package com.mess.management.repository;

import com.mess.management.entity.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {

    Optional<Ledger> findByCustomerId(Long customerId);

    Optional<Ledger> findByAccountType(Ledger.AccountType accountType);
}
