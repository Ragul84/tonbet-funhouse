
import React, { useState, useRef, useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import BetControls from "@/components/BetControls";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const Coinflip: React.FC = () => {
  const { placeBet, isLoading, trialPlaysLeft, setCurrentGame } = useGameContext();
  const [prediction, setPrediction] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [isTrial, setIsTrial] = useState(false);
  const coinRef = useRef<HTMLDivElement>(null);

  // Set current game on mount
  useEffect(() => {
    setCurrentGame("coinflip");
    
    return () => {
      if (coinRef.current) {
        coinRef.current.classList.remove("animate-coin-flip");
      }
    };
  }, [setCurrentGame]);

  const handleBet = async (useTrial: boolean = false) => {
    setIsFlipping(true);
    setIsTrial(useTrial);
    
    // Start animation
    if (coinRef.current) {
      coinRef.current.classList.add("animate-coin-flip");
    }
    
    // Determine random result for visual purposes
    const randomResult: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
    
    // Place the actual bet
    const isWin = await placeBet("coinflip", prediction, useTrial);
    
    // Show the result after animation
    setTimeout(() => {
      setResult(randomResult);
      setIsFlipping(false);
      
      if (coinRef.current) {
        coinRef.current.classList.remove("animate-coin-flip");
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Coinflip</h1>
      <p className="text-center text-gray-400">
        Choose heads or tails and win 1.8x your bet if you're right!
      </p>

      <div className="flex justify-center my-12">
        <div 
          ref={coinRef} 
          className="realistic-coin"
        >
          <div className="coin-front">
            <span>H</span>
          </div>
          <div className="coin-back">
            <span>T</span>
          </div>
          <div className="coin-edge"></div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <Button
          onClick={() => setPrediction("heads")}
          className={`w-32 h-12 ${
            prediction === "heads" 
              ? "bg-app-purple text-white shadow-neon" 
              : "bg-gray-800 text-gray-300"
          }`}
          disabled={isLoading || isFlipping}
        >
          Heads
        </Button>
        <Button
          onClick={() => setPrediction("tails")}
          className={`w-32 h-12 ${
            prediction === "tails" 
              ? "bg-app-pink text-white shadow-neon-pink" 
              : "bg-gray-800 text-gray-300"
          }`}
          disabled={isLoading || isFlipping}
        >
          Tails
        </Button>
      </div>

      {/* Trial mode button */}
      {trialPlaysLeft > 0 && (
        <div className="flex justify-center mb-4">
          <Button 
            onClick={() => handleBet(true)}
            variant="outline"
            className="w-full max-w-xs bg-gray-800/50 border border-app-purple/30 text-white hover:bg-app-purple/20"
            disabled={isLoading || isFlipping}
          >
            <Coins className="mr-2 h-4 w-4" />
            Try for Free ({trialPlaysLeft} left)
          </Button>
        </div>
      )}

      <BetControls onBet={() => handleBet(false)} disabled={isFlipping} />
    </div>
  );
};

export default Coinflip;
