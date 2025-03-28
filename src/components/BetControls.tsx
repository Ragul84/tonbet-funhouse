
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { useTelegramContext } from "@/context/TelegramContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, LogOut } from "lucide-react";

interface BetControlsProps {
  onBet: () => void;
  disabled?: boolean;
}

const BetControls: React.FC<BetControlsProps> = ({ onBet, disabled = false }) => {
  const { betAmount, setBetAmount, balance, isLoading } = useGameContext();
  const { wallet, connectWallet, disconnectWallet } = useTelegramContext();

  // Format balance for display and calculations
  const getAvailableBalance = () => {
    if (wallet.connected && wallet.balance) {
      // Convert string to number if needed
      const numericBalance = typeof wallet.balance === 'string' 
        ? parseFloat(wallet.balance) 
        : wallet.balance;
      
      // Return with 2 decimal precision for consistency
      return parseFloat(numericBalance.toFixed(2));
    }
    return balance;
  };
  
  const availableBalance = getAvailableBalance();

  const increaseBet = (amount: number) => {
    setBetAmount((prev) => {
      const newAmount = Math.min(prev + amount, availableBalance);
      return parseFloat(newAmount.toFixed(2)); // Ensure proper decimal formatting
    });
  };

  const decreaseBet = (amount: number) => {
    setBetAmount((prev) => {
      const newAmount = Math.max(prev - amount, 0.1); // Minimum bet of 0.1 TON
      return parseFloat(newAmount.toFixed(2)); // Ensure proper decimal formatting
    });
  };

  const setMaxBet = () => {
    setBetAmount(parseFloat(availableBalance.toFixed(2)));
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      const newAmount = Math.min(value, availableBalance);
      setBetAmount(parseFloat(newAmount.toFixed(2)));
    } else {
      setBetAmount(0);
    }
  };
  
  const handleConnectWallet = async () => {
    console.log("Connect wallet button clicked");
    try {
      // Expand Telegram WebApp for better UX during wallet connection
      if (window.Telegram?.WebApp?.expand) {
        window.Telegram.WebApp.expand();
      }
      await connectWallet();
    } catch (error) {
      console.error("Error in connect wallet handler:", error);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-400 mb-4">Connect your TON wallet to place bets</p>
        <Button 
          onClick={handleConnectWallet} 
          className="bg-app-purple hover:bg-app-purple/90 w-full"
        >
          <Wallet className="mr-2 h-5 w-5" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  const isInsufficientBalance = betAmount > availableBalance;

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Connected Wallet</span>
        <Button
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="bg-black/30 hover:bg-red-500/20 border-red-500/30 text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Balance:</span>
        <span className="font-medium">{availableBalance.toFixed(2)} TON</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label htmlFor="bet-amount" className="block text-sm text-gray-400 mb-1">
            Bet Amount (TON)
          </label>
          <Input
            id="bet-amount"
            type="number"
            value={betAmount}
            onChange={handleBetAmountChange}
            className={`bg-black/30 ${
              isInsufficientBalance 
                ? "border-red-500 focus:border-red-500" 
                : "border-app-purple/30 focus:border-app-purple"
            } w-full`}
          />
          {isInsufficientBalance && (
            <p className="text-xs text-red-500 mt-1">Insufficient balance</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={() => increaseBet(5)} 
            variant="outline" 
            className="bg-black/30 hover:bg-app-purple/20 border-app-purple/30 h-8"
            disabled={availableBalance <= betAmount}
          >
            +5
          </Button>
          <Button 
            onClick={() => decreaseBet(5)} 
            variant="outline" 
            className="bg-black/30 hover:bg-app-purple/20 border-app-purple/30 h-8"
            disabled={betAmount <= 5}
          >
            -5
          </Button>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          onClick={() => setBetAmount(5)} 
          variant="outline" 
          className={`bg-black/30 hover:bg-app-purple/20 border-app-purple/30 flex-1 ${betAmount === 5 && "bg-app-purple/20"}`}
          disabled={5 > availableBalance}
        >
          5
        </Button>
        <Button 
          onClick={() => setBetAmount(10)} 
          variant="outline" 
          className={`bg-black/30 hover:bg-app-purple/20 border-app-purple/30 flex-1 ${betAmount === 10 && "bg-app-purple/20"}`}
          disabled={10 > availableBalance}
        >
          10
        </Button>
        <Button 
          onClick={() => setBetAmount(25)} 
          variant="outline" 
          className={`bg-black/30 hover:bg-app-purple/20 border-app-purple/30 flex-1 ${betAmount === 25 && "bg-app-purple/20"}`}
          disabled={25 > availableBalance}
        >
          25
        </Button>
        <Button 
          onClick={setMaxBet} 
          variant="outline" 
          className="bg-black/30 hover:bg-app-purple/20 border-app-purple/30 flex-1"
        >
          Max
        </Button>
      </div>

      <Button 
        onClick={onBet} 
        disabled={disabled || isLoading || betAmount <= 0 || betAmount > availableBalance}
        className={`w-full ${
          isInsufficientBalance || betAmount <= 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-app-purple hover:bg-app-purple/90 hover:shadow-neon"
        }`}
      >
        {isLoading ? "Processing..." : "Place Bet"}
      </Button>
      
      <div className="text-xs text-gray-400 text-center">
        Platform fee: 0.2% • Min bet: 0.1 TON
      </div>
    </div>
  );
};

export default BetControls;
