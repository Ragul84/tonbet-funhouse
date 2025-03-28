import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { formatTonAddress, formatTonBalance } from "../utils/addressUtils";

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
        expand: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
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
  formattedAddress: string | null;
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
    formattedAddress: null,
    balance: null
  });
  
  const [tonConnectUI, setOptions] = useTonConnectUI();

  useEffect(() => {
    setOptions({
      uiPreferences: {
      },
    });
  }, [setOptions]);

  const connectWallet = async () => {
    try {
      console.info("Attempting to connect wallet...");
      
      if (wallet.connected) {
        toast.info("Already connected to wallet");
        return;
      }
      
      if (!tonConnectUI) {
        console.error("TonConnectUI is not initialized");
        toast.error("Wallet connection failed. Please try again later.");
        return;
      }

      if (window.Telegram?.WebApp?.expand) {
        window.Telegram.WebApp.expand();
      }
      
      await tonConnectUI.connectWallet();
      console.info("Wallet connection initiated");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

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
        formattedAddress: null,
        balance: null
      });
      console.info("Wallet disconnected");
      toast.success("Wallet disconnected successfully!");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet. Please try again.");
    }
  };

  useEffect(() => {
    if (!tonConnectUI) {
      console.error("TonConnectUI is not available in the effect");
      return;
    }
    
    console.info("Setting up wallet connection listener");
    
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      console.info("Wallet status changed:", walletInfo ? "connected" : "disconnected");
      
      if (walletInfo) {
        const rawAddress = walletInfo.account.address;
        console.info("Wallet connected:", rawAddress);
        
        const formattedAddress = formatTonAddress(rawAddress);
        console.info("Formatted address:", formattedAddress);
        
        setWallet({
          connected: true,
          address: rawAddress,
          formattedAddress: formattedAddress,
          balance: "Loading..."
        });
        
        const fetchBalance = async () => {
          try {
            const fixedBalance = 30.90;
            const formattedBalance = formatTonBalance(fixedBalance);
            console.info("Setting wallet balance:", formattedBalance);
            
            setWallet(prev => ({
              ...prev,
              balance: formattedBalance
            }));
          } catch (error) {
            console.error("Error fetching balance:", error);
            setWallet(prev => ({
              ...prev,
              balance: "Error"
            }));
          }
        };
        
        fetchBalance();
      } else {
        console.info("Wallet disconnected");
        setWallet({
          connected: false,
          address: null,
          formattedAddress: null,
          balance: null
        });
      }
    });
    
    if (tonConnectUI.connected) {
      console.info("Wallet already connected, fetching info");
      const walletInfo = tonConnectUI.wallet;
      if (walletInfo) {
        const rawAddress = walletInfo.account.address;
        const formattedAddress = formatTonAddress(rawAddress);
        
        console.info("Raw address:", rawAddress);
        console.info("Formatted address:", formattedAddress);
        
        setWallet({
          connected: true,
          address: rawAddress,
          formattedAddress: formattedAddress,
          balance: "Loading..."
        });
        
        const fixedBalance = 30.90;
        const formattedBalance = formatTonBalance(fixedBalance);
        setWallet(prev => ({
          ...prev,
          balance: formattedBalance
        }));
      }
    }
    
    return () => {
      console.info("Cleaning up wallet connection listener");
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
    <TelegramContext.Provider value={{ user, isLoading, wallet, connectWallet, disconnectWallet, setProfileImage }}>
      {children}
    </TelegramContext.Provider>
  );
};
