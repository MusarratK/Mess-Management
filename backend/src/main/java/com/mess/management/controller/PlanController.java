package com.mess.management.controller;

import com.mess.management.dto.ApiResponse;
import com.mess.management.dto.PlanDTOs.*;
import com.mess.management.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/plans")
@RequiredArgsConstructor
@Tag(name = "Mess Plans", description = "Endpoints for managing mess subscription plans")
public class PlanController {

    private final PlanService planService;

    @GetMapping
    @Operation(summary = "Get list of all mess plans")
    public ResponseEntity<ApiResponse<List<PlanDTO>>> getAllPlans(@RequestParam(required = false) Boolean active) {
        List<PlanDTO> plans = (active != null && active) ? planService.getActivePlans() : planService.getAllPlans();
        return ResponseEntity.ok(ApiResponse.success(plans));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get mess plan by ID")
    public ResponseEntity<ApiResponse<PlanDTO>> getPlanById(@PathVariable Long id) {
        PlanDTO plan = planService.getPlanById(id);
        return ResponseEntity.ok(ApiResponse.success(plan));
    }

    @PostMapping
    @Operation(summary = "Create a new mess plan")
    public ResponseEntity<ApiResponse<PlanDTO>> createPlan(@Valid @RequestBody PlanRequest request) {
        PlanDTO plan = planService.createPlan(request);
        return ResponseEntity.ok(ApiResponse.success("Plan created successfully", plan));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update mess plan")
    public ResponseEntity<ApiResponse<PlanDTO>> updatePlan(@PathVariable Long id, @Valid @RequestBody PlanRequest request) {
        PlanDTO plan = planService.updatePlan(id, request);
        return ResponseEntity.ok(ApiResponse.success("Plan updated successfully", plan));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete mess plan")
    public ResponseEntity<ApiResponse<Void>> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.ok(ApiResponse.success("Plan deleted successfully", null));
    }
}
