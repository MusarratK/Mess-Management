# Mess Management - Full-Stack Mess & Canteen Management System

A modern, responsive, production-ready Full-Stack Mess Management System built with **Spring Boot 3.x (Java 17+)** and **React 18 (Vite + Tailwind CSS)**. It digitizes customer records, attendance tracking, mess subscription billing, running ledger balances, operational expenses, and PDF reporting — replacing paper registers and SMS with integrated **WhatsApp Business Messaging (OTP verification, payment reminders, mess ending alerts)**.

---

## Key Features

- 🔐 **JWT Authentication & Security**: Secure admin authentication with access + refresh token rotation and BCrypt hashing.
- 📱 **WhatsApp Integration (OTP & Reminders)**: Sends OTP verification codes, payment due reminders, mess ending alerts, and broadcast messages via Meta WhatsApp Cloud API (with built-in sandbox mock engine).
- 🎴 **Printable Digital ID Cards**: Generates downloadable PDF customer ID cards containing photo, mess validity dates, and ZXing barcode/QR codes.
- 📷 **Device WebCam Photo Capture**: Built-in `getUserMedia` camera snapshot support for capturing customer photos on desktop and mobile.
- 🔍 **Live Counter Barcode/QR Scanner**: Fast counter check-in (`html5-qrcode`) using device cameras for instant attendance verification and anti-fraud checks.
- 📒 **Running Ledger & Account Statement**: Tracks customer debits, credits, running account balance, and generates customer ledger statements.
- 📊 **PDF Reports Hub**: Export downloadable PDF reports for Customer Rosters and Date-Range Expenses.
- 🐳 **Dockerized Setup**: Ready-to-use `docker-compose.yml` orchestrating Spring Boot, React, MySQL 8.0, and Adminer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 17+, Spring Boot 3.2.x, Spring Web, Spring Security, Spring Data JPA, Hibernate, Bean Validation |
| **Auth** | JWT (jjwt 0.12.x), BCrypt password encoder |
| **Database** | MySQL 8.0 / PostgreSQL with H2 in-memory dev profile & Flyway DDL migrations |
| **PDF & Barcode** | LibrePDF / OpenPDF, ZXing QR/Barcode Library |
| **Frontend** | React 18 (Vite), React Router v6, Axios, Tailwind CSS, Lucide React Icons, `html5-qrcode` |
| **API Docs** | `springdoc-openapi` (Swagger UI) |
| **Containerization** | Docker, `docker-compose` |

---

## Getting Started (Local Execution)

### Option 1: Running with Docker Compose (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. From the project root directory, run:
   ```bash
   docker-compose up --build -d
   ```
3. Access the applications:
   - **Frontend App**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8080`
   - **Swagger OpenAPI Docs**: `http://localhost:8080/swagger-ui.html`
   - **Adminer DB Tool**: `http://localhost:8081`

### Default Login Credentials
- **Email**: `admin@mess.com`
- **Password**: `admin123`

---

### Option 2: Running Backend & Frontend Manually

#### Backend Setup (Spring Boot)
1. Ensure Java 17+ and Maven are installed.
2. Navigate to `backend/`:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   *Note: By default, the application runs using the `dev` profile with an in-memory H2 database (`http://localhost:8080/h2-console`), requiring zero pre-installed MySQL database!*

#### Frontend Setup (React + Vite)
1. Ensure Node.js 18+ is installed.
2. Navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## WhatsApp API Configuration

To enable live Meta WhatsApp Cloud API messaging, update your environment variables or `application.yml`:

```yaml
app:
  whatsapp:
    api-url: https://graph.facebook.com/v18.0
    phone-number-id: YOUR_META_PHONE_NUMBER_ID
    access-token: YOUR_META_ACCESS_TOKEN
    enabled: true
```
*If `enabled` is set to `false` (default), the built-in mock engine logs all OTPs and messages to the console without sending actual Meta API requests.*

---

## REST API Endpoints

- `POST /api/v1/auth/login`: Admin Login
- `GET /api/v1/customers`: Paginated & searchable customer roster
- `POST /api/v1/customers`: Register new customer & trigger WhatsApp OTP
- `GET /api/v1/customers/{id}/id-card`: Stream PDF ID Card
- `GET/POST /api/v1/plans`: Manage Mess Subscription Plans
- `POST /api/v1/mess`: Assign plan subscription to customer
- `POST /api/v1/attendance/scan`: Instant barcode scan counter check-in
- `POST /api/v1/payments`: Record customer payment & update ledger
- `GET /api/v1/ledger/customer/{id}`: View customer running balance statement
- `GET/POST /api/v1/expenses`: Log operational expenses
- `GET /api/v1/reports/customer/pdf`: Download Customer Roster PDF
- `POST /api/v1/notifications/whatsapp/send`: Send ad-hoc WhatsApp message

---

## License

This project is licensed under the MIT License.
