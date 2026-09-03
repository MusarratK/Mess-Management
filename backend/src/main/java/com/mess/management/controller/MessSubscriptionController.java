package com.mess.management.controller;

import com.mess.management.dto.ApiResponse;
import com.mess.management.dto.MessSubscriptionDTOs.*;
import com.mess.management.service.MessSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mess")
@RequiredArgsConstructor
@Tag(name = "Mess Subscriptions", description = "Endpoints for assigning and managing customer mess subscriptions")
public class MessSubscriptionController {

    private final MessSubscriptionService subscriptionService;

    @GetMapping
    @Operation(summary = "Get list of all mess subscriptions")
    public ResponseEntity<ApiResponse<List<MessSubscriptionDTO>>> getAllSubscriptions(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer endingInDays) {
        List<MessSubscriptionDTO> subs;
        if (customerId != null) {
            subs = subscriptionService.getSubscriptionsByCustomer(customerId);
        } else if (endingInDays != null) {
            subs = subscriptionService.getSubscriptionsEndingSoon(endingInDays);
        } else {
            subs = subscriptionService.getAllSubscriptions();
        }
        return ResponseEntity.ok(ApiResponse.success(subs));
    }

    @PostMapping
    @Operation(summary = "Assign mess plan subscription to a customer")
    public ResponseEntity<ApiResponse<MessSubscriptionDTO>> assignPlan(@Valid @RequestBody AssignPlanRequest request) {
        MessSubscriptionDTO dto = subscriptionService.assignPlan(request);
        return ResponseEntity.ok(ApiResponse.success("Plan assigned successfully", dto));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update mess subscription status (ACTIVE, ENDED, CANCELLED)")
    public ResponseEntity<ApiResponse<Void>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        subscriptionService.updateSubscriptionStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Subscription status updated successfully", null));
    }
}
