package com.mess.management.service;

import com.mess.management.dto.ExpenseDTOs.*;
import com.mess.management.entity.Expense;
import com.mess.management.exception.ResourceNotFoundException;
import com.mess.management.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseDTO createExpense(ExpenseRequest request) {
        Expense expense = Expense.builder()
                .category(request.getCategory())
                .title(request.getTitle())
                .amount(request.getAmount())
                .expenseDate(request.getExpenseDate())
                .paymentMode(request.getPaymentMode() != null ? request.getPaymentMode() : "CASH")
                .notes(request.getNotes())
                .build();

        Expense saved = expenseRepository.save(expense);
        return mapToDTO(saved);
    }

    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ExpenseDTO> getExpensesBetween(LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(startDate, endDate)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        expenseRepository.delete(expense);
    }

    public ExpenseDTO mapToDTO(Expense exp) {
        return ExpenseDTO.builder()
                .id(exp.getId())
                .category(exp.getCategory())
                .title(exp.getTitle())
                .amount(exp.getAmount())
                .expenseDate(exp.getExpenseDate())
                .paymentMode(exp.getPaymentMode())
                .notes(exp.getNotes())
                .createdAt(exp.getCreatedAt())
                .build();
    }
}
