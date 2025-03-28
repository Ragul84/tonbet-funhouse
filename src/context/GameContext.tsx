
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type GameType = "coinflip" | "dice" | "crash";

interface Bet {
  id: string;
  game: GameType;
  amount: number;
  timestamp: Date;
  outcome: "win" | "lose" | "pending";
  payout: number;
}

interface GameContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
  placeBet: (game: GameType, prediction: any) => Promise<boolean>;
  bets: Bet[];
  isLoading: boolean;
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

  // Generate a random outcome based on probability
  const generateOutcome = (winProbability: number) => {
    return Math.random() < winProbability;
  };

  const placeBet = async (game: GameType, prediction: any): Promise<boolean> => {
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
    };

    setBets((prev) => [newBet, ...prev]);

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
