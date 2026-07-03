const solc = require("solc");
const fs = require("fs");
const path = require("path");

const contractPath = path.join(__dirname, "contracts/CreditCertificate.sol");
const source = fs.readFileSync(contractPath, "utf8");

console.log("Compiling CreditCertificate.sol...");

const input = {
  language: "Solidity",
  sources: {
    "CreditCertificate.sol": { content: source },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

// Try to resolve OpenZeppelin imports
function findImports(importPath) {
  const possiblePaths = [
    path.join(__dirname, "node_modules", importPath),
    path.join(__dirname, "../node_modules", importPath),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return { contents: fs.readFileSync(p, "utf8") };
    }
  }
  return { error: `File not found: ${importPath}` };
}

const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

if (output.errors) {
  const errors = output.errors.filter((e) => e.severity === "error");
  if (errors.length > 0) {
    console.error("Compilation errors:");
    errors.forEach((e) => console.error(e.formattedMessage));
    process.exit(1);
  }
  // Warnings
  const warnings = output.errors.filter((e) => e.severity === "warning");
  warnings.forEach((w) => console.warn("Warning:", w.formattedMessage));
}

const contract = output.contracts["CreditCertificate.sol"]["CreditCertificate"];
const artifact = {
  contractName: "CreditCertificate",
  abi: contract.abi,
  bytecode: "0x" + contract.evm.bytecode.object,
  sourceName: "CreditCertificate.sol",
};

const outDir = path.join(__dirname, "artifacts/contracts/CreditCertificate.sol");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "CreditCertificate.json"),
  JSON.stringify(artifact, null, 2)
);

console.log("Compiled successfully!");
console.log("Functions:", contract.abi.filter((x) => x.type === "function").map((x) => x.name).join(", "));
console.log("Saved to artifacts/contracts/CreditCertificate.sol/CreditCertificate.json");
