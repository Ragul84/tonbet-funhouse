
import React, { useState, useRef, useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import BetControls from "@/components/BetControls";
import { Button } from "@/components/ui/button";

const Dice: React.FC = () => {
  const { placeBet, isLoading } = useGameContext();
  const [prediction, setPrediction] = useState<"high" | "low">("high");
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const diceRef = useRef<HTMLDivElement>(null);

  const handleBet = async () => {
    setIsRolling(true);
    
    // Start animation
    if (diceRef.current) {
      diceRef.current.classList.add("animate-roll");
    }
    
    // Determine random result for visual purposes
    const randomResult = Math.floor(Math.random() * 6) + 1;
    
    // Place the actual bet
    const isWin = await placeBet("dice", prediction);
    
    // Show the result after animation
    setTimeout(() => {
      setDiceValue(randomResult);
      setIsRolling(false);
      
      if (diceRef.current) {
        diceRef.current.classList.remove("animate-roll");
      }
    }, 1500);
  };

  // Render dice dots based on value
  const renderDiceDots = () => {
    if (diceValue === null) return null;
    
    const dots = [];
    
    switch (diceValue) {
      case 1:
        dots.push(<div key="center" className="dice-dot top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />);
        break;
      case 2:
        dots.push(<div key="tl" className="dice-dot top-2 left-2" />);
        dots.push(<div key="br" className="dice-dot bottom-2 right-2" />);
        break;
      case 3:
        dots.push(<div key="tl" className="dice-dot top-2 left-2" />);
        dots.push(<div key="center" className="dice-dot top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />);
        dots.push(<div key="br" className="dice-dot bottom-2 right-2" />);
        break;
      case 4:
        dots.push(<div key="tl" className="dice-dot top-2 left-2" />);
        dots.push(<div key="tr" className="dice-dot top-2 right-2" />);
        dots.push(<div key="bl" className="dice-dot bottom-2 left-2" />);
        dots.push(<div key="br" className="dice-dot bottom-2 right-2" />);
        break;
      case 5:
        dots.push(<div key="tl" className="dice-dot top-2 left-2" />);
        dots.push(<div key="tr" className="dice-dot top-2 right-2" />);
        dots.push(<div key="center" className="dice-dot top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />);
        dots.push(<div key="bl" className="dice-dot bottom-2 left-2" />);
        dots.push(<div key="br" className="dice-dot bottom-2 right-2" />);
        break;
      case 6:
        dots.push(<div key="tl" className="dice-dot top-2 left-2" />);
        dots.push(<div key="tm" className="dice-dot top-2 left-1/2 transform -translate-x-1/2" />);
        dots.push(<div key="tr" className="dice-dot top-2 right-2" />);
        dots.push(<div key="bl" className="dice-dot bottom-2 left-2" />);
        dots.push(<div key="bm" className="dice-dot bottom-2 left-1/2 transform -translate-x-1/2" />);
        dots.push(<div key="br" className="dice-dot bottom-2 right-2" />);
        break;
    }
    
    return dots;
  };

  // Reset animation when done
  useEffect(() => {
    return () => {
      if (diceRef.current) {
        diceRef.current.classList.remove("animate-roll");
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Dice Roll</h1>
      <p className="text-center text-gray-400">
        Bet on high (4-6) or low (1-3) and win 1.8x your bet if you're right!
      </p>

      <div className="flex justify-center my-12">
        <div 
          ref={diceRef} 
          className="dice w-24 h-24"
        >
          {!isRolling && renderDiceDots()}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <Button
          onClick={() => setPrediction("high")}
          className={`w-32 h-12 ${
            prediction === "high" 
              ? "bg-app-purple text-white shadow-neon" 
              : "bg-gray-800 text-gray-300"
          }`}
          disabled={isLoading || isRolling}
        >
          High (4-6)
        </Button>
        <Button
          onClick={() => setPrediction("low")}
          className={`w-32 h-12 ${
            prediction === "low" 
              ? "bg-app-pink text-white shadow-neon-pink" 
              : "bg-gray-800 text-gray-300"
          }`}
          disabled={isLoading || isRolling}
        >
          Low (1-3)
        </Button>
      </div>

      <BetControls onBet={handleBet} disabled={isRolling} />
    </div>
  );
};

export default Dice;
