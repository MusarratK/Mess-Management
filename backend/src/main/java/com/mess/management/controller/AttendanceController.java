package com.mess.management.controller;

import com.mess.management.dto.ApiResponse;
import com.mess.management.dto.AttendanceDTOs.*;
import com.mess.management.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance Register", description = "Endpoints for daily attendance register and QR scan check-in")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    @Operation(summary = "Get daily attendance register by date and shift")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "BOTH") String shift) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<AttendanceDTO> list = attendanceService.getAttendanceByDateAndShift(targetDate, shift);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/mark")
    @Operation(summary = "Mark attendance for a single customer")
    public ResponseEntity<ApiResponse<AttendanceDTO>> markAttendance(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MarkAttendanceRequest request) {
        String markedBy = userDetails != null ? userDetails.getUsername() : "ADMIN";
        AttendanceDTO dto = attendanceService.markAttendance(request, markedBy);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked", dto));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Bulk mark attendance for multiple customers")
    public ResponseEntity<ApiResponse<Void>> bulkMarkAttendance(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BulkAttendanceRequest request) {
        String markedBy = userDetails != null ? userDetails.getUsername() : "ADMIN";
        attendanceService.bulkMarkAttendance(request, markedBy);
        return ResponseEntity.ok(ApiResponse.success("Bulk attendance saved successfully", null));
    }

    @PostMapping("/scan")
    @Operation(summary = "Mark attendance instantly by scanning Customer QR code or Barcode RegNo")
    public ResponseEntity<ApiResponse<AttendanceDTO>> scanQrCheckIn(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody QrScanAttendanceRequest request) {
        String markedBy = userDetails != null ? userDetails.getUsername() : "ADMIN";
        AttendanceDTO dto = attendanceService.scanQrCheckIn(request, markedBy);
        return ResponseEntity.ok(ApiResponse.success("QR Scan Check-In Successful for " + dto.getCustomerName(), dto));
    }
}
