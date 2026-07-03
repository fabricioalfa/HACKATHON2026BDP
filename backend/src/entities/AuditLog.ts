import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("audit_log")
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @Column()
  action!: string;

  @Column({ name: "blockchain_certificate_id", nullable: true })
  blockchainCertificateId!: number;

  @Column({ name: "certificate_metadata_id", nullable: true })
  certificateMetadataId!: string;

  @Column({ type: "jsonb", default: "{}" })
  details!: Record<string, any>;

  @Column({ name: "ip_address" })
  ipAddress!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
