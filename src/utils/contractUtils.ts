import { Address } from '@ton/core';

// Import contract addresses (these will be populated after deployment)
import contractAddresses from '../contracts/addresses.json';
import randomnessAddresses from '../contracts/randomnessAddress.json';

// Contract address constants
export const MAINNET_CONTRACT_ADDRESS = contractAddresses.mainnet;
export const TESTNET_CONTRACT_ADDRESS = contractAddresses.testnet;
export const MAINNET_RANDOMNESS_ADDRESS = randomnessAddresses.mainnet;
export const TESTNET_RANDOMNESS_ADDRESS = randomnessAddresses.testnet;

// Use mainnet by default for production deployment
export const USE_TESTNET = false;

// Game parameters
export const HOUSE_EDGE_PERCENT = 2; // 2% house edge
export const MIN_BET_TON = 1;        // Minimum bet in TON
export const MAX_BET_TON = 100;      // Maximum bet in TON
export const MAX_PAYOUT_MULTIPLIER = 50; // Maximum payout multiplier

// Game types mapping for contract interaction
export enum GameType {
  COINFLIP = 1,
  DICE = 2,
  CRASH = 3
}

// Bet status enum for tracking bet states
export enum BetStatus {
  PENDING = 0,
  WON = 1,
  LOST = 2,
  REFUNDED = 3
}

/**
 * Gets the appropriate contract address based on network configuration
 */
export const getContractAddress = (): string => {
  return USE_TESTNET ? TESTNET_CONTRACT_ADDRESS : MAINNET_CONTRACT_ADDRESS;
};

/**
 * Gets the appropriate randomness contract address based on network configuration
 */
export const getRandomnessAddress = (): string => {
  return USE_TESTNET ? TESTNET_RANDOMNESS_ADDRESS : MAINNET_RANDOMNESS_ADDRESS;
};

/**
 * Formats a TON value for display (with 2 decimal places)
 */
export const formatTonValue = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue.toFixed(2);
};

/**
 * Converts TON to nano TON (1 TON = 10^9 nano TON)
 */
export const toNano = (value: number): bigint => {
  return BigInt(Math.floor(value * 1_000_000_000));
};

/**
 * Converts nano TON to TON
 */
export const fromNano = (value: bigint | number): number => {
  const valueAsNum = typeof value === 'bigint' ? Number(value) : value;
  return valueAsNum / 1_000_000_000;
};

/**
 * Validates a TON address
 */
export const isValidTonAddress = (address: string): boolean => {
  try {
    // Use TON SDK to validate address
    Address.parse(address);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Encodes the game type and prediction for a contract call
 * Returns an encoded string representation for the contract
 */
export interface EncodedGameData {
  gameType: number;
  prediction: number;
}

export const encodeGameData = (gameType: number | string, prediction: any): EncodedGameData => {
  const gameCode = typeof gameType === 'string' ? 
    gameType === 'coinflip' ? 1 : gameType === 'dice' ? 2 : 3 :
    gameType;
  
  // Convert prediction to a format the contract would understand
  let predictionValue;
  if (gameCode === GameType.COINFLIP) {
    predictionValue = prediction === "heads" ? 1 : 2;
  } else if (gameCode === GameType.DICE) {
    predictionValue = prediction === "high" ? 1 : 2;
  } else if (gameCode === GameType.CRASH) {
    // For crash, we convert the multiplier to basis points (1.5x = 150)
    predictionValue = Math.floor(Number(prediction) * 100);
  } else {
    predictionValue = 0;
  }
  
  return {
    gameType: gameCode,
    prediction: predictionValue
  };
};

/**
 * Validates bet amount against minimum and maximum allowed values
 */
export const validateBetAmount = (amount: number): { valid: boolean; message: string } => {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, message: "Invalid bet amount" };
  }
  
  if (amount < MIN_BET_TON) {
    return { valid: false, message: `Minimum bet is ${MIN_BET_TON} TON` };
  }
  
  if (amount > MAX_BET_TON) {
    return { valid: false, message: `Maximum bet is ${MAX_BET_TON} TON` };
  }
  
  return { valid: true, message: "" };
};

/**
 * Checks if wallet has sufficient balance for a bet
 */
export const hasSufficientBalance = (balance: string | number | null, betAmount: number): boolean => {
  if (balance === null || balance === undefined) return false;
  
  const balanceNum = typeof balance === 'string' ? parseFloat(balance) : balance;
  return balanceNum >= betAmount;
};

/**
 * Generate a unique bet ID for tracking
 */
