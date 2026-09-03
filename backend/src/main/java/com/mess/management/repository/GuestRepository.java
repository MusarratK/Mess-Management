package com.mess.management.repository;

import com.mess.management.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {

    List<Guest> findByDate(LocalDate date);

    List<Guest> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
