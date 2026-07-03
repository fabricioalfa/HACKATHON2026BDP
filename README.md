# Sistema de Certificados Digitales de Crédito

Sistema para emisión, validación y revocación de certificados digitales de crédito utilizando blockchain privada para trazabilidad inmutable y base de datos SQL para información completa.

## Arquitectura

### Componentes

| Componente | Tecnología | Propósito |
|-------------|------------|----------|
| Blockchain | Solidity + Ganache | Trazabilidad inmutable (hash, fecha, estado) |
| Smart Contract | `CreditCertificate.sol` | Lógica de negocio: emitir, validar, revocar |
| Backend | Node.js + TypeScript | API REST, validación, integración Blockchain |
| Frontend | Angular 19 + PrimeNG | UI para oficiales de crédito |
| Base de Datos | PostgreSQL | Usuarios, roles, metadatos, auditoría |

### Stack Tecnológico

- **Blockchain**: Solidity, Ganache (desarrollo local), Ethers.js
- **Backend**: Node.js, TypeScript, Express, TypeORM, PostgreSQL
- **Frontend**: Angular 19, PrimeNG, TypeScript, JWT Authentication
- **Docker**: Compose para orquestación
- **Manejo de Errores**: Zod + Class Validator

## Proceso de Implementación

### 1. Setup Inicial

```bash
# Crear estructura de directorios
mkdir -p blockchain/contracts blockchain/scripts blockchain/test
mkdir -p backend/src/{modules/{auth,certificates,users,audit}/(controller,service,entity,dto)}
mkdir -p frontend/src/app/{pages,components,services,guards,models}

# Instalar dependencias
# Backend
cd backend && npm install
# Frontend
cd frontend && npm install
# Blockchain
cd blockchain && npm install  # Hardhat + dependencies
```

### 2. Configuración

#### Archivo `.env.example`:

```env
# Blockchain
BLOCKCHAIN_RPC=http://localhost:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=credit_admin
DB_PASSWORD=credit_pass_2024
DB_NAME=credit_certificates

# JWT
JWT_SECRET=change-this-secret-in-production
JWT_EXPIRES_IN=8h

# Server
PORT=3000
NODE_ENV=development
```

### 3. Configuración de Docker

#### `docker-compose.yml`:

```yaml
version: '3.8'

services:
  ganache:
    image: trufflesuite/ganache:latest
    container_name: credit-ganache
    ports:
      - "7545:8545"
    command:
      - --deterministic
      - --accounts=10
      - --chain.chainId=1337
      - --wallet.defaultBalance=10000
    networks:
      - credit-network

  postgres:
    image: postgres:16-alpine
    container_name: credit-postgres
    environment:
      POSTGRES_DB: credit_certificates
      POSTGRES_USER: credit_admin
      POSTGRES_PASSWORD: credit_pass_2024
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - credit-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U credit_admin -d credit_certificates"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: credit-backend
    environment:
      BLOCKCHAIN_RPC: http://ganache:8545
      PRIVATE_KEY: ${PRIVATE_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}
      DB_HOST: postgres
      # ... más variables de entorno
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      ganache:
        condition: service_started
    networks:
      - credit-network

  frontend:
    build: ./frontend
    container_name: credit-frontend
    ports:
      - "4200:80"
    depends_on:
      - backend
    networks:
      - credit-network

volumes:
  postgres-data:

networks:
  credit-network:
    driver: bridge
```

### 4. Base de Datos - Schema SQL

#### `database/init.sql`:

```sql
-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Usuarios (oficiales, admins)
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

-- Certificados completos (datos personales, financieros, etc.)
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
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auditoría
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
```

### 5. Smart Contract - `CreditCertificate.sol`

#### Funcionalidades Principales:

```solidity
// Estados: Pending, Issued, Revoked
enum CertificateStatus {
    Pending,
    Issued,
    Revoked
}

// Emitir certificado (solo oficiales)
function issueCertificate(address holder, bytes32 documentHash, string metadataURI) 
    external onlyOfficer returns (uint256 id)

// Revocar certificado (solo oficiales, solo emitidos)
function revokeCertificate(uint256 id) external onlyOfficer

// Validar certificado ( cualquiera puede consultar )
function validateCertificate(uint256 id) external view 
    returns (bool exists, CertificateStatus status, address holder, uint256 timestamp)

// Obtener certificado completo
function getCertificate(uint256 id) external view returns (Certificate memory)

// Eventos para trazabilidad on-chain
event CertificateIssued(uint256 indexed id, address indexed holder, ...);
event CertificateRevoked(uint256 indexed id, address indexed holder, ...);
```

### 6. API REST - Routes Principales

| Ruta | Método | Autenticación | Descripción |
|------|--------|---------------|-------------|
| `/api/certificates` | GET | Roles: admin, officer, viewer | Listar certificados (filtrado) |
| `/api/certificates` | POST | Roles: admin, officer | Emitir nuevo certificado |
| `/api/certificates/:id` | GET | Roles: admin, officer, viewer | Obtener certificado por ID |
| `/api/certificates/:id/revoke` | PUT | Roles: admin, officer | Revocar certificado |
| `/api/certificates/:id/validate` | POST | Roles: admin, officer, viewer | Validar en blockchain |

### 7. Frontend - Pages Principales

#### Dashboard
- Visión general de todos los certificados
- Estadísticas: total, emitidos, revocados

