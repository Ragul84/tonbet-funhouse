
import React, { useState, useRef, useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import BetControls from "@/components/BetControls";
import { Button } from "@/components/ui/button";
import { Coins, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const Dice: React.FC = () => {
  const { placeBet, isLoading, trialPlaysLeft, setCurrentGame } = useGameContext();
  const [prediction, setPrediction] = useState<"low" | "high">("high");
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const diceContainerRef = useRef<HTMLDivElement>(null);

  // Set current game on mount
  useEffect(() => {
    setCurrentGame("dice");
  }, [setCurrentGame]);

  const handleRoll = async (useTrial: boolean = false) => {
    setIsRolling(true);
    setResult(null);
    
    // Animate dice
    if (diceContainerRef.current) {
      diceContainerRef.current.classList.add("rolling");
    }
    
    // Place bet
    const isWin = await placeBet("dice", prediction, useTrial);
    
    // Generate random result for visual that matches prediction outcome
    // High (4-6) for wins with high prediction or losses with low prediction
    // Low (1-3) for wins with low prediction or losses with high prediction
    let diceResult;
    if ((isWin && prediction === "high") || (!isWin && prediction === "low")) {
      // Show high number (4-6)
      diceResult = Math.floor(Math.random() * 3) + 4;
    } else {
      // Show low number (1-3)
      diceResult = Math.floor(Math.random() * 3) + 1;
    }
    
    // Show result after animation completes
    setTimeout(() => {
      setResult(diceResult);
      setIsRolling(false);
      
      if (diceContainerRef.current) {
        diceContainerRef.current.classList.remove("rolling");
      }
    }, 2000);
  };

  // Render dice face based on value
  const renderDiceFace = (value: number | null) => {
    if (value === null) {
      return <Dice1 className="w-12 h-12 text-app-purple/90" />;
    }
    
    switch(value) {
      case 1: return <Dice1 className="w-12 h-12 text-app-purple" />;
      case 2: return <Dice2 className="w-12 h-12 text-app-purple" />;
      case 3: return <Dice3 className="w-12 h-12 text-app-purple" />;
      case 4: return <Dice4 className="w-12 h-12 text-app-purple" />;
      case 5: return <Dice5 className="w-12 h-12 text-app-purple" />;
      case 6: return <Dice6 className="w-12 h-12 text-app-purple" />;
      default: return <Dice1 className="w-12 h-12 text-app-purple/90" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Dice</h1>
      <p className="text-center text-gray-400">
        Predict if the dice will roll high (4-6) or low (1-3) and win 1.8x your bet!
      </p>

      <div className="flex justify-center py-8">
        <div ref={diceContainerRef} className="dice-container">
          <div className="dice neo-dice w-full h-full flex items-center justify-center">
            {renderDiceFace(result)}
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
