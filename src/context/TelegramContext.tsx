
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        ready: () => void;
      };
    };
    TON?: {
      sendTransaction: (transaction: any) => Promise<any>;
      send: (method: string, params: any) => Promise<any>;
      on: (eventName: string, callback: (result: any) => void) => void;
      isWalletInjected: boolean;
      address: string | null;
      balance: string | null;
      connect: () => Promise<{ address: string, balance: string }>;
    };
  }
}

interface TelegramUser {
  id: number;
  username: string;
  firstName: string;
  lastName?: string;
}

interface WalletInfo {
  connected: boolean;
  address: string | null;
  balance: string | null;
}

interface TelegramContextType {
  user: TelegramUser | null;
  isLoading: boolean;
  wallet: WalletInfo;
  connectWallet: () => Promise<void>;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegramContext must be used within a TelegramProvider");
  }
  return context;
};

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletInfo>({
    connected: false,
    address: null,
    balance: null
  });

  const connectWallet = async () => {
    try {
      if (!window.TON) {
        toast.error("TON wallet not detected. Please install TON wallet extension or use the TON app.");
        return;
      }

      if (wallet.connected) {
        toast.info("Already connected to wallet");
        return;
      }

      const result = await window.TON.connect();
      
      setWallet({
        connected: true,
        address: result.address,
        balance: result.balance
      });

      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  // Listen for wallet changes
  useEffect(() => {
    if (window.TON) {
      window.TON.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWallet({
            connected: false,
            address: null,
            balance: null
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    const initializeTelegram = () => {
      try {
        // Check if Telegram WebApp is available
        if (window.Telegram?.WebApp) {
          const telegramWebApp = window.Telegram.WebApp;
          telegramWebApp.ready();
          
          // Get user data from Telegram WebApp
          const userData = telegramWebApp.initDataUnsafe.user;
          
          if (userData) {
            setUser({
              id: userData.id,
              username: userData.username || `user${userData.id}`,
              firstName: userData.first_name,
              lastName: userData.last_name
            });
          } else {
            // For development/testing when not in Telegram
            console.log("No Telegram user data available, using mock data");
            setUser({
              id: 123456789,
              username: "testuser",
              firstName: "Test",
              lastName: "User"
            });
          }
        } else {
          // For development/testing when not in Telegram
          console.log("Telegram WebApp not available, using mock data");
          setUser({
            id: 123456789,
            username: "testuser",
            firstName: "Test",
            lastName: "User"
          });
        }
      } catch (error) {
        console.error("Error initializing Telegram:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTelegram();
  }, []);

  return (
    <TelegramContext.Provider value={{ user, isLoading, wallet, connectWallet }}>
      {children}
    </TelegramContext.Provider>
  );
};
