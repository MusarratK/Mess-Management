package com.mess.management.controller;

import com.mess.management.dto.ApiResponse;
import com.mess.management.dto.NotificationDTOs.*;
import com.mess.management.entity.Customer;
import com.mess.management.entity.MessSubscription;
import com.mess.management.repository.CustomerRepository;
import com.mess.management.repository.MessSubscriptionRepository;
import com.mess.management.service.CustomerService;
import com.mess.management.service.WhatsAppService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "WhatsApp Notifications", description = "Endpoints for ad-hoc WhatsApp messages, broadcasts, and automated reminders")
public class NotificationController {

    private final WhatsAppService whatsAppService;
    private final CustomerRepository customerRepository;
    private final CustomerService customerService;
    private final MessSubscriptionRepository subscriptionRepository;

    @PostMapping("/whatsapp/send")
    @Operation(summary = "Send ad-hoc WhatsApp message to a customer")
    public ResponseEntity<ApiResponse<Boolean>> sendWhatsAppMessage(@Valid @RequestBody WhatsAppMessageRequest request) {
        boolean sent = whatsAppService.sendTextMessage(request.getRecipientMobile(), request.getMessageText());
        return ResponseEntity.ok(ApiResponse.success("Message dispatched", sent));
    }

    @PostMapping("/whatsapp/broadcast")
    @Operation(summary = "Send broadcast WhatsApp message to a filtered customer group")
    public ResponseEntity<ApiResponse<Integer>> sendBroadcast(@Valid @RequestBody BroadcastRequest request) {
        List<Customer> recipients;
        if (request.getCustomerIds() != null && !request.getCustomerIds().isEmpty()) {
            recipients = customerRepository.findAllById(request.getCustomerIds());
        } else if ("UNVERIFIED".equalsIgnoreCase(request.getFilterGroup())) {
            recipients = customerRepository.findByDeletedFalse().stream().filter(c -> !c.isVerified()).toList();
        } else {
            recipients = customerRepository.findByDeletedFalse();
        }

        int count = 0;
        for (Customer c : recipients) {
            boolean sent = whatsAppService.sendTextMessage(c.getMobile(), request.getMessageText());
            if (sent) count++;
        }

        return ResponseEntity.ok(ApiResponse.success("Broadcast sent to " + count + " recipients", count));
    }

    @PostMapping("/reminders/due-payments")
    @Operation(summary = "Trigger automated WhatsApp payment due reminders to customers with outstanding balances")
    public ResponseEntity<ApiResponse<Integer>> triggerPaymentReminders() {
        List<Customer> activeCustomers = customerRepository.findByDeletedFalse();
        int sentCount = 0;

        for (Customer c : activeCustomers) {
            var dto = customerService.mapToDTO(c);
            if (dto.getCurrentBalance() != null && dto.getCurrentBalance().compareTo(java.math.BigDecimal.ZERO) > 0) {
                boolean sent = whatsAppService.sendPaymentReminder(c.getMobile(), c.getName(), dto.getCurrentBalance().toString());
                if (sent) sentCount++;
            }
        }

        return ResponseEntity.ok(ApiResponse.success("Payment reminders sent to " + sentCount + " customers", sentCount));
    }

    @PostMapping("/reminders/mess-ending")
    @Operation(summary = "Trigger automated WhatsApp alerts for subscriptions ending in next 5 days")
    public ResponseEntity<ApiResponse<Integer>> triggerMessEndingAlerts() {
        LocalDate today = LocalDate.now();
        List<MessSubscription> endingSoon = subscriptionRepository.findSubscriptionsEndingBetween(today, today.plusDays(5));
        int count = 0;

        for (MessSubscription sub : endingSoon) {
            boolean sent = whatsAppService.sendMessEndingAlert(
                    sub.getCustomer().getMobile(),
                    sub.getCustomer().getName(),
                    sub.getEndDate().toString()
            );
            if (sent) count++;
        }

        return ResponseEntity.ok(ApiResponse.success("Mess ending alerts sent to " + count + " customers", count));
    }
}
