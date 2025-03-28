
import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "@/context/GameContext";
import BetControls from "@/components/BetControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, TimerIcon, ArrowUp, TrendingUp, TrendingDown } from "lucide-react";

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
  const graphRef = useRef<HTMLDivElement>(null);
  const curvePointsRef = useRef<{x: number, y: number}[]>([]);
  
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
    curvePointsRef.current = [];
    
    // Generate a crash point between 1 and 10
    crashPoint.current = 1 + Math.random() * 9;
    startTime.current = Date.now();
    
    // Start the animation
    animationRef.current = requestAnimationFrame(updateMultiplier);
  };

  // Update the multiplier based on time
  const updateMultiplier = () => {
    const elapsedTime = (Date.now() - startTime.current) / 1000; // in seconds
    // Use a smoother growth function for more natural curve
    const newMultiplier = Math.pow(Math.E, 0.06 * elapsedTime);
    setCurrentMultiplier(newMultiplier);
    
    // Update the animation graph
    if (graphRef.current) {
      updateCrashPath(newMultiplier);
    }
    
    // Check if crashed
    if (newMultiplier >= crashPoint.current) {
      setIsCrashing(true);
      setHasCrashed(true);
      setCanCashOut(false);
      setIsRunning(false);
      
      // Flash animation for crash
      if (graphRef.current) {
        graphRef.current.classList.add("crash-flash");
        
        // Add falling animation
        const crashAnimation = () => {
          const points = [...curvePointsRef.current];
          
          // Simulate falling curve by adding points that go down
          for (let i = 0; i < 15; i++) {
            const lastPoint = points[points.length - 1];
            const newY = Math.max(0, lastPoint.y + (i * 3)); // Move down
            const newX = lastPoint.x + (i * 0.5); // Move slightly right
            points.push({ x: newX, y: newY });
          }
          
          drawCrashPath(points);
        };
        
        // Run crash animation after a small delay
        setTimeout(crashAnimation, 100);
        
        setTimeout(() => {
          if (graphRef.current) {
            graphRef.current.classList.remove("crash-flash");
          }
        }, 1000);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    animationRef.current = requestAnimationFrame(updateMultiplier);
  };

  // Generate points for the crash curve
  const updateCrashPath = (multiplier: number) => {
    // Get the current width of the graph to scale properly
    const graphWidth = graphRef.current?.clientWidth || 100;
    const graphHeight = graphRef.current?.clientHeight || 100;
    
    // Calculate a new point based on current multiplier
    const x = Math.min(multiplier, 10) * (graphWidth / 10); // Scale x by graph width
    const y = graphHeight - (Math.log(multiplier) / Math.log(10)) * (graphHeight * 0.8); // Logarithmic scale for y
    
    // Add the new point to our curve
    curvePointsRef.current.push({ x, y });
    
    // Draw the updated path
    drawCrashPath(curvePointsRef.current);
  };
  
  // Draw the SVG path for the crash curve
  const drawCrashPath = (points: {x: number, y: number}[]) => {
    const svgPath = document.getElementById("crash-path");
    if (!svgPath || points.length === 0) return;
    
    let pathData = `M 0,${points[0].y} `;
    
    // Use a smoother curve with bezier
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        pathData += `L ${points[i].x},${points[i].y} `;
      } else {
        const prevPoint = points[i-1];
        const currPoint = points[i];
        
        // Create smoother curve with quadratic bezier
        if (i < points.length - 1) {
          const nextPoint = points[i+1];
          const controlX = (currPoint.x + nextPoint.x) / 2;
          const controlY = currPoint.y;
          pathData += `Q ${currPoint.x},${currPoint.y} ${controlX},${controlY} `;
        } else {
          pathData += `L ${currPoint.x},${currPoint.y} `;
        }
      }
    }
    
    svgPath.setAttribute("d", pathData);
    
    // Update rocket position (if you want to add a rocket icon on the path)
    const rocketIcon = document.getElementById("rocket-icon");
    if (rocketIcon && points.length > 0) {
      const lastPoint = points[points.length - 1];
      rocketIcon.setAttribute("transform", `translate(${lastPoint.x - 12}, ${lastPoint.y - 12})`);
    }
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

      <div className="neomorphic-card p-6 flex flex-col items-center relative overflow-hidden">
        <div className={`text-6xl font-bold mb-4 transition-all duration-300 ${
          isCrashing ? "text-red-500 animate-pulse scale-110" : 
          currentMultiplier > 1.5 ? "text-green-500" : "text-white"
        }`}>
          {hasCrashed ? 'CRASHED' : currentMultiplier.toFixed(2) + 'x'}
        </div>
        
        {!isRunning && !hasCrashed && (
          <div className="text-lg text-gray-400 mb-8 flex items-center">
            <TimerIcon className="mr-2 h-5 w-5 text-app-purple" />
            Waiting for next round...
          </div>
        )}
        
        {isRunning && (
          <div className="text-lg text-green-400 mb-8 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 animate-pulse" />
            Rising...
          </div>
        )}
        
        {hasCrashed && (
          <div className="text-lg text-red-400 mb-8 flex items-center">
            <TrendingDown className="mr-2 h-5 w-5 animate-pulse" />
            Crashed!
          </div>
        )}
        
        <div 
          ref={graphRef}
          className="h-48 w-full bg-black/30 rounded-xl mb-6 relative overflow-hidden border border-gray-700/50"
        >
          {/* SVG graph for crash animation */}
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="crash-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#D946EF" />
              </linearGradient>
              <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              id="crash-path"
              d="M 0,100 L 0,100"
              fill="none"
              stroke={isCrashing ? "url(#crash-gradient)" : "url(#crash-gradient)"}
              strokeWidth="3"
              strokeLinecap="round"
              filter={currentMultiplier > 2 ? "url(#glow)" : ""}
              className={isCrashing ? "animate-pulse" : ""}
            />
            {/* Rocket icon that follows the path */}
            <g id="rocket-icon">
              <polygon 
                points="0,0 4,10 0,8 -4,10" 
                fill={currentMultiplier > 2 ? "#D946EF" : "#8B5CF6"} 
                transform="rotate(45)"
                className={isRunning ? "animate-pulse" : ""}
              />
            </g>
          </svg>
          
          {/* Grid lines for better visualization */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`vline-${i}`} className="h-full w-px bg-gray-700/30" style={{ left: `${(i + 1) * 20}%` }} />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`hline-${i}`} className="w-full h-px bg-gray-700/30" style={{ top: `${(i + 1) * 25}%` }} />
            ))}
          </div>
          
          {/* Multiplier markers */}
          <div className="absolute inset-0 flex justify-between px-4 text-xs text-gray-500">
            <div className="h-full flex flex-col justify-between py-2">
              <span>10x</span>
              <span>5x</span>
              <span>2x</span>
              <span>1x</span>
            </div>
          </div>
        </div>
        
        {hasCrashed && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm animate-pulse">
            <span className="text-4xl font-bold text-red-500 transform rotate-12 shadow-xl">
              CRASHED AT {crashPoint.current.toFixed(2)}x
            </span>
          </div>
        )}
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
            className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 text-lg font-semibold"
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
