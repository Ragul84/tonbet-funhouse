
import { Address, Cell, beginCell } from "@ton/core";
import fs from "fs";
import { compile } from "@ton/blueprint";

// Configure these parameters for deployment
const INITIAL_BALANCE = "1"; // TON to be sent to the contract

export async function run() {
  console.log("🚀 Starting Randomness Provider contract deployment...");
  
  // Read and compile contract
  console.log("📝 Compiling Randomness contract...");
  const randomnessCode = await compile("RandomnessProvider");
  console.log("✅ Contract compiled successfully!");
  
  // Get addresses from environment or prompt user
  const ownerAddress = process.env.OWNER_ADDRESS;
  if (!ownerAddress) {
    console.error("❌ OWNER_ADDRESS environment variable is not set!");
    console.log("Please set it by running: export OWNER_ADDRESS=YOUR_WALLET_ADDRESS");
    console.log("Example: export OWNER_ADDRESS=EQD...");
    process.exit(1);
  }
  
  console.log(`👤 Owner address: ${ownerAddress}`);
  
  // Determine network from environment variable
  const isTestnet = process.env.USE_TESTNET && 
    (process.env.USE_TESTNET.toLowerCase() === "true" || 
     process.env.USE_TESTNET === "1");
  
  // Read existing contract addresses
  let contractAddresses;
  try {
    contractAddresses = JSON.parse(fs.readFileSync("src/contracts/addresses.json", "utf8"));
  } catch (error) {
    contractAddresses = {
      mainnet: "EQD__MAINNET_CASINO_PLACEHOLDER__",
      testnet: "EQD__TESTNET_CASINO_PLACEHOLDER__"
    };
    console.warn("Could not read addresses.json, using placeholders");
  }
  
  // Casino address is not required initially, it can be updated later
  // Use the appropriate address based on network
  const casinoAddress = isTestnet ? 
    contractAddresses.testnet : 
    contractAddresses.mainnet;
  
  console.log(`🎰 Initial casino address: ${casinoAddress} (can be updated later)`);
  console.log(`🌐 Network: ${isTestnet ? "TESTNET" : "MAINNET"}`);

  // Create initial data cell (contract state)
  const dataCell = beginCell()
    .storeAddress(Address.parse(ownerAddress))
    .storeAddress(Address.parse(casinoAddress))
    .storeDict(null) // empty request dict
    .endCell();

  // Calculate contract address
  const contractAddr = calculateContractAddress(0, { code: randomnessCode, data: dataCell });
  console.log(`\n📍 Randomness contract address: ${contractAddr.toString()}`);
  
  // Save the address to a file for easy access
  const randomnessAddresses = JSON.parse(fs.readFileSync("src/contracts/randomnessAddress.json", "utf8"));
  
  if (isTestnet) {
    randomnessAddresses.testnet = contractAddr.toString();
  } else {
    randomnessAddresses.mainnet = contractAddr.toString();
  }
  
  fs.writeFileSync("src/contracts/randomnessAddress.json", JSON.stringify(randomnessAddresses, null, 2));
  console.log(`💾 Saved address to randomnessAddress.json`);
  
  console.log("\n🚀 Randomness contract ready for deployment");
  console.log(`💰 To deploy, send at least ${INITIAL_BALANCE} TON to ${contractAddr.toString()}`);
  console.log("⚠️ After deployment, update your casino contract with this randomness address.");
  
  // Print deployment instructions
  console.log("\n📋 Deployment Steps:");
  console.log("1. Send at least 1 TON to the address above");
  console.log("2. Wait for the transaction to confirm");
  console.log("3. Use this randomness address when deploying the casino contract");
  console.log("4. After deploying the casino, update the randomness contract with the casino address");
}

// Helper function to calculate contract address
function calculateContractAddress(workchain: number, stateInit: { code: Cell; data: Cell }) {
  const stateInitCell = beginCell()
    .storeRef(stateInit.code)
    .storeRef(stateInit.data)
    .endCell();
  
  const hash = stateInitCell.hash();
  return new Address(workchain, hash);
}
