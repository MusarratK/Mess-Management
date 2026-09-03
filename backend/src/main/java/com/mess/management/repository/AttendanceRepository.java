package com.mess.management.repository;

import com.mess.management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByDateAndShift(LocalDate date, String shift);

    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);

    Optional<Attendance> findByCustomerIdAndDateAndShift(Long customerId, LocalDate date, String shift);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = 'PRESENT'")
    long countPresentByDate(@Param("date") LocalDate date);
}
