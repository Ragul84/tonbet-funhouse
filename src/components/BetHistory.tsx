
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { format } from "date-fns";

const BetHistory: React.FC = () => {
  const { bets, currentGame } = useGameContext();
  
  // Filter bets by the current game
  const filteredBets = currentGame 
    ? bets.filter(bet => bet.game === currentGame)
    : bets;

  if (filteredBets.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-medium mb-4">
        {currentGame ? `${currentGame.charAt(0).toUpperCase() + currentGame.slice(1)} History` : "Bet History"}
      </h3>
      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        {filteredBets.map((bet) => (
          <div 
            key={bet.id} 
            className={`flex justify-between items-center p-3 rounded-lg ${
              bet.outcome === "win" ? "bg-green-900/20" : "bg-red-900/20"
            }`}
          >
            <div>
              <div className="font-medium capitalize">
                {bet.game} {bet.isTrial && "(Trial)"}
              </div>
              <div className="text-xs text-gray-400">
                {format(new Date(bet.timestamp), "HH:mm:ss")}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${
                bet.outcome === "win" ? "text-green-500" : "text-red-500"
              }`}>
                {bet.outcome === "win" ? "+" : "-"}{bet.outcome === "win" ? bet.payout.toFixed(2) : bet.amount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                Bet: {bet.amount.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetHistory;
