
import { Address, Cell, beginCell } from "@ton/core";
import fs from "fs";
import { compile } from "@ton/blueprint";

// Configure these parameters for deployment
const INITIAL_BALANCE = "10"; // TON to be sent to the contract (for house funds)
const MIN_BET = "0.1"; // Minimum bet in TON
const MAX_BET = "100"; // Maximum bet in TON
const HOUSE_EDGE = 200; // 2% house edge in basis points

async function main() {
  // Read and compile contract
  const mainCode = await compile("TonCasino");

  // Get randomness address from environment or try to read from the file
  let randomnessAddress = process.env.RANDOMNESS_ADDRESS;
  
  if (!randomnessAddress) {
    try {
      const randomnessAddresses = JSON.parse(fs.readFileSync("src/contracts/randomnessAddress.json", "utf8"));
      randomnessAddress = process.env.USE_TESTNET === "true" ? 
        randomnessAddresses.testnet : randomnessAddresses.mainnet;
    } catch (error) {
      randomnessAddress = "EQD__RANDOMNESS_ADDRESS_PLACEHOLDER__";
      console.warn("Could not find randomness address, using placeholder.");
    }
  }

  // Create initial data cell (contract state)
  const dataCell = beginCell()
    .storeAddress(Address.parse(process.env.OWNER_ADDRESS || "EQD__OWNER_ADDRESS_PLACEHOLDER__"))
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
  console.log(`Contract address: ${contractAddr.toString()}`);
  
  // Save contract addresses to file for frontend use
  const contractAddresses = {
    mainnet: contractAddr.toString(),
    testnet: contractAddr.toString()  // You might want to deploy to testnet with different params
  };
  
  fs.writeFileSync("src/contracts/addresses.json", JSON.stringify(contractAddresses, null, 2));
  
  console.log("Contract ready for deployment");
  console.log(`To deploy, send at least ${INITIAL_BALANCE} TON to ${contractAddr.toString()}`);
  console.log("After deployment, update the contract addresses in your frontend code");
  
  // Update randomness contract with casino address if both are deployed
  if (randomnessAddress !== "EQD__RANDOMNESS_ADDRESS_PLACEHOLDER__") {
    console.log("");
    console.log("IMPORTANT: After deploying the casino contract, you need to update");
    console.log("the randomness contract with the casino address.");
    console.log("");
    console.log("You can do this by sending a message to the randomness contract");
    console.log("with op=3 and the casino address.");
  }
}

// Helper function to calculate contract address
function calculateContractAddress(workchain: number, stateInit: { code: Cell; data: Cell }) {
  // This is a simple implementation to calculate the contract address
  // In production, you should use the proper function from a TON library
  const stateInitCell = beginCell()
    .storeRef(stateInit.code)
    .storeRef(stateInit.data)
    .endCell();
  
  const hash = stateInitCell.hash();
  return new Address(workchain, hash);
}

main().catch(console.error);
