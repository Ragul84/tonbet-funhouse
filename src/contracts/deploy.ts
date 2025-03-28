import { Address, Cell, beginCell } from "@ton/core";
import fs from "fs";
import { compile } from "@ton/blueprint";

// Configure these parameters for deployment
const INITIAL_BALANCE = "10"; // TON to be sent to the contract (for house funds)
const MIN_BET = "0.1"; // Minimum bet in TON
const MAX_BET = "100"; // Maximum bet in TON
const HOUSE_EDGE = 200; // 2% house edge in basis points

export async function run() {
  console.log("🚀 Starting TonCasino contract deployment...");
  
  // Read and compile contract
  console.log("📝 Compiling TonCasino contract...");
  const mainCode = await compile("TonCasino");
  console.log("✅ Contract compiled successfully!");

  // Get owner address
  const ownerAddress = process.env.OWNER_ADDRESS;
  if (!ownerAddress) {
    console.error("❌ OWNER_ADDRESS environment variable is not set!");
    console.log("Please set it by running: export OWNER_ADDRESS=YOUR_WALLET_ADDRESS");
    console.log("Example: export OWNER_ADDRESS=EQD...");
    process.exit(1);
  }
  
  console.log(`👤 Owner address: ${ownerAddress}`);
  
  // Determine if we're using testnet
  const isTestnet = process.env.USE_TESTNET && 
    (process.env.USE_TESTNET.toLowerCase() === "true" || 
     process.env.USE_TESTNET === "1");
  
  console.log(`🌐 Network: ${isTestnet ? "TESTNET" : "MAINNET"}`);

  // Get randomness address from environment or try to read from the file
  let randomnessAddress = process.env.RANDOMNESS_ADDRESS;
  
  if (!randomnessAddress) {
    try {
      const randomnessAddresses = JSON.parse(fs.readFileSync("src/contracts/randomnessAddress.json", "utf8"));
      randomnessAddress = isTestnet ? 
        randomnessAddresses.testnet : randomnessAddresses.mainnet;
    } catch (error) {
      randomnessAddress = "EQD__RANDOMNESS_ADDRESS_PLACEHOLDER__";
      console.warn("Could not find randomness address, using placeholder.");
    }
  }
  
  console.log(`🎲 Randomness provider address: ${randomnessAddress}`);

  // Create initial data cell (contract state)
  const dataCell = beginCell()
    .storeAddress(Address.parse(ownerAddress))
    .storeCoins(parseFloat(MIN_BET) * 1e9) // min bet in nanoTON
    .storeCoins(parseFloat(MAX_BET) * 1e9) // max bet in nanoTON
    .storeUint(HOUSE_EDGE, 16) // house edge in basis points
    .storeCoins(0) // initial house balance (will be filled on deployment)
    .storeDict(null) // empty bets dict
    .storeDict(null) // empty user bets dict
    .storeAddress(Address.parse(randomnessAddress))
    .endCell();

  // Calculate contract address
  const contractAddr = calculateContractAddress(0, { code: mainCode, data: dataCell });
  console.log(`\n📍 Casino contract address: ${contractAddr.toString()}`);
  
  // Save contract addresses to file for frontend use
  try {
    const contractAddresses = JSON.parse(fs.readFileSync("src/contracts/addresses.json", "utf8"));
    
    if (isTestnet) {
      contractAddresses.testnet = contractAddr.toString();
    } else {
      contractAddresses.mainnet = contractAddr.toString();
    }
    
    fs.writeFileSync("src/contracts/addresses.json", JSON.stringify(contractAddresses, null, 2));
    console.log(`💾 Saved address to addresses.json`);
  } catch (error) {
    console.error("Error updating addresses.json file:", error);
    console.log("Please make sure the file exists and is writeable");
  }
  
  console.log("\n🚀 Casino contract ready for deployment");
  console.log(`💰 To deploy, send at least ${INITIAL_BALANCE} TON to ${contractAddr.toString()}`);
  
  // Update randomness contract with casino address if both are deployed
  if (randomnessAddress !== "EQD__RANDOMNESS_ADDRESS_PLACEHOLDER__") {
    console.log("");
    console.log("⚠️ IMPORTANT: After deploying the casino contract, you need to update");
    console.log("the randomness contract with the casino address.");
    console.log("");
    console.log("You can do this by sending a message to the randomness contract");
    console.log("with op=3 and the casino address.");
  }
  
  return contractAddr; // Return the address for Blueprint to use
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
