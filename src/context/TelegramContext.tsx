
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useTonConnectUI } from "@tonconnect/ui-react";

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
  disconnectWallet: () => void;
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
  
  // Initialize TON Connect
  const [tonConnectUI] = useTonConnectUI();

  // Connect to TON wallet
  const connectWallet = async () => {
    try {
      if (wallet.connected) {
        toast.info("Already connected to wallet");
        return;
      }
      
      await tonConnectUI.connectWallet();
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  // Disconnect from TON wallet
  const disconnectWallet = () => {
    try {
      if (!wallet.connected) {
        toast.info("No wallet connected");
        return;
      }
      
      tonConnectUI.disconnect();
      setWallet({
        connected: false,
        address: null,
        balance: null
      });
      toast.success("Wallet disconnected successfully!");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet. Please try again.");
    }
  };

  // Monitor wallet connection status
  useEffect(() => {
    if (!tonConnectUI) return;
    
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      if (walletInfo) {
        setWallet({
          connected: true,
          address: walletInfo.account.address,
          balance: "Loading..." // We'll fetch the actual balance separately
        });
        
        // Fetch wallet balance (this is a simplified example)
        // In a real app, you would use a TON client library to query the blockchain
        const simulateBalanceFetch = async () => {
          // Simulate balance fetch with a more reasonable amount (1-10 TON)
          const mockBalance = (1 + Math.random() * 9) * 1e9; // Random TON amount between 1-10 TON
          setWallet(prev => ({
            ...prev,
            balance: mockBalance.toString()
          }));
        };
        
        simulateBalanceFetch();
      } else {
        setWallet({
          connected: false,
          address: null,
          balance: null
        });
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

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

  // Initialize Telegram user
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
              lastName: userData.last_name,
              profileImage: localStorage.getItem('userProfileImage') || undefined
            });
          } else {
            // For development/testing when not in Telegram
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
          // For development/testing when not in Telegram
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
    <TelegramContext.Provider value={{ user, isLoading, wallet, connectWallet, disconnectWallet, setProfileImage }}>
      {children}
    </TelegramContext.Provider>
  );
};
