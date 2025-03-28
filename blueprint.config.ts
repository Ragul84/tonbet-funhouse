
import { defineConfig } from "@ton/blueprint";

export default defineConfig({
  contracts: {
    // Define the contract source paths
    TonCasino: {
      // Using relative path from the project root
      path: "./src/contracts/TonCasino.fc",
    },
    RandomnessProvider: {
      path: "./src/contracts/RandomnessProvider.fc",
    },
  },
  // Specify the output directory for compiled contracts
  output: "./build",
});
