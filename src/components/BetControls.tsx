
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

  // Use wallet balance if connected, otherwise use game context balance
  const availableBalance = wallet.connected ? Number(wallet.balance)/1e9 : balance;

  const increaseBet = (amount: number) => {
    setBetAmount((prev) => Math.min(prev + amount, availableBalance));
  };

  const decreaseBet = (amount: number) => {
    setBetAmount((prev) => Math.max(prev - amount, 1));
  };

  const setMaxBet = () => {
    setBetAmount(availableBalance);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBetAmount(Math.min(value, availableBalance));
    } else {
      setBetAmount(0);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-400 mb-4">Connect your TON wallet to place bets</p>
        <Button 
          onClick={connectWallet} 
          className="bg-app-purple hover:bg-app-purple/90 w-full"
        >
          <Wallet className="mr-2 h-5 w-5" />
          Connect Wallet
        </Button>
      </div>
    );
  }

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
            className="bg-black/30 border-app-purple/30 focus:border-app-purple w-full"
          />
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
          className="bg-black/30 hover:bg-app-purple/20 border-app-purple/30 flex-1"
        >
          5
        </Button>
        <Button 
          onClick={() => setBetAmount(10)} 
          variant="outline" 
          className="bg-black/30 hover:bg-app-purple/20 border-app-purple/30 flex-1"
        >
          10
        </Button>
        <Button 
          onClick={() => setBetAmount(25)} 
          variant="outline" 
          className="bg-black/30 hover:bg-app-purple/20 border-app-purple/30 flex-1"
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
        className="w-full bg-app-purple hover:bg-app-purple/90 hover:shadow-neon"
      >
        {isLoading ? "Placing Bet..." : "Place Bet"}
      </Button>
    </div>
  );
};

export default BetControls;
