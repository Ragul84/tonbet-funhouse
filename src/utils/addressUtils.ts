
/**
 * TON Address formatter utilities for browser environments.
 * Provides formatting functions for TON addresses without requiring Node.js Buffer.
 */

import { toast } from "sonner";

/**
 * Formats a TON wallet address to a user-friendly format.
 * 
 * @param address The raw wallet address (e.g. 0:90b9...928d)
 * @returns The user-friendly formatted address
 */
export const formatTonAddress = (address: string | null): string | null => {
  if (!address) return null;
  
  try {
    // Since we can't use @ton/core in the browser directly due to Buffer issues,
    // we'll use a simpler approach for formatting the address
    
    // Check if it's in the standard format with workchain:hex
    if (address.includes(':')) {
      const parts = address.split(':');
      if (parts.length === 2) {
        const workchain = parts[0];
        const hexPart = parts[1];
        
        // Use a more visually distinct format (UQ... style)
        // This is a simplified version since we can't use the actual TON SDK in browser
        return `UQ${hexPart.slice(0, 6)}...${hexPart.slice(-4)}`;
      }
    }
    
    // If the format doesn't match what we expect, return as is
    return address;
  } catch (error) {
    console.error("Error formatting TON address:", error);
    toast.error("Failed to format wallet address");
    return address; // Return original address if conversion fails
  }
};

/**
 * Converts nano TON to TON with 2 decimal places.
 * 
 * @param balanceNano Balance in nano TON (1 TON = 1e9 nano TON)
 * @returns Balance in TON as a string with 2 decimal places
 */
export const formatTonBalance = (balanceNano: string | null): string | null => {
  if (!balanceNano) return null;
  
  try {
    const balanceTON = Number(balanceNano) / 1e9; // Convert nano TON to TON
    return balanceTON.toFixed(2); // Format to 2 decimal places
  } catch (error) {
    console.error("Error formatting TON balance:", error);
    return "0.00";
  }
};
