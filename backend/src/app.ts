import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { DataSource } from "typeorm";
import { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth.routes";
import certificateRoutes from "./routes/certificate.routes";
import userRoutes from "./routes/user.routes";
import auditRoutes from "./routes/audit.routes";
import { User } from "./entities/User";
import { CertificateMetadata } from "./entities/CertificateMetadata";
import { AuditLog } from "./entities/AuditLog";
import { seedAdmin } from "./services/auth.service";
import { initBlockchain } from "./services/blockchain.service";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "credit_admin",
  password: process.env.DB_PASSWORD || "credit_pass_2024",
  database: process.env.DB_NAME || "credit_certificates",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [User, CertificateMetadata, AuditLog],
});

const app = express();
const PORT = parseInt(process.env.PORT || "3000");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit-log", auditRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  const message = err.message || "Internal server error";
  const status = err.statusCode || 500;
  res.status(status).json({ message });
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");
    await seedAdmin();
    await initBlockchain();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