#### Listado de Certificados
- Tabla con búsqueda y filtros
- Estados visuales (badge coloridos)

#### Emisión de Certificados
- Formulario completo (datos personales, financieros)
- Autenticación requerida
- Envío a blockchain + BD

#### Detalle de Certificado
- Información completa del certificado
- Estado visual (emitido/revocado)
- Botones de acción según rol

#### Auditoría
- Histórico de acciones (solo admin)
- Filtrado por usuario y acción

#### Usuarios
- Gestión de usuarios (solo admin)
- Asignación de roles

## Flujo de Trabajo

1. **Inicio de Sesión**: El oficial (admin/officer) inicia sesión con JWT
2. **Emisión**: El oficial completa el formulario de certificado
3. **Validación**: El backend verifica el JWT y emite en la blockchain
4. **Almacenamiento**: Los metadatos completos se guardan en PostgreSQL
5. **Auditoría**: Ambas acciones (blockchain y DB) se registran
6. **Consulta**: El oficial o viewer puede consultar y validar certificados

## Configuración para Desarrollo

### Iniciar todos los servicios:

```bash
# 1. Asegurarse de tener .env en la raíz
cp .env.example .env

# 2. Configurar Base de Datos (PostgreSQL)
# Crear database credit_certificates y usuario credit_admin (usar init.sql)

# 3. Iniciar servicios con Docker
# Asegurarse de tener Docker Desktop corriendo
docker-compose up -d

# 4. Esperar a que estén listos
# El backend estará en http://localhost:3000
# El frontend estará en http://localhost:4200
# La blockchain (Ganache) estará en http://localhost:8545
# PostgreSQL estará en localhost:5432
```

### Comandos Útiles:

```bash
# Backend
docker-compose exec backend npm run dev

# Frontend
docker-compose exec frontend npm start

# Blockchain (directamente en Ganache)
# Solo necesario si se usa Ganache nativo
ganache

# Tests
npm test

# Linters	npm run lint
npm run typecheck

# Construir producciones
docker-compose build
```

### Monitoreo:

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs específicos
docker-compose logs backend
docker-compose logs postgres
docker-compose logs ganache

# Conectar a PostgreSQL
docker-compose exec postgres psql -U credit_admin -d credit_certificates
```

## Patrones de Diseño Implementados

### 1. Multilcapas:
- **Présentation**: Angular (Componentes, Guards, Services)
- **Business Logic**: Node.js Services (integra blockchain + DB)
- **Data Access**: TypeORM + Ethers.js
- **Persistence**: PostgreSQL + Ethereum Blockchain

### 2. Separation of Concerns:
- **Blockchain**: Solo lógica de trazabilidad (sin datos personales)
- **Base de Datos**: Información completa del negocio (datos personales, financieros)
- **API**: Puertos de entrada para frontend

### 3. Seguridad:
- **Autenticación**: JWT con refresh tokens
- **Autorización**: Roles (admin, officer, viewer)
- **Contratos Inteligentes**: Solo oficiales pueden emitir/revocar

### 4. Auditoría:
- **On-Chain**: Eventos de Solidity (irrevocables)
- **Off-Chain**: BD PostgreSQL (detallada)

## Cómo funciona el backend (Blockchain + BD)

```
Frontend → Backend (API) → Blockchain (Ethers.js) + PostgreSQL (TypeORM)

Cuando un oficial emite un certificado:
1. El frontend envía los datos del certificado
2. El backend verifica la autenticación del oficial
3. El backend interactúa con el contrato inteligente via Ethers.js
   - issueCertificate(holder, documentHash, metadataURI)
4. El backend guarda los metadatos completos en PostgreSQL
5. El backend registra el evento en la tabla de auditoría

Validación:
1. El frontend puede consultar el certificado por ID
2. El backend valida el JWT del usuario
3. El backend verifica el acceso (admin/officer/viewer)
4. El backend obtiene los metadatos de PostgreSQL
5. El backend consulta la blockchain via Ethers.js
6. El backend combina ambos resultados y los muestra
```

## Migración a Producción

Al mover de desarrollo a producción:

### 1. Blockchain:
- Reemplazar Ganache con Hyperledger Besu o Geth (privada)
- Usar nodos empresariales con permisos
- Monitorear contratos inteligentes con herramientas empresariales

### 2. Base de Datos:
- Migrar de PostgreSQL a Oracle o SQL Server del banco
- Configurar replicación y alta disponibilidad
- Implementar monitoring de base de datos

### 3. Backend:
- Usar Node.js clusters para escalabilidad
- Implementar load balancing
- Agregar logging estructurado (ELK stack)

### 4. Frontend:
- Usar Angular Universal para renderizado del lado del servidor
- Implementar CDN para assets
- Configurar Cloudflare/WAF

### 5. Seguridad:
- Usar vaults externos (Vault, AWS KMS) para secretos
- Implementar rate limiting y DDoS protection
- Agregar CSRF tokens para forms

## Límites y Consideraciones

### Que **NO** guarda la blockchain:
- Datos personales (nombre, email, documento)
- Montos monetarios (sensibles)
- Metadatos complejos

### Que **SÍ** guarda la blockchain:
- Hash del documento
- Timestamp (bloque, unix)
- Address del holder
- Address del emisor/revisor
- Estado (emitido/revocado)

## Licencia

MIT

---

*Este sistema es parte de un proyecto de hackathon del banco - diseñado para ser extendido y adaptado a las necesidades específicas del banco.*