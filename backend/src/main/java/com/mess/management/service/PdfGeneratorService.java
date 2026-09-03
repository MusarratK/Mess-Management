package com.mess.management.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.mess.management.entity.Customer;
import com.mess.management.entity.Expense;
import com.mess.management.entity.MessSubscription;
import com.mess.management.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
public class PdfGeneratorService {

    public byte[] generateCustomerIdCard(Customer customer, MessSubscription subscription) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // ID Card standard dimensions (CR80 size: 3.375 x 2.125 inches => ~243 x 153 points)
            Rectangle pageSize = new Rectangle(280, 420); // Portrait badge size
            Document document = new Document(pageSize, 15, 15, 15, 15);
            PdfWriter.getInstance(document, out);
            document.open();

            // Colors
            Color primaryColor = new Color(30, 58, 138); // Dark Indigo
            Color accentColor = new Color(245, 158, 11); // Amber
            Font titleFont = new Font(Font.HELVETICA, 14, Font.BOLD, primaryColor);
            Font subTitleFont = new Font(Font.HELVETICA, 8, Font.BOLD, Color.GRAY);
            Font labelFont = new Font(Font.HELVETICA, 8, Font.BOLD, Color.DARK_GRAY);
            Font valueFont = new Font(Font.HELVETICA, 8, Font.NORMAL, Color.BLACK);

            // Header Table
            PdfPTable headerTable = new PdfPTable(1);
            headerTable.setWidthPercentage(100);

            PdfPCell cellHeader = new PdfPCell(new Phrase("MESS CANTEEN ID CARD", titleFont));
            cellHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
            cellHeader.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(cellHeader);

            PdfPCell cellSubHeader = new PdfPCell(new Phrase("DIGITAL MEMBERSHIP BADGE", subTitleFont));
            cellSubHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
            cellSubHeader.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(cellSubHeader);

            document.add(headerTable);
            document.add(new Paragraph("\n"));

            // Customer Details Grid Table
            PdfPTable detailsTable = new PdfPTable(2);
            detailsTable.setWidthPercentage(100);
            detailsTable.setWidths(new float[]{1f, 2f});

            addDetailRow(detailsTable, "Reg No:", customer.getRegNo(), labelFont, valueFont);
            addDetailRow(detailsTable, "Name:", customer.getName(), labelFont, valueFont);
            addDetailRow(detailsTable, "Mobile:", customer.getMobile(), labelFont, valueFont);
            if (customer.getCollegeOrCompany() != null) {
                addDetailRow(detailsTable, "Org/College:", customer.getCollegeOrCompany(), labelFont, valueFont);
            }

            if (subscription != null) {
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
                addDetailRow(detailsTable, "Plan:", subscription.getPlan().getName(), labelFont, valueFont);
                addDetailRow(detailsTable, "Shift:", subscription.getShift().name(), labelFont, valueFont);
                addDetailRow(detailsTable, "Valid Until:", subscription.getEndDate().format(fmt), labelFont, valueFont);
            } else {
                addDetailRow(detailsTable, "Status:", "No Active Plan", labelFont, valueFont);
            }

            document.add(detailsTable);
            document.add(new Paragraph("\n"));

            // Generate QR Code containing customer regNo
            byte[] qrImageBytes = generateQrCodeImage(customer.getRegNo(), 120, 120);
            Image qrImage = Image.getInstance(qrImageBytes);
            qrImage.setAlignment(Element.ALIGN_CENTER);
            document.add(qrImage);

            Paragraph qrText = new Paragraph("Scan for Attendance Check-In", new Font(Font.HELVETICA, 7, Font.ITALIC, Color.GRAY));
            qrText.setAlignment(Element.ALIGN_CENTER);
            document.add(qrText);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating ID card PDF: {}", e.getMessage());
            throw new BadRequestException("Could not generate customer ID card PDF");
        }
    }

    public byte[] generateCustomerReportPdf(List<Customer> customers) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 20, 20, 20, 20);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD, new Color(30, 58, 138));
            Paragraph title = new Paragraph("Mess Customer Roster Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("Generated Total Records: " + customers.size() + "\n\n"));

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.5f, 2.5f, 2f, 2f, 1.5f, 1.5f});

            addTableHeader(table, new String[]{"Reg No", "Name", "Mobile", "College/Org", "Balance", "Status"});

            Font cellFont = new Font(Font.HELVETICA, 9, Font.NORMAL);
            for (Customer c : customers) {
                table.addCell(new Phrase(c.getRegNo(), cellFont));
                table.addCell(new Phrase(c.getName(), cellFont));
                table.addCell(new Phrase(c.getMobile(), cellFont));
                table.addCell(new Phrase(c.getCollegeOrCompany() != null ? c.getCollegeOrCompany() : "-", cellFont));
                table.addCell(new Phrase("₹" + c.getOpeningBalance(), cellFont));
                table.addCell(new Phrase(c.isVerified() ? "Verified" : "Unverified", cellFont));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating customer report PDF: {}", e.getMessage());
            throw new BadRequestException("Could not generate customer report PDF");
        }
    }

    public byte[] generateExpenseReportPdf(List<Expense> expenses, String dateRangeLabel) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 20, 20, 20, 20);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD, new Color(30, 58, 138));
            Paragraph title = new Paragraph("Mess Expense Report (" + dateRangeLabel + ")", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.5f, 2f, 3f, 1.5f, 1.5f});

            addTableHeader(table, new String[]{"Date", "Category", "Title", "Payment", "Amount"});

            Font cellFont = new Font(Font.HELVETICA, 9, Font.NORMAL);
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
            double total = 0.0;

            for (Expense exp : expenses) {
                table.addCell(new Phrase(exp.getExpenseDate().format(fmt), cellFont));
                table.addCell(new Phrase(exp.getCategory(), cellFont));
                table.addCell(new Phrase(exp.getTitle(), cellFont));
                table.addCell(new Phrase(exp.getPaymentMode(), cellFont));
                table.addCell(new Phrase("₹" + exp.getAmount(), cellFont));
                total += exp.getAmount().doubleValue();
            }

            document.add(table);
            document.add(new Paragraph("\nTotal Expenses: ₹" + total, new Font(Font.HELVETICA, 12, Font.BOLD)));
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating expense report PDF: {}", e.getMessage());
            throw new BadRequestException("Could not generate expense report PDF");
        }
    }

    private void addDetailRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, labelFont));
        c1.setBorder(Rectangle.NO_BORDER);
        PdfPCell c2 = new PdfPCell(new Phrase(value, valueFont));
        c2.setBorder(Rectangle.NO_BORDER);
        table.addCell(c1);
        table.addCell(c2);
    }

    private void addTableHeader(PdfPTable table, String[] headers) {
        Font headFont = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headFont));
            cell.setBackgroundColor(new Color(30, 58, 138));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
        }
    }

    private byte[] generateQrCodeImage(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }
}