export const generateBetId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Calculate potential payout for a bet (before house edge)
 */
export const calculatePotentialPayout = (betAmount: number, game: string, prediction: any): number => {
  let multiplier = 0;
  
  switch(game) {
    case 'coinflip':
      multiplier = 1.96; // 50% chance minus house edge
      break;
    case 'dice':
      multiplier = 1.96; // 50% chance minus house edge
      break;
    case 'crash':
      multiplier = Number(prediction);
      break;
    default:
      multiplier = 0;
  }
  
  // Apply house edge
  const houseEdgeMultiplier = 1 - (HOUSE_EDGE_PERCENT / 100);
  return betAmount * multiplier * houseEdgeMultiplier;
};

/**
 * Calculate house profit from a bet
 */
export const calculateHouseProfit = (betAmount: number, payout: number): number => {
  return betAmount - payout;
};

/**
 * Interface for bet data sent to contract
 */
export interface BetData {
  betId: string;
  gameType: number;
  prediction: number;
  amount: bigint;
  timestamp: number;
  playerAddress: string;
}

/**
 * Create bet data object for contract interaction
 */
export const createBetData = (
  gameType: string | number,
  prediction: any,
  amount: number,
  playerAddress: string
): BetData => {
  const encodedGame = encodeGameData(gameType, prediction);
  
  return {
    betId: generateBetId(),
    gameType: encodedGame.gameType,
    prediction: encodedGame.prediction,
    amount: toNano(amount),
    timestamp: Math.floor(Date.now() / 1000),
    playerAddress
  };
};

/**
 * Creates message body payload for a TON transaction to the gaming contract
 */
export const createTonTransactionPayload = (betData: BetData): string => {
  // In a real implementation, you would use TonClient to encode this properly
  // This is a simplified version that matches our contract's expected format
  const payload = {
    "op": 1, // op::place_bet
    "game_type": betData.gameType,
    "prediction": betData.prediction,
    "timestamp": betData.timestamp
  };
  
  // Convert to base64 for contract
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

/**
 * Initializes a listener for bet results from the contract
 */
export const initContractEventListener = (callback: (event: any) => void) => {
  // In a real implementation, you would:
  // 1. Subscribe to events from your TON contract
  // 2. Process incoming events and pass them to the callback
  // 3. Handle reconnection logic, etc.
  
  console.log("Contract event listener initialized for address:", getContractAddress());
  
  // Return an unsubscribe function
  return () => {
    console.log("Contract event listener unsubscribed");
  };
};

/**
 * Creates a transaction to place a bet
 */
export const createBetTransaction = (betData: BetData) => {
  return {
    to: getContractAddress(),
    value: betData.amount,
    payload: createTonTransactionPayload(betData),
    // Other transaction parameters would be set here
  };
};

/**
 * Utility for verifying bet outcomes (for provably fair verification)
 */
export const verifyBetOutcome = (
  betId: string, 
  gameType: number, 
  prediction: number, 
  randomValue: bigint
): {outcome: number, won: boolean, payout: number} => {
  // This is a client-side implementation of the same logic in the contract
  // Used for verifying that the contract is behaving fairly
  
  let outcome = 0;
  let won = false;
  
  if (gameType === GameType.COINFLIP) {
    outcome = 1 + (Number(randomValue) % 2);
    won = (outcome === prediction);
  } else if (gameType === GameType.DICE) {
    outcome = 1 + (Number(randomValue) % 6);
    if (prediction === 1) {
      won = (outcome > 3);
    } else {
      won = (outcome <= 3);
    }
  } else if (gameType === GameType.CRASH) {
    // Simplified crash implementation for verification
    const rnd = Number(randomValue) % 100;
    let crashPoint;
    
    if (rnd < 15) {
      crashPoint = 100 + (Number(randomValue) % 20);
    } else if (rnd < 65) {
      crashPoint = 120 + (Number(randomValue) % 180);
    } else if (rnd < 90) {
      crashPoint = 300 + (Number(randomValue) % 500);
    } else if (rnd < 98) {
      crashPoint = 800 + (Number(randomValue) % 1200);
    } else {
      crashPoint = 2000 + (Number(randomValue) % 3000);
    }
    
    outcome = crashPoint;
    won = (crashPoint >= prediction);
  }
  
  // Calculate payout (simplified from contract calculation)
  const payout = won ? Number(prediction) * (1 - HOUSE_EDGE_PERCENT / 100) : 0;
  
  return { outcome, won, payout };
};
