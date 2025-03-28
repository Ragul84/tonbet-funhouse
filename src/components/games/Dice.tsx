
import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "@/context/GameContext";
import BetControls from "@/components/BetControls";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const Dice: React.FC = () => {
  const { placeBet, isLoading, trialPlaysLeft } = useGameContext();
  const [prediction, setPrediction] = useState<"low" | "high">("high");
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const diceContainerRef = useRef<HTMLDivElement>(null);

  const handleRoll = async (useTrial: boolean = false) => {
    setIsRolling(true);
    setResult(null);
    
    // Animate dice
    if (diceContainerRef.current) {
      diceContainerRef.current.classList.add("rolling");
    }
    
    // Place bet
    const isWin = await placeBet("dice", prediction, useTrial);
    
    // Generate random result for visual
    const diceResult = Math.floor(Math.random() * 6) + 1;
    
    // Show result after animation completes
    setTimeout(() => {
      setResult(diceResult);
      setIsRolling(false);
      
      if (diceContainerRef.current) {
        diceContainerRef.current.classList.remove("rolling");
      }
    }, 2000);
  };

  // Render dots based on dice value
  const renderDots = (value: number | null) => {
    if (value === null) return null;
    
    const dots = [];
    
    if (value === 1 || value === 3 || value === 5) {
      dots.push(<div key="center" className="dice-dot absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>);
    }
    
    if (value >= 2) {
      dots.push(<div key="top-left" className="dice-dot absolute top-1/4 left-1/4"></div>);
      dots.push(<div key="bottom-right" className="dice-dot absolute bottom-1/4 right-1/4"></div>);
    }
    
    if (value >= 4) {
      dots.push(<div key="top-right" className="dice-dot absolute top-1/4 right-1/4"></div>);
      dots.push(<div key="bottom-left" className="dice-dot absolute bottom-1/4 left-1/4"></div>);
    }
    
    if (value === 6) {
      dots.push(<div key="middle-left" className="dice-dot absolute top-1/2 left-1/4 transform -translate-y-1/2"></div>);
      dots.push(<div key="middle-right" className="dice-dot absolute top-1/2 right-1/4 transform -translate-y-1/2"></div>);
    }
    
    return dots;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Dice</h1>
      <p className="text-center text-gray-400">
        Predict if the dice will roll high (4-6) or low (1-3) and win 1.8x your bet!
      </p>

      <div className="flex justify-center py-8">
        <div ref={diceContainerRef} className="dice-container">
          <div className="dice w-full h-full flex items-center justify-center">
            {renderDots(result)}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <Button
          onClick={() => setPrediction("low")}
          className={`w-32 h-12 ${
            prediction === "low" 
              ? "bg-app-purple text-white shadow-neon" 
              : "bg-gray-800 text-gray-300"
          }`}
          disabled={isLoading || isRolling}
        >
          Low (1-3)
        </Button>
        <Button
          onClick={() => setPrediction("high")}
          className={`w-32 h-12 ${
            prediction === "high" 
              ? "bg-app-pink text-white shadow-neon-pink" 
              : "bg-gray-800 text-gray-300"
          }`}
          disabled={isLoading || isRolling}
        >
          High (4-6)
        </Button>
      </div>

      {/* Trial mode button */}
      {trialPlaysLeft > 0 && (
        <div className="flex justify-center mb-4">
          <Button 
            onClick={() => handleRoll(true)}
            variant="outline"
            className="w-full max-w-xs bg-gray-800/50 border border-app-purple/30 text-white hover:bg-app-purple/20"
            disabled={isLoading || isRolling}
          >
            <Coins className="mr-2 h-4 w-4" />
            Try for Free ({trialPlaysLeft} left)
          </Button>
        </div>
      )}

      <BetControls onBet={() => handleRoll(false)} disabled={isRolling} />
    </div>
  );
};

export default Dice;
