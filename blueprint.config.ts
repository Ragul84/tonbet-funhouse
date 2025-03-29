
import { Config } from '@ton/blueprint';

export const config: Config = {
  // Default network configuration
  network: {
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    type: process.env.USE_TESTNET === 'true' ? 'testnet' : 'mainnet',
    version: 'v2',
    // API key is optional, will use public endpoints if not provided
    // key: process.env.API_KEY,
  },
  // Optional plugins array if you're using plugins
  // plugins: [],
};
