
import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "@/context/GameContext";
import BetControls from "@/components/BetControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins } from "lucide-react";

const Crash: React.FC = () => {
  const { placeBet, isLoading, trialPlaysLeft, setCurrentGame } = useGameContext();
  const [targetMultiplier, setTargetMultiplier] = useState(1.5);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [isCrashing, setIsCrashing] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [canCashOut, setCanCashOut] = useState(false);
  const animationRef = useRef<number | null>(null);
  const crashPoint = useRef(2);
  const startTime = useRef<number>(0);
  
  // Set current game on mount
  useEffect(() => {
    setCurrentGame("crash");
    return () => {
      // This is needed to avoid memory leaks
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [setCurrentGame]);
  
  // Handle starting a new game
  const handleStartGame = async () => {
    // Reset state
    setCurrentMultiplier(1);
    setHasCrashed(false);
    setIsCrashing(false);
    setIsRunning(true);
    setCanCashOut(true);
    
    // Generate a crash point between 1 and 10
    crashPoint.current = 1 + Math.random() * 9;
    startTime.current = Date.now();
    
    // Start the animation
    animationRef.current = requestAnimationFrame(updateMultiplier);
  };

  // Update the multiplier based on time
  const updateMultiplier = () => {
    const elapsedTime = (Date.now() - startTime.current) / 1000; // in seconds
    const newMultiplier = Math.pow(Math.E, 0.05 * elapsedTime);
    setCurrentMultiplier(newMultiplier);
    
    // Check if crashed
    if (newMultiplier >= crashPoint.current) {
      setIsCrashing(true);
      setHasCrashed(true);
      setCanCashOut(false);
      setIsRunning(false);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    animationRef.current = requestAnimationFrame(updateMultiplier);
  };

  // Handle placing a bet - in Crash this starts the game
  const handleBet = async (useTrial: boolean = false) => {
    // Place bet with target multiplier
    const betResult = await placeBet("crash", targetMultiplier, useTrial);
    
    // Start the game animation
    handleStartGame();
  };

  // Handle manual cash out
  const handleCashOut = () => {
    if (!canCashOut || !isRunning) return;
    
    setCanCashOut(false);
    setIsRunning(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // If the player cashed out before the crash point, they win
    const didWin = currentMultiplier < crashPoint.current;
    
    if (didWin) {
      // This is just UI feedback, the actual win calculation is in the context
      console.log(`Cashed out at ${currentMultiplier.toFixed(2)}x`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Crash Game</h1>
      <p className="text-center text-gray-400">
        Set your target multiplier and win if the game doesn't crash before it!
      </p>

      <div className="glass-card p-6 flex flex-col items-center">
        <div className={`text-6xl font-bold mb-8 ${
          isCrashing ? "text-red-500" : 
          currentMultiplier > 1.5 ? "text-green-500" : "text-white"
        }`}>
          {hasCrashed ? 'CRASHED' : currentMultiplier.toFixed(2) + 'x'}
        </div>
        
        <div className="h-32 w-full bg-black/30 rounded-xl mb-6 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
            {/* Line graph visualization */}
            <div 
              className={`h-4 bg-gradient-to-r from-app-purple to-app-pink rounded-full transition-all duration-100 ${isCrashing ? "bg-red-500" : ""}`}
              style={{ 
                width: `${Math.min((currentMultiplier / 10) * 100, 100)}%`,
                height: `${Math.min((currentMultiplier / 5) * 100, 80)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="mb-4">
          <label htmlFor="target-multiplier" className="block text-sm text-gray-400 mb-1">
            Target Multiplier
          </label>
          <Input
            id="target-multiplier"
            type="number"
            value={targetMultiplier}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value >= 1) {
                setTargetMultiplier(value);
              }
            }}
            disabled={isRunning}
            className="bg-black/30 border-app-purple/30 focus:border-app-purple"
            step="0.1"
            min="1.1"
          />
        </div>
        
        {isRunning ? (
          <Button 
            onClick={handleCashOut}
            disabled={!canCashOut}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Cash Out Now ({currentMultiplier.toFixed(2)}x)
          </Button>
        ) : (
          <>
            {/* Trial mode button */}
            {trialPlaysLeft > 0 && (
              <div className="flex justify-center mb-4">
                <Button 
                  onClick={() => handleBet(true)}
                  variant="outline"
                  className="w-full max-w-xs bg-gray-800/50 border border-app-purple/30 text-white hover:bg-app-purple/20"
                  disabled={isLoading || isRunning}
                >
                  <Coins className="mr-2 h-4 w-4" />
                  Try for Free ({trialPlaysLeft} left)
                </Button>
              </div>
            )}
            <BetControls onBet={() => handleBet(false)} disabled={isRunning} />
          </>
        )}
      </div>
    </div>
  );
};

export default Crash;
