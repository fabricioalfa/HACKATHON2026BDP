import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

describe("CreditCertificate", function () {
  let contract: Contract;
  let deployer: any, officer1: any, officer2: any, holder: any;

  const DOCUMENT_HASH = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const METADATA_URI = "https://api.creditcertificates.com/metadata/123";

  beforeEach(async function () {
    [deployer, officer1, officer2, holder] = await ethers.getSigners();

    const factory: ContractFactory = await ethers.getContractFactory("CreditCertificate");
    contract = await factory.deploy();
    await contract.waitForDeployment();

    await contract.addOfficer(officer1.address);
    await contract.addOfficer(officer2.address);
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const address = await contract.getAddress();
      expect(address).to.be.properAddress;
    });

    it("Should start with _nextId = 1", async function () {
      const nextId = await contract._certificateIds();
      expect(nextId).to.equal(1);
    });
  });

  describe("Issue Certificate", function () {
    it("Should issue certificate successfully", async function () {
      const tx = await contract.issueCertificate(holder.address, DOCUMENT_HASH, METADATA_URI);
      await tx.wait();

      const cert = await contract.getCertificate(1);

      expect(cert.holder).to.equal(holder.address);
      expect(cert.documentHash).to.equal(DOCUMENT_HASH);
      expect(cert.metadataURI).to.equal(METADATA_URI);
      expect(cert.status).to.equal(1); // Issued
      expect(cert.issuer).to.equal(deployer.address);
    });

    it("Should return sequential IDs", async function () {
      await contract.issueCertificate(holder.address, DOCUMENT_HASH, METADATA_URI);
      await contract.issueCertificate(holder.address, DOCUMENT_HASH, "uri2");

      const nextId = await contract._certificateIds();
      expect(nextId).to.equal(3);
    });

    it("Should reject when non-officer tries to issue", async function () {
      const [, , , , , nonOfficer] = await ethers.getSigners();
      await expect(
        contract.connect(nonOfficer).issueCertificate(holder.address, DOCUMENT_HASH, METADATA_URI)
      ).to.be.revertedWith("Caller is not an officer");
    });

    it("Should emit CertificateIssued event", async function () {
      await expect(contract.issueCertificate(holder.address, DOCUMENT_HASH, METADATA_URI))
        .to.emit(contract, "CertificateIssued");
    });
  });

  describe("Revoke Certificate", function () {
    beforeEach(async function () {
      await contract.issueCertificate(holder.address, DOCUMENT_HASH, METADATA_URI);
    });

    it("Should revoke issued certificate", async function () {
      await contract.revokeCertificate(1);
      const cert = await contract.getCertificate(1);

      expect(cert.status).to.equal(2); // Revoked
      expect(cert.revokedAt).to.be.gt(0);
    });

    it("Should reject revoking non-existent certificate", async function () {
      await expect(contract.revokeCertificate(999)).to.be.revertedWith("Certificate does not exist");
    });

    it("Should reject revoking already revoked certificate", async function () {
      await contract.revokeCertificate(1);
      await expect(contract.revokeCertificate(1)).to.be.revertedWith("Certificate not issued");
    });

    it("Should emit CertificateRevoked event", async function () {
      await expect(contract.revokeCertificate(1))
        .to.emit(contract, "CertificateRevoked");
    });
  });

  describe("Validate Certificate", function () {
    it("Should validate issued certificate", async function () {
      await contract.issueCertificate(holder.address, DOCUMENT_HASH, METADATA_URI);
      const [exists, status, holderAddr, timestamp] = await contract.validateCertificate(1);

      expect(exists).to.be.true;
      expect(status).to.equal(1); // Issued
      expect(holderAddr).to.equal(holder.address);
      expect(timestamp).to.be.gt(0);
    });

    it("Should validate revoked certificate", async function () {
      await contract.issueCertificate(holder.address, DOCUMENT_HASH, METADATA_URI);
      await contract.revokeCertificate(1);
      const [exists, status] = await contract.validateCertificate(1);

      expect(exists).to.be.true;
      expect(status).to.equal(2); // Revoked
    });

    it("Should return non-existent for invalid ID", async function () {
      const [exists, status, holderAddr, timestamp] = await contract.validateCertificate(999);

      expect(exists).to.be.false;
      expect(status).to.equal(0); // Pending
      expect(holderAddr).to.equal(ethers.ZeroAddress);
      expect(timestamp).to.equal(0);
    });
  });

  describe("Officer Management", function () {
    it("Should add new officer", async function () {
      const [, , , , newOfficer] = await ethers.getSigners();
      await contract.addOfficer(newOfficer.address);

      expect(await contract.isOfficer(newOfficer.address)).to.be.true;
    });

    it("Should remove officer", async function () {
      await contract.addOfficer(officer1.address);
      expect(await contract.isOfficer(officer1.address)).to.be.true;

      await contract.removeOfficer(officer1.address);
      expect(await contract.isOfficer(officer1.address)).to.be.false;
    });

    it("Should reject non-admin adding officer", async function () {
      await expect(
        contract.connect(officer1).addOfficer(holder.address)
      ).to.be.reverted;
    });
  });
});
