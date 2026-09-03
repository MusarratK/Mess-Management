package com.mess.management.service;

import com.mess.management.dto.AttendanceDTOs.*;
import com.mess.management.entity.Attendance;
import com.mess.management.entity.Customer;
import com.mess.management.exception.BadRequestException;
import com.mess.management.exception.ResourceNotFoundException;
import com.mess.management.repository.AttendanceRepository;
import com.mess.management.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final CustomerRepository customerRepository;

    public List<AttendanceDTO> getAttendanceByDateAndShift(LocalDate date, String shift) {
        return attendanceRepository.findByDateAndShift(date, shift).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceDTO markAttendance(MarkAttendanceRequest request, String markedBy) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        Optional<Attendance> existingOpt = attendanceRepository
                .findByCustomerIdAndDateAndShift(customer.getId(), request.getDate(), request.getShift());

        Attendance attendance;
        if (existingOpt.isPresent()) {
            attendance = existingOpt.get();
            attendance.setStatus(Attendance.Status.valueOf(request.getStatus().toUpperCase()));
            attendance.setMarkedBy(markedBy);
        } else {
            attendance = Attendance.builder()
                    .customer(customer)
                    .date(request.getDate())
                    .shift(request.getShift())
                    .status(Attendance.Status.valueOf(request.getStatus().toUpperCase()))
                    .markedBy(markedBy)
                    .build();
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToDTO(saved);
    }

    @Transactional
    public void bulkMarkAttendance(BulkAttendanceRequest request, String markedBy) {
        for (BulkAttendanceRequest.CustomerStatus cs : request.getRecords()) {
            MarkAttendanceRequest markReq = new MarkAttendanceRequest();
            markReq.setCustomerId(cs.getCustomerId());
            markReq.setDate(request.getDate());
            markReq.setShift(request.getShift());
            markReq.setStatus(cs.getStatus());
            markAttendance(markReq, markedBy);
        }
    }

    @Transactional
    public AttendanceDTO scanQrCheckIn(QrScanAttendanceRequest request, String markedBy) {
        String qrCode = request.getQrCode().trim();
        Customer customer = customerRepository.findByRegNoAndDeletedFalse(qrCode)
                .orElseGet(() -> customerRepository.findByMobileAndDeletedFalse(qrCode)
                .orElseThrow(() -> new ResourceNotFoundException("No active customer found for QR Code/RegNo: " + qrCode)));

        LocalDate today = LocalDate.now();
        String shift = request.getShift() != null ? request.getShift() : "BOTH";

        MarkAttendanceRequest markReq = new MarkAttendanceRequest();
        markReq.setCustomerId(customer.getId());
        markReq.setDate(today);
        markReq.setShift(shift);
        markReq.setStatus("PRESENT");

        return markAttendance(markReq, markedBy);
    }

    public AttendanceDTO mapToDTO(Attendance att) {
        return AttendanceDTO.builder()
                .id(att.getId())
                .customerId(att.getCustomer().getId())
                .customerName(att.getCustomer().getName())
                .customerRegNo(att.getCustomer().getRegNo())
                .customerMobile(att.getCustomer().getMobile())
                .date(att.getDate())
                .shift(att.getShift())
                .status(att.getStatus().name())
                .markedBy(att.getMarkedBy())
                .createdAt(att.getCreatedAt())
                .build();
    }
}
