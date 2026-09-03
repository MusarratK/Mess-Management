package com.mess.management.controller;

import com.mess.management.entity.Customer;
import com.mess.management.entity.Expense;
import com.mess.management.repository.CustomerRepository;
import com.mess.management.repository.ExpenseRepository;
import com.mess.management.service.PdfGeneratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports Hub", description = "Endpoints for downloading PDF reports")
public class ReportController {

    private final CustomerRepository customerRepository;
    private final ExpenseRepository expenseRepository;
    private final PdfGeneratorService pdfGeneratorService;

    @GetMapping("/customer/pdf")
    @Operation(summary = "Export Customer Roster PDF Report")
    public ResponseEntity<byte[]> getCustomerReportPdf() {
        List<Customer> customers = customerRepository.findByDeletedFalse();
        byte[] pdfBytes = pdfGeneratorService.generateCustomerReportPdf(customers);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Customer_Roster_Report.pdf")
                .body(pdfBytes);
    }

    @GetMapping("/expense/pdf")
    @Operation(summary = "Export Expense PDF Report for date range")
    public ResponseEntity<byte[]> getExpenseReportPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<Expense> expenses = expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(from, to);
        String label = from.toString() + " to " + to.toString();
        byte[] pdfBytes = pdfGeneratorService.generateExpenseReportPdf(expenses, label);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Expense_Report_" + from + "_to_" + to + ".pdf")
                .body(pdfBytes);
    }
}
