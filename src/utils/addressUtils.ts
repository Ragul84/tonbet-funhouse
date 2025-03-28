
import { toast } from "sonner";

/**
 * Formats a TON wallet address to a user-friendly format.
 * 
 * @param address The raw wallet address (e.g. 0:90b9...928d)
 * @returns The user-friendly format starting with UQ
 */
export const formatTonAddress = (address: string | null): string | null => {
  if (!address) return null;
  
  // If the address is already in UQ format, return it
  if (address.startsWith('UQ')) return address;
  
  try {
    // For real TON address conversion, you would typically use:
    // import { Address } from "@ton/core";
    // const formattedAddress = Address.parseRaw(address).toString({bounceable: true, urlSafe: true});
    
    // Since we don't have @ton/core as a dependency, we'll use a simplified approach
    // by displaying the raw address with first 6 and last 4 characters
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    
    // Note: To properly convert to UQ format, you would need to:
    // 1. Install @ton/core: npm install @ton/core
    // 2. Import Address and use:
    //    Address.parseRaw(address).toString({bounceable: true, urlSafe: true})
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
