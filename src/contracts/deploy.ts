
import { TonClient, Address, Cell, StateInit, contractAddress, beginCell } from "@ton/ton";
import fs from "fs";
import { compileFunc } from "@ton/blueprint";

// Configure these parameters for deployment
const INITIAL_BALANCE = "10"; // TON to be sent to the contract (for house funds)
const MIN_BET = "0.1"; // Minimum bet in TON
const MAX_BET = "100"; // Maximum bet in TON
const HOUSE_EDGE = 200; // 2% house edge in basis points

async function main() {
  // Read and compile contract
  const mainCode = await compileFunc({
    path: "src/contracts/TonCasino.fc",
    targets: ["stdlib.fc", "utils.fc"].map(x => `src/contracts/imports/${x}`),
  });

  // Create initial data cell (contract state)
  const dataCell = beginCell()
    .storeAddress(Address.parse(process.env.OWNER_ADDRESS || "EQD__OWNER_ADDRESS_PLACEHOLDER__"))
    .storeCoins(parseFloat(MIN_BET) * 1e9) // min bet in nanoTON
    .storeCoins(parseFloat(MAX_BET) * 1e9) // max bet in nanoTON
    .storeUint(HOUSE_EDGE, 16) // house edge in basis points
    .storeCoins(0) // initial house balance (will be filled on deployment)
    .storeDict(null) // empty bets dict
    .storeDict(null) // empty user bets dict
    .storeAddress(Address.parse(process.env.RANDOMNESS_ADDRESS || "EQD__RANDOMNESS_ADDRESS_PLACEHOLDER__"))
    .endCell();

  // Calculate contract address
  const stateInit = {
    code: mainCode,
    data: dataCell
  };
  
  const contractAddr = contractAddress(0, stateInit);
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
}

main().catch(console.error);
