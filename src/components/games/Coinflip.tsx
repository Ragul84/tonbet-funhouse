
import React, { useState, useRef, useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import BetControls from "@/components/BetControls";
import { Button } from "@/components/ui/button";

const Coinflip: React.FC = () => {
  const { placeBet, isLoading } = useGameContext();
  const [prediction, setPrediction] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const coinRef = useRef<HTMLDivElement>(null);

  const handleBet = async () => {
    setIsFlipping(true);
    
    // Start animation
    if (coinRef.current) {
      coinRef.current.classList.add("animate-flip");
    }
    
    // Determine random result for visual purposes
    const randomResult: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
    
    // Place the actual bet
    const isWin = await placeBet("coinflip", prediction);
    
    // Show the result after animation
    setTimeout(() => {
      setResult(randomResult);
      setIsFlipping(false);
      
      if (coinRef.current) {
        coinRef.current.classList.remove("animate-flip");
      }
    }, 1000);
  };

  // Reset animation when done
  useEffect(() => {
    return () => {
      if (coinRef.current) {
        coinRef.current.classList.remove("animate-flip");
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Coinflip</h1>
      <p className="text-center text-gray-400">
        Choose heads or tails and win 1.8x your bet if you're right!
      </p>

      <div className="flex justify-center my-12">
        <div 
          ref={coinRef} 
          className={`coin ${isFlipping ? "" : ""}`}
        >
          {!isFlipping && (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-yellow-800">
              {result ? (result === "heads" ? "H" : "T") : "?"}
            </div>
          )}
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

      <BetControls onBet={handleBet} disabled={isFlipping} />
    </div>
  );
};

export default Coinflip;
