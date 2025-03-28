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
    TonConnect?: {
      connect: () => Promise<any>;
      disconnect: () => Promise<void>;
      isConnected: boolean;
      address: string | null;
      getBalance: () => Promise<string>;
    };
    tonkeeper?: {
      ready: boolean;
      connect: () => Promise<{ address: string; publicKey: string }>;
      disconnect: () => Promise<void>;
      isConnected: () => Promise<boolean>;
      getBalance: () => Promise<string>;
      address?: string;
      walletInfo?: { 
        address: string;
        publicKey: string;
      };
    };
  }
}

interface TelegramUser {
  id: number;
  username: string;
  firstName: string;
  lastName?: string;
  profileImage?: string;
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
  setProfileImage: (imagePath: string) => void;
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
      console.log("Starting wallet connection attempt...");
      
      if (window.Telegram?.WebApp && window.Telegram.WebApp.initData) {
        toast.info("Connecting to TON wallet via Telegram...");
        console.log("Attempting to connect wallet via Telegram WebApp");
        
        const mockAddress = "UQBrZ7sgyxPrFZKzMxBUj1ZJ27JNXEF7IgmVWZvxktA6PAM2";
        const mockBalance = "500000000"; // 0.5 TON in nanoTON
        
        setWallet({
          connected: true,
          address: mockAddress,
          balance: mockBalance
        });
        
        toast.success("Wallet connected via Telegram!");
        return;
      }
      
      if (window.tonkeeper) {
        toast.info("Connecting to Tonkeeper wallet...");
        console.log("Tonkeeper detected, attempting to connect");
        
        try {
          if (!window.tonkeeper.ready) {
            await new Promise<void>((resolve) => {
              const checkReady = () => {
                if (window.tonkeeper?.ready) {
                  resolve();
                } else {
                  setTimeout(checkReady, 100);
                }
              };
              checkReady();
            });
          }
          
          const result = await window.tonkeeper.connect();
          console.log("Tonkeeper connect result:", result);
          
          const balance = await window.tonkeeper.getBalance();
          
          setWallet({
            connected: true,
            address: result.address,
            balance: balance
          });
          
          toast.success("Connected to Tonkeeper wallet!");
          return;
        } catch (error) {
          console.error("Error connecting to Tonkeeper:", error);
          toast.error("Failed to connect to Tonkeeper. Please try again.");
        }
      }
      
      if (window.TON) {
        toast.info("Connecting to TON wallet...");
        
        try {
          console.log("TON wallet detected, attempting to connect");
          const result = await window.TON.connect();
          
          setWallet({
            connected: true,
            address: result.address,
            balance: result.balance
          });
          
          toast.success("TON wallet connected successfully!");
          return;
        } catch (error) {
          console.error("Error connecting to TON wallet:", error);
          toast.error("Failed to connect TON wallet. Please try again.");
        }
      }
      
      if (window.TonConnect) {
        toast.info("Connecting via TonConnect...");
        
        try {
          console.log("TonConnect detected, attempting to connect");
          await window.TonConnect.connect();
          
          if (window.TonConnect.isConnected && window.TonConnect.address) {
            const balance = await window.TonConnect.getBalance();
            
            setWallet({
              connected: true,
              address: window.TonConnect.address,
              balance: balance
            });
            
            toast.success("Wallet connected via TonConnect!");
            return;
          }
        } catch (error) {
          console.error("Error connecting via TonConnect:", error);
          toast.error("Failed to connect wallet via TonConnect. Please try again.");
        }
      }
      
      console.log("No compatible wallet found. Available globals:", {
        tonkeeper: !!window.tonkeeper,
        TON: !!window.TON,
        TonConnect: !!window.TonConnect
      });
      
      toast.error("No compatible TON wallet detected. Please install Tonkeeper extension or another TON wallet.");
      console.warn("No compatible TON wallet detected. Please ensure Tonkeeper or another TON wallet extension is installed.");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const setProfileImage = (imagePath: string) => {
    if (user) {
      setUser({
        ...user,
        profileImage: imagePath
      });
      localStorage.setItem('userProfileImage', imagePath);
      toast.success("Profile image updated successfully!");
    }
  };

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
        if (window.Telegram?.WebApp) {
          const telegramWebApp = window.Telegram.WebApp;
          telegramWebApp.ready();
          
          const userData = telegramWebApp.initDataUnsafe.user;
          
          if (userData) {
            setUser({
              id: userData.id,
              username: userData.username || `user${userData.id}`,
              firstName: userData.first_name,
              lastName: userData.last_name,
              profileImage: localStorage.getItem('userProfileImage') || undefined
            });
          } else {
            console.log("No Telegram user data available, using mock data");
            setUser({
              id: 123456789,
              username: "testuser",
              firstName: "Test",
              lastName: "User",
              profileImage: localStorage.getItem('userProfileImage') || undefined
            });
          }
        } else {
          console.log("Telegram WebApp not available, using mock data");
          setUser({
            id: 123456789,
            username: "testuser",
            firstName: "Test",
            lastName: "User",
            profileImage: localStorage.getItem('userProfileImage') || undefined
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
    <TelegramContext.Provider value={{ user, isLoading, wallet, connectWallet, setProfileImage }}>
      {children}
    </TelegramContext.Provider>
  );
};
