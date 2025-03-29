
import { Address, Cell, beginCell } from "@ton/core";
import fs from "fs";
import { NetworkProvider, compile } from "@ton/blueprint";

// Configure these parameters for deployment
const INITIAL_BALANCE = "1"; // TON to be sent to the contract

export async function run(provider: NetworkProvider) {
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
  
  console.log(`🌐 Network: ${isTestnet ? "TESTNET" : "MAINNET"}`);
  
  // Read existing contract addresses
  let contractAddresses;
  try {
    // Make sure directory exists
    const contractDir = "contracts";
    if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir, { recursive: true });
    }
    
    const addressesFile = "contracts/addresses.json";
    if (!fs.existsSync(addressesFile)) {
      // Create the file if it doesn't exist
      fs.writeFileSync(
        addressesFile,
        JSON.stringify({
          mainnet: "EQD__MAINNET_CASINO_PLACEHOLDER__",
          testnet: "EQD__TESTNET_CASINO_PLACEHOLDER__"
        }, null, 2)
      );
    }
    
    contractAddresses = JSON.parse(fs.readFileSync(addressesFile, "utf8"));
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
  try {
    const randomnessAddressFile = "contracts/randomnessAddress.json";
    
    let randomnessAddresses = {
      mainnet: "EQD__MAINNET_RANDOMNESS_PLACEHOLDER__",
      testnet: "EQD__TESTNET_RANDOMNESS_PLACEHOLDER__"
    };
    
    if (fs.existsSync(randomnessAddressFile)) {
      randomnessAddresses = JSON.parse(fs.readFileSync(randomnessAddressFile, "utf8"));
    }
    
    if (isTestnet) {
      randomnessAddresses.testnet = contractAddr.toString();
    } else {
      randomnessAddresses.mainnet = contractAddr.toString();
    }
    
    fs.writeFileSync(randomnessAddressFile, JSON.stringify(randomnessAddresses, null, 2));
    console.log(`💾 Saved address to randomnessAddress.json`);
    
    // Also create a copy in the src/contracts directory for frontend use
    const srcContractsDir = "src/contracts";
    if (!fs.existsSync(srcContractsDir)) {
      fs.mkdirSync(srcContractsDir, { recursive: true });
    }
    
    fs.writeFileSync(`${srcContractsDir}/randomnessAddress.json`, 
                     JSON.stringify(randomnessAddresses, null, 2));
    console.log(`💾 Saved address to src/contracts/randomnessAddress.json for frontend use`);
    
  } catch (error) {
    console.error("Error updating randomnessAddress.json file:", error);
    console.log("Please make sure the file exists and is writeable");
  }
  
  console.log("\n🚀 Randomness contract ready for deployment");
  console.log(`💰 To deploy, send at least ${INITIAL_BALANCE} TON to ${contractAddr.toString()}`);
  console.log("⚠️ After deployment, update your casino contract with this randomness address.");
  
  // Print deployment instructions
  console.log("\n📋 Deployment Steps:");
  console.log("1. Send at least 1 TON to the address above");
  console.log("2. Wait for the transaction to confirm");
  console.log("3. Use this randomness address when deploying the casino contract");
  console.log("4. After deploying the casino, update the randomness contract with the casino address");
  
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
