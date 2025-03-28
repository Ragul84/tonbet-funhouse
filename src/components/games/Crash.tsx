import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "@/context/GameContext";
import BetControls from "@/components/BetControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, TimerIcon, ArrowUp, TrendingUp, TrendingDown, Rocket } from "lucide-react";
import confetti from "canvas-confetti";

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
  const rocketRef = useRef<SVGGElement | null>(null);
  
  useEffect(() => {
    setCurrentGame("crash");
    
    setTimeout(() => {
      initializeRocketPosition();
    }, 100);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [setCurrentGame]);
  
  const initializeRocketPosition = () => {
    const rocketIcon = document.getElementById("rocket-icon");
    const graphWidth = graphRef.current?.clientWidth || 300;
    const graphHeight = graphRef.current?.clientHeight || 200;
    
    if (rocketIcon) {
      const initialX = 50;
      const initialY = graphHeight - 30;
      
      rocketIcon.setAttribute("transform", `translate(${initialX}, ${initialY}) rotate(-15)`);
      rocketIcon.setAttribute("opacity", "1");
    }
  };
  
  const generateCrashPoint = (): number => {
    const randomValue = Math.random();
    
    if (randomValue < 0.20) {
      return 1.0 + (Math.random() * 0.2);
    } else if (randomValue < 0.70) {
      return 1.2 + (Math.random() * 1.8);
    } else if (randomValue < 0.90) {
      return 3.0 + (Math.random() * 5.0);
    } else if (randomValue < 0.99) {
      return 8.0 + (Math.random() * 12.0);
    } else {
      return 20.0 + (Math.random() * 80.0);
    }
  };
  
  const handleStartGame = async () => {
    setCurrentMultiplier(1);
    setHasCrashed(false);
    setIsCrashing(false);
    setIsRunning(true);
    setCanCashOut(true);
    curvePointsRef.current = [];
    
    crashPoint.current = generateCrashPoint();
    
    console.log("Game started with crash point:", crashPoint.current.toFixed(2) + "x");
    
    startTime.current = Date.now();
    
    animationRef.current = requestAnimationFrame(updateMultiplier);
  };

  const updateMultiplier = () => {
    const elapsedTime = (Date.now() - startTime.current) / 1000;
    
    const growthRate = 0.06 + (Math.random() * 0.02);
    const newMultiplier = Math.pow(Math.E, growthRate * elapsedTime);
    
    setCurrentMultiplier(newMultiplier);
    
    if (graphRef.current) {
      updateCrashPath(newMultiplier);
    }
    
    if (newMultiplier >= crashPoint.current) {
      setIsCrashing(true);
      setHasCrashed(true);
      setCanCashOut(false);
      setIsRunning(false);
      
      if (graphRef.current) {
        graphRef.current.classList.add("crash-flash");
        
        const crashAnimation = () => {
          const points = [...curvePointsRef.current];
          
          for (let i = 0; i < 15; i++) {
            const lastPoint = points[points.length - 1];
            const newY = Math.max(0, lastPoint.y + (i * 3));
            const newX = lastPoint.x + (i * 0.5);
            points.push({ x: newX, y: newY });
          }
          
          drawCrashPath(points);
        };
        
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

  const updateCrashPath = (multiplier: number) => {
    const graphWidth = graphRef.current?.clientWidth || 300;
    const graphHeight = graphRef.current?.clientHeight || 200;
    
    const x = Math.min(multiplier, 10) * (graphWidth / 10);
    const y = graphHeight - (Math.log(multiplier) / Math.log(10)) * (graphHeight * 0.8);
    
    curvePointsRef.current.push({ x, y });
    
    drawCrashPath(curvePointsRef.current);
  };

  const drawCrashPath = (points: {x: number, y: number}[]) => {
    const svgPath = document.getElementById("crash-path");
    if (!svgPath || points.length === 0) return;
    
    let pathData = `M 0,${points[0].y} `;
    
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        pathData += `L ${points[i].x},${points[i].y} `;
      } else {
        const prevPoint = points[i-1];
        const currPoint = points[i];
        
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
    
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      
      const rocketIcon = document.getElementById("rocket-icon");
      if (rocketIcon) {
        rocketIcon.setAttribute("transform", `translate(${lastPoint.x - 10}, ${lastPoint.y - 10})`);
        rocketIcon.setAttribute("opacity", "1");
        
        if (isCrashing) {
          rocketIcon.setAttribute("transform", `translate(${lastPoint.x - 10}, ${lastPoint.y - 10}) rotate(135)`);
        } else {
          const prevPoint = points[points.length - 2];
          const angle = Math.atan2(lastPoint.y - prevPoint.y, lastPoint.x - prevPoint.x) * (180 / Math.PI);
          rocketIcon.setAttribute("transform", `translate(${lastPoint.x - 10}, ${lastPoint.y - 10}) rotate(${angle})`);
        }
      }
    }
  };

  const handleBet = async (useTrial: boolean = false) => {
    const betResult = await placeBet("crash", targetMultiplier, useTrial);
    handleStartGame();
  };

  const handleCashOut = () => {
    if (!canCashOut || !isRunning) return;
    
    setCanCashOut(false);
    setIsRunning(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    const didWin = currentMultiplier < crashPoint.current;
    
    if (didWin) {
      triggerWinConfetti();
      console.log(`Cashed out at ${currentMultiplier.toFixed(2)}x`);
    }
  };

  const triggerWinConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const colors = ['#8B5CF6', '#D946EF', '#F97316', '#10B981', '#F59E0B'];
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const frame = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        particleCount: Math.floor(randomInRange(10, particleCount)),
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0, 0.3), y: randomInRange(0.4, 0.6) },
        colors: colors,
        zIndex: 1000,
        shapes: ['square', 'circle'],
        disableForReducedMotion: true
      });
      
      confetti({
        particleCount: Math.floor(randomInRange(10, particleCount)),
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.7, 1), y: randomInRange(0.4, 0.6) },
        colors: colors,
        zIndex: 1000,
        shapes: ['square', 'circle'],
        disableForReducedMotion: true
      });
      
      requestAnimationFrame(frame);
    };
    
    frame();
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
          <svg width="100%" height="100%" viewBox="0 0 100% 100%" preserveAspectRatio="none">
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
              d="M 0,200 L 0,200"
              fill="none"
              stroke="url(#crash-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow)"
              className={isCrashing ? "animate-pulse" : ""}
            />
            
            <g id="rocket-icon" opacity="1" transform="translate(50, 170)">
              <Rocket 
                size={30} 
                color="#D946EF"
                fill="#8B5CF6" 
                strokeWidth={2}
                className="rocket-glow"
              />
            </g>
          </svg>
          
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`vline-${i}`} className="h-full w-px bg-gray-700/30" style={{ left: `${(i + 1) * 20}%` }} />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`hline-${i}`} className="w-full h-px bg-gray-700/30" style={{ top: `${(i + 1) * 25}%` }} />
            ))}
          </div>
          
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
