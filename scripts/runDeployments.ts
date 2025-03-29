import { run as deployRandomness } from "./deployRandomness";
import { run as deployCasino } from "./deployCasino";
import { NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
  console.log("📁 Running deployment from project root");
  
  // Command line args can determine which contract to deploy
  const args = process.argv.slice(2);
  
  if (args.includes("randomness")) {
    await deployRandomness(provider);
  } else if (args.includes("casino")) {
    await deployCasino(provider);
  } else {
    console.log("⚠️ Please specify which contract to deploy:");
    console.log("npx blueprint run scripts/runDeployments.ts randomness");
    console.log("npx blueprint run scripts/runDeployments.ts casino");
  }
}