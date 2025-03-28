
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
