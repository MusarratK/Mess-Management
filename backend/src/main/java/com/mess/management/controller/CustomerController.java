package com.mess.management.controller;

import com.mess.management.dto.ApiResponse;
import com.mess.management.dto.CustomerDTOs.*;
import com.mess.management.dto.PageResponse;
import com.mess.management.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Tag(name = "Customers", description = "Endpoints for Customer CRUD, WhatsApp OTP verification, and ID cards")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "Get paginated list of customers with search and status filter")
    public ResponseEntity<ApiResponse<PageResponse<CustomerDTO>>> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        PageResponse<CustomerDTO> response = customerService.getCustomers(page, size, search, status);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Add a new customer profile")
    public ResponseEntity<ApiResponse<CustomerDTO>> createCustomer(@Valid @RequestBody CustomerRequest request) {
        CustomerDTO dto = customerService.createCustomer(request);
        return ResponseEntity.ok(ApiResponse.success("Customer created successfully", dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer details by ID")
    public ResponseEntity<ApiResponse<CustomerDTO>> getCustomerById(@PathVariable Long id) {
        CustomerDTO dto = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/reg/{regNo}")
    @Operation(summary = "Get customer details by Registration No or Barcode")
    public ResponseEntity<ApiResponse<CustomerDTO>> getCustomerByRegNo(@PathVariable String regNo) {
        CustomerDTO dto = customerService.getCustomerByRegNo(regNo);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer profile details")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest request) {
        CustomerDTO dto = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete customer")
    public ResponseEntity<ApiResponse<Void>> softDeleteCustomer(@PathVariable Long id) {
        customerService.softDeleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted successfully", null));
    }

    @PostMapping("/{id}/restore")
    @Operation(summary = "Restore soft-deleted customer")
    public ResponseEntity<ApiResponse<Void>> restoreCustomer(@PathVariable Long id) {
        customerService.restoreCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer restored successfully", null));
    }

    @PostMapping("/{id}/otp/send")
    @Operation(summary = "Send WhatsApp OTP to customer mobile")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@PathVariable Long id) {
        customerService.sendWhatsAppOtp(id);
        return ResponseEntity.ok(ApiResponse.success("WhatsApp OTP sent successfully", null));
    }

    @PostMapping("/{id}/otp/verify")
    @Operation(summary = "Verify customer WhatsApp OTP")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(
            @PathVariable Long id,
            @RequestBody OtpVerifyRequest request) {
        boolean verified = customerService.verifyWhatsAppOtp(id, request.getOtpCode());
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", verified));
    }

    @GetMapping("/{id}/id-card")
    @Operation(summary = "Download/Stream printable Customer ID Card PDF with barcode/QR code")
    public ResponseEntity<byte[]> getCustomerIdCardPdf(@PathVariable Long id) {
        byte[] pdfBytes = customerService.generateCustomerIdCardPdf(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Customer_ID_Card_" + id + ".pdf")
                .body(pdfBytes);
    }
}
