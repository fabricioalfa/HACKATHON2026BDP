import { ethers } from "ethers";
import fs from "fs";
import path from "path";

async function main() {
  const RPC_URL = process.env.BLOCKCHAIN_RPC || "http://localhost:8545";
  const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  console.log("Connecting to:", RPC_URL);
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deployer:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/CreditCertificate.sol/CreditCertificate.json"
  );

  if (!fs.existsSync(artifactPath)) {
    console.error("Artifact not found. Run: node compile.js first");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  console.log("Deploying CreditCertificate...");
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Deployed at:", address);

  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deployment = {
    address,
    network: "ganache",
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
    contractName: "CreditCertificate",
  };

  fs.writeFileSync(
    path.join(deploymentDir, "ganache.json"),
    JSON.stringify(deployment, null, 2)
  );

  console.log("Deployment saved to deployments/ganache.json");
  console.log("Done!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
