import { ethers } from "ethers";

const RPC_URL = process.env.BLOCKCHAIN_RPC || "http://localhost:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

const ABI = [
  "function issueCertificate(address holder, bytes32 documentHash, string metadataURI) external returns (uint256)",
  "function revokeCertificate(uint256 id) external",
  "function validateCertificate(uint256 id) external view returns (bool exists, uint8 status, address holder, uint256 timestamp)",
  "function getCertificate(uint256 id) external view returns (tuple(uint256 id, address holder, bytes32 documentHash, string metadataURI, uint8 status, uint256 createdAt, uint256 revokedAt, address issuer))",
  "function addOfficer(address officer) external",
  "function _certificateIds() external view returns (uint256)",
  "event CertificateIssued(uint256 indexed id, address indexed holder, bytes32 indexed documentHash, address issuer, uint256 createdAt)",
  "event CertificateRevoked(uint256 indexed id, address indexed holder, address revoker, uint256 revokedAt)",
];

let provider: ethers.JsonRpcProvider;
let wallet: ethers.Wallet;
let contractAddress: string;
let contract: ethers.Contract;

export async function initBlockchain() {
  provider = new ethers.JsonRpcProvider(RPC_URL);
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Blockchain provider connected to:", RPC_URL);
  console.log("Deployer address:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  if (CONTRACT_ADDRESS) {
    contractAddress = CONTRACT_ADDRESS;
  } else {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const deploymentPath = path.join(
        process.cwd(),
        "blockchain/deployments/ganache.json"
      );
      if (fs.existsSync(deploymentPath)) {
        const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
        contractAddress = deployment.address;
      }
    } catch {
      // fallback
    }
  }

  if (contractAddress) {
    contract = new ethers.Contract(contractAddress, ABI, wallet);
    console.log("Contract loaded at:", contractAddress);
  } else {
    console.warn("No contract address found. Set CONTRACT_ADDRESS env var or deploy contract first.");
    contractAddress = "";
  }
}

export function getContract(): ethers.Contract {
  if (!contract) throw new Error("Blockchain not initialized");
  return contract;
}

export function getProvider(): ethers.JsonRpcProvider {
  if (!provider) throw new Error("Blockchain not initialized");
  return provider;
}

export function getWallet(): ethers.Wallet {
  if (!wallet) throw new Error("Blockchain not initialized");
  return wallet;
}

export function isContractDeployed(): boolean {
  return !!contractAddress && !!contract;
}
