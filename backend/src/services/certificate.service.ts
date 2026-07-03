import { ethers } from "ethers";
import { AppDataSource } from "../app";
import { CertificateMetadata } from "../entities/CertificateMetadata";
import { AuditLog } from "../entities/AuditLog";
import { getContract, isContractDeployed } from "./blockchain.service";

const certRepo = () => AppDataSource.getRepository(CertificateMetadata);
const auditRepo = () => AppDataSource.getRepository(AuditLog);

let mockIdCounter = 1000;

export async function issueCertificate(
  data: {
    holderName: string;
    holderDocument: string;
    holderEmail?: string;
    amount: number;
    currency?: string;
    description?: string;
    metadata?: Record<string, any>;
    documentData: string;
  },
  userId: string,
  userRole: string
) {
  if (!["admin", "officer"].includes(userRole)) throw new Error("Only officers can issue certificates");

  const documentHash = ethers.keccak256(ethers.toUtf8Bytes(data.documentData));
  const metadataURI = JSON.stringify({ holderName: data.holderName, holderDocument: data.holderDocument });

  let blockchainId: number;

  try {
    if (isContractDeployed()) {
      const contract = getContract();
      const tx = await contract.issueCertificate(ethers.ZeroAddress, documentHash, metadataURI);
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => {
        try {
          return contract.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === "CertificateIssued";
        } catch { return false; }
      });

      if (event) {
        const parsed = contract.interface.parseLog({ topics: event.topics as string[], data: event.data });
        blockchainId = Number(parsed!.args[0]);
      } else {
        blockchainId = Number(await contract._certificateIds());
      }
      console.log(`Certificate issued on blockchain. ID: ${blockchainId}`);
    } else {
      blockchainId = ++mockIdCounter;
      console.log(`Blockchain not available. Using mock ID: ${blockchainId}`);
    }
  } catch (err: any) {
    console.error("Blockchain error:", err.message);
    blockchainId = ++mockIdCounter;
  }

  const metadata = certRepo().create({
    blockchainCertificateId: blockchainId,
    holderName: data.holderName,
    holderDocument: data.holderDocument,
    holderEmail: data.holderEmail || "",
    amount: data.amount,
    currency: data.currency || "USD",
    description: data.description || "",
    metadata: data.metadata || {},
    status: "issued",
    createdBy: userId,
  });

  const saved = await certRepo().save(metadata);

  await auditRepo().save(
    auditRepo().create({
      userId,
      action: "certificate_issued",
      blockchainCertificateId: blockchainId,
      certificateMetadataId: saved.id,
      details: { holderName: data.holderName, amount: data.amount },
      ipAddress: "internal",
    })
  );

  return saved;
}

export async function findAll(userId?: string, userRole?: string) {
  if (userRole === "admin" || userRole === "officer") {
    return certRepo().find({ order: { createdAt: "DESC" } });
  }
  if (userId) {
    return certRepo().find({ where: { createdBy: userId }, order: { createdAt: "DESC" } });
  }
  return certRepo().find({ order: { createdAt: "DESC" } });
}

export async function findOne(id: string) {
  const cert = await certRepo().findOne({ where: { id } });
  if (!cert) throw new Error("Certificate not found");
  return cert;
}

export async function revokeCertificate(id: string, userId: string, userRole: string) {
  if (!["admin", "officer"].includes(userRole)) throw new Error("Only officers can revoke certificates");

  const cert = await certRepo().findOne({ where: { id } });
  if (!cert) throw new Error("Certificate not found");
  if (cert.status !== "issued") throw new Error("Certificate is not issued");

  try {
    if (isContractDeployed()) {
      const contract = getContract();
      const tx = await contract.revokeCertificate(cert.blockchainCertificateId);
      await tx.wait();
      console.log(`Certificate revoked on blockchain. ID: ${cert.blockchainCertificateId}`);
    }
  } catch (err: any) {
    console.error("Blockchain revoke error:", err.message);
  }

  cert.status = "revoked";
  await certRepo().save(cert);

  await auditRepo().save(
    auditRepo().create({
      userId,
      action: "certificate_revoked",
      blockchainCertificateId: cert.blockchainCertificateId,
      certificateMetadataId: cert.id,
      details: { holderName: cert.holderName },
      ipAddress: "internal",
    })
  );

  return cert;
}

export async function validateCertificate(id: string) {
  const cert = await certRepo().findOne({ where: { id } });
  if (!cert) throw new Error("Certificate not found");

  let blockchainValid = false;
  let blockchainStatus = 0;

  try {
    if (isContractDeployed()) {
      const contract = getContract();
      const result = await contract.validateCertificate(cert.blockchainCertificateId);
      blockchainValid = result[0];
      blockchainStatus = Number(result[1]);
    }
  } catch (err: any) {
    console.error("Blockchain validate error:", err.message);
  }

  return {
    ...cert,
    blockchainValid,
    blockchainStatus,
  };
}
