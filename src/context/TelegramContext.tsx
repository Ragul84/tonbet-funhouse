
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
  balance: string | null;
  formattedAddress: string | null; // New field for user-friendly address
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

// Function to format wallet address to user-friendly format
const formatWalletAddress = (address: string | null): string | null => {
  if (!address) return null;
  
  // Check if the address is already in the format we want
  if (address.startsWith('UQ')) return address;
  
  // Simple format: Just show first 6 and last 4 characters
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  
  // Note: For true conversion to UQ format, you would need to import
  // the @ton/core package and use Address.parseRaw(address).toString({bounceable: true, urlSafe: true})
};

// Function to convert nano TON to TON with 2 decimal places
const formatTONBalance = (balanceNano: string | null): string | null => {
  if (!balanceNano) return null;
  
  try {
    const balanceTON = Number(balanceNano) / 1e9; // Convert nano TON to TON
    return balanceTON.toFixed(2); // Format to 2 decimal places
  } catch (error) {
    console.error("Error formatting TON balance:", error);
    return "0.00";
  }
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
  
  // Initialize TON Connect with UI components
  const [tonConnectUI, setOptions] = useTonConnectUI();

  // Configure TON Connect UI
  useEffect(() => {
    // Setting UI preferences without using theme directly
    setOptions({
      uiPreferences: {
        // Using the options that are actually available
      },
    });
  }, [setOptions]);

  // Connect to TON wallet
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

      // Expand the Telegram Web App to ensure full screen for wallet connection
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

  // Monitor wallet connection status
  useEffect(() => {
    if (!tonConnectUI) {
      console.error("TonConnectUI is not available in the effect");
      return;
    }
    
    console.info("Setting up wallet connection listener");
    
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      console.info("Wallet status changed:", walletInfo ? "connected" : "disconnected");
      
      if (walletInfo) {
        const address = walletInfo.account.address;
        console.info("Wallet connected:", address);
        
        setWallet({
          connected: true,
          address: address,
          formattedAddress: formatWalletAddress(address),
          balance: "Loading..." // We'll fetch the actual balance separately
        });
        
        // Fetch wallet balance
        const fetchBalance = async () => {
          try {
            // In a real implementation, we would fetch the actual balance from the TON blockchain
            // For now, we'll use a simulated balance
            const mockBalance = (1 + Math.random() * 9) * 1e9; // Random TON amount between 1-10 TON
            const formattedBalance = formatTONBalance(mockBalance.toString());
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
    
    // Check if wallet is already connected
    if (tonConnectUI.connected) {
      console.info("Wallet already connected, fetching info");
      const walletInfo = tonConnectUI.wallet;
      if (walletInfo) {
        const address = walletInfo.account.address;
        setWallet({
          connected: true,
          address: address,
          formattedAddress: formatWalletAddress(address),
          balance: "Loading..."
        });
        
        // Simulate balance fetch
        const mockBalance = (1 + Math.random() * 9) * 1e9;
        const formattedBalance = formatTONBalance(mockBalance.toString());
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

  // Update profile image
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
