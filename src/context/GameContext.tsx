import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useTelegramContext } from "./TelegramContext";

// Add a type declaration for the TON property on the Window object
declare global {
  interface Window {
    TON?: any; // Define TON as an optional property of type any
  }
}

// Define the contract address where bets will be sent
const GAME_CONTRACT_ADDRESS = "EQD__CONTRACT_ADDRESS_PLACEHOLDER__";

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
  isTrial?: boolean;
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
  placeBet: (game: GameType, prediction: any, isTrial?: boolean) => Promise<boolean>;
  bets: Bet[];
  isLoading: boolean;
  userStats: UserStats[];
  currentUserStats: UserStats | null;
  trialPlaysLeft: number;
  setTrialPlaysLeft: React.Dispatch<React.SetStateAction<number>>;
  currentGame: GameType | null;
  setCurrentGame: React.Dispatch<React.SetStateAction<GameType | null>>;
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
  const [trialPlaysLeft, setTrialPlaysLeft] = useState(2); // Each user gets 2 free trial plays
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const { user, wallet } = useTelegramContext();

  // Current user stats
  const currentUserStats = user ? userStats.find(stats => stats.userId === user.id) || null : null;

  // Generate a random outcome based on probability
  const generateOutcome = (winProbability: number) => {
    return Math.random() < winProbability;
  };

  // Update user stats based on bet outcome
  const updateUserStats = (userId: number, username: string, amount: number, isWin: boolean, payout: number, isTrial?: boolean) => {
    // Don't update stats for trial plays
    if (isTrial) return;
    
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

  // Function to encode game data for smart contract
  const encodeGameData = (game: GameType, prediction: any): string => {
    // In a real implementation, you would encode the game type and prediction
    // for the smart contract to understand
    const gameCode = game === "coinflip" ? 1 : game === "dice" ? 2 : 3;
    
    // Convert prediction to a format the contract would understand
    let predictionValue;
    switch (game) {
      case "coinflip":
        predictionValue = prediction === "heads" ? 1 : 2;
        break;
      case "dice":
        predictionValue = prediction === "high" ? 1 : 2;
        break;
      case "crash":
        // For crash, we convert the multiplier to basis points (1.5x = 150)
        predictionValue = Math.floor(prediction * 100);
        break;
      default:
        predictionValue = 0;
    }
    
    // This is a placeholder - in a real implementation you would use
    // proper TON contract encoding methods
    return `game:${gameCode},pred:${predictionValue}`;
  };

  // Process a real TON transaction
  const processRealTransaction = async (amount: number, game: GameType, prediction: any): Promise<boolean> => {
    if (!window.TON) {
      toast.error("TON wallet connection not available");
      return false;
    }
    
    try {
      toast.info("Processing transaction...");
      
      // Convert amount to nanoTON (1 TON = 1e9 nanoTON)
      const amountInNano = amount * 1e9;
      
      // Encode game data for the smart contract
      const encodedData = encodeGameData(game, prediction);
      
      // In production, use TON SDK to properly encode the transaction
      const txResult = await window.TON.sendTransaction({
        to: GAME_CONTRACT_ADDRESS,
        value: amountInNano,
        data: encodedData,
        dataType: 'text', // or 'hex' depending on your contract
      });
      
      console.log("Transaction result:", txResult);
      
      if (txResult && txResult.status === 'ok') {
        toast.success("Transaction confirmed!");
        return true;
      } else {
        toast.error("Transaction failed");
        return false;
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed. Please try again.");
      return false;
    }
  };

  const placeBet = async (game: GameType, prediction: any, isTrial: boolean = false): Promise<boolean> => {
    if (!user) {
      toast.error("Please connect to Telegram first");
      return false;
    }

    // Handle trial mode
    if (isTrial) {
      if (trialPlaysLeft <= 0) {
        toast.error("No trial plays left. Place a real bet!");
        return false;
      }
      
      setTrialPlaysLeft(prev => prev - 1);
    } else {
      // Real bet checks
      if (betAmount <= 0) {
        toast.error("Bet amount must be greater than 0");
        return false;
      }

      // Check if wallet is connected
      if (wallet.connected) {
        if (!wallet.address || !wallet.balance) {
          toast.error("Wallet not properly connected");
          return false;
        }

        // Convert wallet balance to number if it's a string
        const walletBalanceNumber = typeof wallet.balance === 'string' 
          ? parseFloat(wallet.balance)
          : wallet.balance;
        
        if (betAmount > walletBalanceNumber) {
          toast.error("Insufficient wallet balance");
          return false;
        }
      } else {
        // Using simulated balance for demo
        if (betAmount > balance) {
          toast.error("Insufficient balance");
          return false;
        }
      }

      // Deduct balance for real bets
      if (!wallet.connected) {
        setBalance((prev) => prev - betAmount);
      }
    }

    setIsLoading(true);

    // If wallet is connected and not a trial, try to send a real transaction
    if (wallet.connected && window.TON && !isTrial) {
      const txSuccess = await processRealTransaction(betAmount, game, prediction);
      if (!txSuccess) {
        setIsLoading(false);
        return false;
      }
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let isWin = false;
    let winAmount = 0;
    const platformFee = isTrial ? 0 : betAmount * 0.002; // No fee for trial plays

    // Set different win rates for trial vs. real bets
    const winRate = isTrial ? 0.8 : 0.4; // 80% for trial, 40% for real bets

    // Different game logic with adjusted win rates
    switch (game) {
      case "coinflip":
        // 80% for trial, 40% for real bets
        isWin = generateOutcome(winRate) && prediction === (Math.random() < 0.5 ? "heads" : "tails");
        break;
      case "dice":
        const diceResult = Math.floor(Math.random() * 6) + 1;
        if (prediction === "high") {
          // Higher chance to win for high prediction (4-6)
          isWin = diceResult > 3 && generateOutcome(winRate);
        } else {
          // Higher chance to win for low prediction (1-3)
          isWin = diceResult <= 3 && generateOutcome(winRate);
        }
        break;
      case "crash":
        // For crash, prediction is the cash-out multiplier
        // Now using a more realistic crash algorithm:
        let crashPoint;
        
        const randomValue = Math.random();
        if (randomValue < 0.15) {
          // 15% chance of very early crash (1.0x to 1.2x)
          crashPoint = (1.0 + (Math.random() * 0.2)).toFixed(2);
        } else if (randomValue < 0.65) {
          // 50% chance of crash between 1.2x and 3x
          crashPoint = (1.2 + (Math.random() * 1.8)).toFixed(2);
        } else if (randomValue < 0.90) {
          // 25% chance of crash between 3x and 8x
          crashPoint = (3.0 + (Math.random() * 5.0)).toFixed(2);
        } else if (randomValue < 0.98) {
          // 8% chance of crash between 8x and 20x
          crashPoint = (8.0 + (Math.random() * 12.0)).toFixed(2);
        } else {
          // 2% chance of crash above 20x (up to 50x)
          crashPoint = (20.0 + (Math.random() * 30.0)).toFixed(2);
        }
        
        // Adjust win rate based on prediction
        const adjustedWinRate = winRate * (1 / prediction); // Harder to win with higher multiplier targets
        isWin = Number(crashPoint) > prediction && generateOutcome(adjustedWinRate);
        break;
    }

    // Calculate winnings with 1.8x multiplier if win
    winAmount = isWin ? (isTrial ? 0 : betAmount * 1.8 - platformFee) : 0;

    // Add bet to history
    const newBet: Bet = {
      id: Math.random().toString(36).substring(2, 9),
      game,
      amount: isTrial ? 0 : betAmount,
      timestamp: new Date(),
      outcome: isWin ? "win" : "lose",
      payout: winAmount,
      userId: user.id,
      username: user.username,
      isTrial
    };

    setBets((prev) => [newBet, ...prev]);

    // Update user stats for real bets
    if (!isTrial) {
      updateUserStats(user.id, user.username, betAmount, isWin, winAmount);

      // If using simulated balance, update it for real wins
      if (!wallet.connected) {
        // Update balance if won
        if (isWin) {
          setBalance((prev) => prev + winAmount);
        }
      }
    }

    if (isWin) {
      toast.success(isTrial 
        ? `You would have won ${(betAmount * 1.8).toFixed(2)} TON! (Trial Play)` 
        : `You won ${winAmount.toFixed(2)} TON!`);
        
      // In a real implementation, the smart contract would handle payouts automatically
      // based on the game results and odds
    } else {
      toast.error(isTrial 
        ? "Better luck next time! (Trial Play)" 
        : "Better luck next time!");
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
        currentUserStats,
        trialPlaysLeft,
        setTrialPlaysLeft,
        currentGame,
        setCurrentGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
