package com.mess.management.controller;

import com.mess.management.dto.ApiResponse;
import com.mess.management.dto.GuestDTOs.*;
import com.mess.management.service.GuestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/guests")
@RequiredArgsConstructor
@Tag(name = "Walk-in Guests", description = "Endpoints for logging walk-in non-member guest meals")
public class GuestController {

    private final GuestService guestService;

    @PostMapping
    @Operation(summary = "Log walk-in guest meal entry")
    public ResponseEntity<ApiResponse<GuestDTO>> logGuest(@Valid @RequestBody GuestRequest request) {
        GuestDTO dto = guestService.logGuest(request);
        return ResponseEntity.ok(ApiResponse.success("Guest meal logged successfully", dto));
    }

    @GetMapping
    @Operation(summary = "Get guest entries by date or date range")
    public ResponseEntity<ApiResponse<List<GuestDTO>>> getGuests(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<GuestDTO> guests;
        if (from != null && to != null) {
            guests = guestService.getGuestsByDateRange(from, to);
        } else if (date != null) {
            guests = guestService.getGuestsByDate(date);
        } else {
            guests = guestService.getGuestsByDate(LocalDate.now());
        }
        return ResponseEntity.ok(ApiResponse.success(guests));
    }
}
