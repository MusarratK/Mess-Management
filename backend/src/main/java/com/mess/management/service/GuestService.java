package com.mess.management.service;

import com.mess.management.dto.GuestDTOs.*;
import com.mess.management.entity.Guest;
import com.mess.management.exception.ResourceNotFoundException;
import com.mess.management.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestService {

    private final GuestRepository guestRepository;

    public GuestDTO logGuest(GuestRequest request) {
        BigDecimal total = request.getRatePerGuest().multiply(BigDecimal.valueOf(request.getNumberOfGuests()));

        Guest guest = Guest.builder()
                .guestName(request.getGuestName())
                .mobile(request.getMobile())
                .date(request.getDate())
                .shift(request.getShift() != null ? request.getShift() : "BOTH")
                .numberOfGuests(request.getNumberOfGuests())
                .ratePerGuest(request.getRatePerGuest())
                .totalAmount(total)
                .paymentMode(request.getPaymentMode() != null ? request.getPaymentMode() : "CASH")
                .notes(request.getNotes())
                .build();

        Guest saved = guestRepository.save(guest);
        return mapToDTO(saved);
    }

    public List<GuestDTO> getGuestsByDate(LocalDate date) {
        return guestRepository.findByDate(date).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<GuestDTO> getGuestsByDateRange(LocalDate startDate, LocalDate endDate) {
        return guestRepository.findByDateBetween(startDate, endDate).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public GuestDTO mapToDTO(Guest guest) {
        return GuestDTO.builder()
                .id(guest.getId())
                .guestName(guest.getGuestName())
                .mobile(guest.getMobile())
                .date(guest.getDate())
                .shift(guest.getShift())
                .numberOfGuests(guest.getNumberOfGuests())
                .ratePerGuest(guest.getRatePerGuest())
                .totalAmount(guest.getTotalAmount())
                .paymentMode(guest.getPaymentMode())
                .notes(guest.getNotes())
                .createdAt(guest.getCreatedAt())
                .build();
    }
}
