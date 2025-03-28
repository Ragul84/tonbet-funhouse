
import React, { createContext, useContext, useState, useEffect } from "react";

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
}

interface TelegramContextType {
  user: TelegramUser | null;
  isLoading: boolean;
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
    <TelegramContext.Provider value={{ user, isLoading }}>
      {children}
    </TelegramContext.Provider>
  );
};
