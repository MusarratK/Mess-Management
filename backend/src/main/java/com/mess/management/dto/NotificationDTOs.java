package com.mess.management.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class NotificationDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhatsAppMessageRequest {
        @NotBlank(message = "Recipient mobile is required")
        private String recipientMobile;

        @NotBlank(message = "Message text is required")
        private String messageText;

        private Long customerId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BroadcastRequest {
        private String filterGroup; // ALL, UNVERIFIED, ENDING_SOON, OUTSTANDING_BALANCE
        @NotBlank(message = "Message text is required")
        private String messageText;
        private List<Long> customerIds;
    }
}
