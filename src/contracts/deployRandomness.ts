
import { Address, Cell, beginCell } from "@ton/core";
import fs from "fs";
import { compile } from "@ton/blueprint";

// Configure these parameters for deployment
const INITIAL_BALANCE = "1"; // TON to be sent to the contract

async function main() {
  // Read and compile contract
  const randomnessCode = await compile("RandomnessProvider");
  
  // Get addresses from environment or use placeholders
  const ownerAddress = process.env.OWNER_ADDRESS || "EQD__OWNER_ADDRESS_PLACEHOLDER__";
  let casinoAddress = process.env.CASINO_ADDRESS;
  
  // If no casino address is provided, try to read from addresses.json
  if (!casinoAddress) {
    try {
      const addresses = JSON.parse(fs.readFileSync("src/contracts/addresses.json", "utf8"));
      casinoAddress = process.env.USE_TESTNET === "true" ? addresses.testnet : addresses.mainnet;
    } catch (error) {
      casinoAddress = "EQD__CASINO_ADDRESS_PLACEHOLDER__";
      console.warn("Could not find casino address, using placeholder.");
    }
  }

  // Create initial data cell (contract state)
  const dataCell = beginCell()
    .storeAddress(Address.parse(ownerAddress))
    .storeAddress(Address.parse(casinoAddress))
    .storeDict(null) // empty request dict
    .endCell();

  // Calculate contract address
  const contractAddr = calculateContractAddress(0, { code: randomnessCode, data: dataCell });
  console.log(`Randomness contract address: ${contractAddr.toString()}`);
  
  // Save the address to a file for easy access
  const randomnessAddresses = {
    mainnet: contractAddr.toString(),
    testnet: contractAddr.toString()  // You might want to deploy to testnet with different params
  };
  
  fs.writeFileSync("src/contracts/randomnessAddress.json", JSON.stringify(randomnessAddresses, null, 2));
  
  console.log("Randomness contract ready for deployment");
  console.log(`To deploy, send at least ${INITIAL_BALANCE} TON to ${contractAddr.toString()}`);
  console.log("After deployment, update your casino contract with this randomness address.");
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

main().catch(console.error);
