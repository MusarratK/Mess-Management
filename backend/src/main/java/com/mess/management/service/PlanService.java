package com.mess.management.service;

import com.mess.management.dto.PlanDTOs.*;
import com.mess.management.entity.Plan;
import com.mess.management.exception.ResourceNotFoundException;
import com.mess.management.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<PlanDTO> getAllPlans() {
        return planRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<PlanDTO> getActivePlans() {
        return planRepository.findByActiveTrue().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public PlanDTO getPlanById(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + id));
        return mapToDTO(plan);
    }

    public PlanDTO createPlan(PlanRequest request) {
        Plan plan = Plan.builder()
                .name(request.getName())
                .description(request.getDescription())
                .fromDay(request.getFromDay())
                .toDay(request.getToDay())
                .rate(request.getRate())
                .active(request.isActive())
                .build();

        Plan saved = planRepository.save(plan);
        return mapToDTO(saved);
    }

    public PlanDTO updatePlan(Long id, PlanRequest request) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + id));

        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setFromDay(request.getFromDay());
        plan.setToDay(request.getToDay());
        plan.setRate(request.getRate());
        plan.setActive(request.isActive());

        Plan updated = planRepository.save(plan);
        return mapToDTO(updated);
    }

    public void deletePlan(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + id));
        planRepository.delete(plan);
    }

    public PlanDTO mapToDTO(Plan plan) {
        return PlanDTO.builder()
                .id(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .fromDay(plan.getFromDay())
                .toDay(plan.getToDay())
                .rate(plan.getRate())
                .active(plan.isActive())
                .createdAt(plan.getCreatedAt())
                .build();
    }
}
