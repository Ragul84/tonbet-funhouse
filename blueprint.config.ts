
import { Config } from '@ton/blueprint';

export const config: Config = {
  // Default network configuration
  network: {
    // You can override these with --custom flags
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    type: 'mainnet', // Or 'testnet' based on your USE_TESTNET env var
    version: 'v2',
    // API key is optional, will use public endpoints if not provided
    // key: 'YOUR_API_KEY',
  },
  // Optional plugins array if you're using plugins
  // plugins: [],
};
