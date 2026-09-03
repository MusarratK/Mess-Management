package com.mess.management.controller;

import com.mess.management.dto.ApiResponse;
import com.mess.management.dto.ExpenseDTOs.*;
import com.mess.management.service.ExpenseService;
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
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Module", description = "Endpoints for recording daily operational expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @Operation(summary = "Log new daily expense")
    public ResponseEntity<ApiResponse<ExpenseDTO>> createExpense(@Valid @RequestBody ExpenseRequest request) {
        ExpenseDTO dto = expenseService.createExpense(request);
        return ResponseEntity.ok(ApiResponse.success("Expense logged successfully", dto));
    }

    @GetMapping
    @Operation(summary = "Get list of expenses with optional date range filter")
    public ResponseEntity<ApiResponse<List<ExpenseDTO>>> getExpenses(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<ExpenseDTO> list;
        if (from != null && to != null) {
            list = expenseService.getExpensesBetween(from, to);
        } else {
            list = expenseService.getAllExpenses();
        }
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense entry")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }
}
