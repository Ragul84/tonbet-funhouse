/**
 * Checks what TON wallets are available in the browser
 * @returns Object with wallet availability information
 */
export const checkWalletAvailability = () => {
  return {
    tonkeeper: {
      available: !!window.tonkeeper,
      ready: window?.tonkeeper?.ready || false,
      address: window?.tonkeeper?.address || null,
    },
    TON: {
      available: !!window.TON,
      isInjected: window?.TON?.isWalletInjected || false,
      address: window?.TON?.address || null,
    },
    TonConnect: {
      available: !!window.TonConnect,
      isConnected: window?.TonConnect?.isConnected || false,
      address: window?.TonConnect?.address || null,
    },
    inTelegram: !!window.Telegram?.WebApp,
  };
};

/**
 * Connect to Tonkeeper wallet
 * @returns Promise with connection result
 */
export const connectToTonkeeper = async () => {
  console.log("Initiating Tonkeeper connection...");
  
  if (!window.tonkeeper) {
    console.error("Tonkeeper not available");
    throw new Error("Tonkeeper not available");
  }
  
  // Force a direct connection request to ensure permission prompt appears
  try {
    // Wait for tonkeeper to be ready if it's not
    if (!window.tonkeeper.ready) {
      console.log("Waiting for Tonkeeper to be ready...");
      await new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (window.tonkeeper?.ready) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 5000);
      });
    }
    
    console.log("Calling tonkeeper.connect() directly...");
    const result = await window.tonkeeper.connect();
    console.log("Tonkeeper connect result:", result);
    
    return result;
  } catch (error) {
    console.error("Error connecting to Tonkeeper:", error);
    throw error;
  }
};
