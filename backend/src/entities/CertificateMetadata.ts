import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("certificates_metadata")
export class CertificateMetadata {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "blockchain_certificate_id", type: "int", unique: true })
  blockchainCertificateId!: number;

  @Column({ name: "holder_name" })
  holderName!: string;

  @Column({ name: "holder_document" })
  holderDocument!: string;

  @Column({ name: "holder_email", nullable: true })
  holderEmail!: string;

  @Column("decimal", { precision: 18, scale: 2 })
  amount!: number;

  @Column({ default: "USD" })
  currency!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "jsonb", default: "{}" })
  metadata!: Record<string, any>;

  @Column({ default: "issued" })
  status!: string;

  @Column({ name: "created_by", nullable: true })
  createdBy!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
