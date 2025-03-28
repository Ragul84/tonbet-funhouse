
import { Address } from '@ton/core';

// Contract address constants
export const MAINNET_CONTRACT_ADDRESS = "EQD__MAINNET_CONTRACT_ADDRESS__";
export const TESTNET_CONTRACT_ADDRESS = "EQD__TESTNET_CONTRACT_ADDRESS__";

// Use testnet by default for development
export const USE_TESTNET = true;

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
 */
export const encodeGameData = (gameType: number | string, prediction: any): string => {
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
 * Creates payload for a TON transaction to the gaming contract
 */
export const createTonTransactionPayload = (betData: BetData): {
  to: string;
  value: bigint;
  payload: string;
} => {
  return {
    to: getContractAddress(),
    value: betData.amount,
    payload: JSON.stringify({
      op: 'place_bet',
      bet_id: betData.betId,
      game_type: betData.gameType,
      prediction: betData.prediction,
      timestamp: betData.timestamp
    })
  };
};
