
import { run as deployRandomness } from "../src/contracts/deployRandomness";
import { run as deployCasino } from "../src/contracts/deploy";

export async function run() {
  console.log("📁 Running deployment from project root");
  
  // Command line args can determine which contract to deploy
  const args = process.argv.slice(2);
  
  if (args.includes("randomness")) {
    await deployRandomness();
  } else if (args.includes("casino")) {
    await deployCasino();
  } else {
    console.log("⚠️ Please specify which contract to deploy:");
    console.log("npx blueprint run scripts/runDeployments.ts randomness");
    console.log("npx blueprint run scripts/runDeployments.ts casino");
  }
}
