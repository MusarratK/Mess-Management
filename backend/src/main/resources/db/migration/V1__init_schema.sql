-- Database Initialization Schema for Mess Management System

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reg_no VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    mobile VARCHAR(20) NOT NULL,
    father_mobile VARCHAR(20),
    gender VARCHAR(20),
    college_or_company VARCHAR(150),
    academic_year VARCHAR(50),
    branch VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    dob DATE,
    reference VARCHAR(100),
    opening_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    photo_url LONGTEXT,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    from_day INT NOT NULL,
    to_day INT NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mess_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    shift VARCHAR(20) NOT NULL DEFAULT 'BOTH',
    rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS guests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20),
    date DATE NOT NULL,
    shift VARCHAR(20) NOT NULL DEFAULT 'BOTH',
    number_of_guests INT NOT NULL DEFAULT 1,
    rate_per_guest DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(30) NOT NULL DEFAULT 'CASH',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    date DATE NOT NULL,
    shift VARCHAR(20) NOT NULL DEFAULT 'BOTH',
    status VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    marked_by VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_customer_date_shift (customer_id, date, shift),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ledgers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNIQUE,
    account_name VARCHAR(150) NOT NULL,
    account_type VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
    running_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ledger_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ledger_id BIGINT NOT NULL,
    customer_id BIGINT,
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(30) NOT NULL DEFAULT 'CASH',
    reference_no VARCHAR(100),
    description TEXT,
    running_balance_after DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_mode VARCHAR(30) NOT NULL DEFAULT 'CASH',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS otp_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(20) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expiry_time DATETIME NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin Account (password: admin123)
-- BCrypt encoded password for 'admin123': $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY02x0Fz5n9wQnI6iS/mS
INSERT INTO users (name, email, mobile, password, role, active)
VALUES ('System Admin', 'admin@mess.com', '9876543210', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY02x0Fz5n9wQnI6iS/mS', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE id=id;
