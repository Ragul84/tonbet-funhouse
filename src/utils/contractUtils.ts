
import { Address } from '@ton/core';

// Contract address constants
export const MAINNET_CONTRACT_ADDRESS = "EQD__MAINNET_CONTRACT_ADDRESS__";
export const TESTNET_CONTRACT_ADDRESS = "EQD__TESTNET_CONTRACT_ADDRESS__";

// Use testnet by default for development
export const USE_TESTNET = true;

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
