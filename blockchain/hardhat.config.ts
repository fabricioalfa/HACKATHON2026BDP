import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    ganache: {
      url: process.env.BLOCKCHAIN_RPC || "http://localhost:8545",
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            "0x59c6995e998f97a5a0044966c20bb5b1738edd05e2be2947ec3633d43b3c8815",
          ],
      chainId: 1337,
    },
  },
};

export default config;
