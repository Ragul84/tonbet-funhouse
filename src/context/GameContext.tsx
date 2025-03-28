
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useTelegramContext } from "./TelegramContext";

type GameType = "coinflip" | "dice" | "crash";

interface Bet {
  id: string;
  game: GameType;
  amount: number;
  timestamp: Date;
  outcome: "win" | "lose" | "pending";
  payout: number;
  userId: number;
  username: string;
}

interface UserStats {
  userId: number;
  username: string;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  netProfit: number;
}

interface GameContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
  placeBet: (game: GameType, prediction: any) => Promise<boolean>;
  bets: Bet[];
  isLoading: boolean;
  userStats: UserStats[];
  currentUserStats: UserStats | null;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(100); // Start with 100 TON for demo
  const [betAmount, setBetAmount] = useState(5);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const { user } = useTelegramContext();

  // Current user stats
  const currentUserStats = user ? userStats.find(stats => stats.userId === user.id) || null : null;

  // Generate a random outcome based on probability
  const generateOutcome = (winProbability: number) => {
    return Math.random() < winProbability;
  };

  // Update user stats based on bet outcome
  const updateUserStats = (userId: number, username: string, amount: number, isWin: boolean, payout: number) => {
    setUserStats(prevStats => {
      // Find existing user stats
      const existingUserIndex = prevStats.findIndex(stats => stats.userId === userId);
      
      if (existingUserIndex >= 0) {
        // Update existing user
        const updatedStats = [...prevStats];
        const user = updatedStats[existingUserIndex];
        
        updatedStats[existingUserIndex] = {
          ...user,
          totalBets: user.totalBets + 1,
          totalWins: isWin ? user.totalWins + 1 : user.totalWins,
          totalLosses: !isWin ? user.totalLosses + 1 : user.totalLosses,
          netProfit: isWin ? user.netProfit + payout - amount : user.netProfit - amount,
        };
        
        return updatedStats;
      } else {
        // Add new user
        return [
          ...prevStats,
          {
            userId,
            username,
            totalBets: 1,
            totalWins: isWin ? 1 : 0,
            totalLosses: !isWin ? 1 : 0,
            netProfit: isWin ? payout - amount : -amount,
          }
        ];
      }
    });
  };

  const placeBet = async (game: GameType, prediction: any): Promise<boolean> => {
    if (!user) {
      toast.error("Please connect to Telegram first");
      return false;
    }

    if (betAmount <= 0) {
      toast.error("Bet amount must be greater than 0");
      return false;
    }

    if (betAmount > balance) {
      toast.error("Insufficient balance");
      return false;
    }

    setIsLoading(true);
    setBalance((prev) => prev - betAmount);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let isWin = false;
    let winAmount = 0;
    const platformFee = betAmount * 0.002; // 0.2% platform fee

    // Different game logic
    switch (game) {
      case "coinflip":
        // 49% chance to win (accounting for house edge)
        isWin = generateOutcome(0.49) && prediction === (Math.random() < 0.5 ? "heads" : "tails");
        break;
      case "dice":
        const diceResult = Math.floor(Math.random() * 6) + 1;
        if (prediction === "high") {
          isWin = diceResult > 3 && generateOutcome(0.49);
        } else {
          isWin = diceResult <= 3 && generateOutcome(0.49);
        }
        break;
      case "crash":
        // For crash, prediction is the cash-out multiplier
        const crashPoint = (0.9 + Math.random() * 9).toFixed(2);
        isWin = Number(crashPoint) > prediction;
        break;
    }

    // Calculate winnings with 1.8x multiplier if win
    winAmount = isWin ? betAmount * 1.8 - platformFee : 0;

    // Add bet to history
    const newBet: Bet = {
      id: Math.random().toString(36).substring(2, 9),
      game,
      amount: betAmount,
      timestamp: new Date(),
      outcome: isWin ? "win" : "lose",
      payout: winAmount,
      userId: user.id,
      username: user.username
    };

    setBets((prev) => [newBet, ...prev]);

    // Update user stats
    updateUserStats(user.id, user.username, betAmount, isWin, winAmount);

    // Update balance if won
    if (isWin) {
      setBalance((prev) => prev + winAmount);
      toast.success(`You won ${winAmount.toFixed(2)} TON!`);
    } else {
      toast.error("Better luck next time!");
    }

    setIsLoading(false);
    return isWin;
  };

  return (
    <GameContext.Provider
      value={{
        balance,
        setBalance,
        betAmount,
        setBetAmount,
        placeBet,
        bets,
        isLoading,
        userStats,
        currentUserStats
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
