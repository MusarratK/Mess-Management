package com.mess.management.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class WhatsAppService {

    @Value("${app.whatsapp.api-url}")
    private String apiUrl;

    @Value("${app.whatsapp.phone-number-id}")
    private String phoneNumberId;

    @Value("${app.whatsapp.access-token}")
    private String accessToken;

    @Value("${app.whatsapp.enabled:false}")
    private boolean enabled;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendTextMessage(String toMobile, String textMessage) {
        log.info("[WhatsApp Message] To: {} | Message: {}", toMobile, textMessage);

        if (!enabled || "mock_access_token".equals(accessToken)) {
            log.info(">> [MOCK WHATSAPP SENT] Mobile: {} | Content: {}", toMobile, textMessage);
            return true;
        }

        try {
            String url = String.format("%s/%s/messages", apiUrl, phoneNumberId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            Map<String, Object> textBody = new HashMap<>();
            textBody.put("body", textMessage);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("messaging_product", "whatsapp");
            requestBody.put("recipient_type", "individual");
            requestBody.put("to", sanitizePhoneNumber(toMobile));
            requestBody.put("type", "text");
            requestBody.put("text", textBody);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message to {}: {}", toMobile, e.getMessage());
            return false;
        }
    }

    public boolean sendOtpMessage(String toMobile, String otpCode) {
        String message = String.format("🔐 Your OTP for Mess Management verification is: %s. Valid for 10 minutes. Do not share this OTP with anyone.", otpCode);
        return sendTextMessage(toMobile, message);
    }

    public boolean sendPaymentReminder(String toMobile, String customerName, String amountDue) {
        String message = String.format("📢 Hello %s, this is a reminder from your Mess/Canteen. You have an outstanding balance of ₹%s. Kindly clear your dues at your earliest convenience. Thank you!", customerName, amountDue);
        return sendTextMessage(toMobile, message);
    }

    public boolean sendMessEndingAlert(String toMobile, String customerName, String endDate) {
        String message = String.format("⚠️ Hello %s, your mess subscription will end on %s. Please renew your mess plan to continue enjoying delicious meals!", customerName, endDate);
        return sendTextMessage(toMobile, message);
    }

    private String sanitizePhoneNumber(String phone) {
        if (phone == null) return "";
        String cleaned = phone.replaceAll("[^0-9]", "");
        if (cleaned.length() == 10) {
            cleaned = "91" + cleaned; // Default India prefix if 10 digits
        }
        return cleaned;
    }
}
