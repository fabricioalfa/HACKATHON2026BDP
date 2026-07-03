CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'officer', 'viewer')),
    wallet_address VARCHAR(42),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE certificates_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blockchain_certificate_id INTEGER NOT NULL UNIQUE,
    holder_name VARCHAR(255) NOT NULL,
    holder_document VARCHAR(50) NOT NULL,
    holder_email VARCHAR(255),
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    description TEXT,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'issued',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    blockchain_certificate_id INTEGER,
    certificate_metadata_id UUID REFERENCES certificates_metadata(id),
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_blockchain_id ON certificates_metadata(blockchain_certificate_id);
CREATE INDEX idx_certificates_holder_document ON certificates_metadata(holder_document);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created_at ON audit_log(created_at);

-- Seed data: default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role, wallet_address)
VALUES ('admin', 'admin@banco.local', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfAjkMBcGm/YtVLf6S6EKrNVVFHa', 'Administrador', 'admin', '0xf39Fd6e51aad88F6F4ce6aB882a7279cffFb9226');
