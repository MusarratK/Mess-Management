package com.mess.management.controller;

import com.mess.management.dto.ApiResponse;
import com.mess.management.dto.LedgerDTOs.*;
import com.mess.management.service.LedgerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Payments & Ledger", description = "Endpoints for recording customer payments and running ledger statements")
public class LedgerController {

    private final LedgerService ledgerService;

    @PostMapping("/payments")
    @Operation(summary = "Record customer payment/credit")
    public ResponseEntity<ApiResponse<LedgerTransactionDTO>> recordPayment(@Valid @RequestBody PaymentRequest request) {
        LedgerTransactionDTO dto = ledgerService.recordPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment recorded successfully", dto));
    }

    @GetMapping("/ledger/customer/{customerId}")
    @Operation(summary = "Get customer running account ledger statement (Subtotal, credit, debit, remaining balance)")
    public ResponseEntity<ApiResponse<CustomerLedgerStatementDTO>> getCustomerStatement(@PathVariable Long customerId) {
        CustomerLedgerStatementDTO statement = ledgerService.getCustomerStatement(customerId);
        return ResponseEntity.ok(ApiResponse.success(statement));
    }
}
