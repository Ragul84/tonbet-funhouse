
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import BetHistory from "@/components/BetHistory";
import { CircleDollarSign, Trophy } from "lucide-react";
import { useGameContext } from "@/context/GameContext";
import { useTelegramContext } from "@/context/TelegramContext";

const games = [
  {
    id: "coinflip",
    name: "Coinflip",
    description: "50/50 chance. Heads or Tails?",
    path: "/coinflip",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "dice",
    name: "Dice Roll",
    description: "Bet on high or low numbers",
    path: "/dice",
    color: "from-app-purple to-app-pink",
  },
  {
    id: "crash",
    name: "Crash",
    description: "Cash out before it crashes",
    path: "/crash",
    color: "from-green-500 to-emerald-700",
  },
];

const Index = () => {
  const { currentUserStats } = useGameContext();
  const { user } = useTelegramContext();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-white">TON Bet</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Play exciting games, bet TON, and win up to 1.8x your bet!
          </p>
          {user && (
            <p className="text-sm text-gray-400">
              Welcome, @{user.username}!
            </p>
          )}
        </div>

        {currentUserStats && (
          <div className="glass-card p-4 max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Your Stats</h3>
                <p className="text-sm text-gray-400">Total bets: {currentUserStats.totalBets}</p>
                <p className="text-sm text-gray-400">Wins: {currentUserStats.totalWins}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Net profit:</p>
                <p className={`font-bold ${currentUserStats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentUserStats.netProfit.toFixed(2)} TON
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card p-6 text-center bg-gradient-radial">
          <div className="inline-block bg-black/40 p-3 rounded-full mb-4">
            <CircleDollarSign size={36} className="text-ton" />
          </div>
          <h2 className="text-xl font-bold mb-2">Stake TON to Win</h2>
          <p className="text-gray-400">
            Play games with your TON coins and win instant rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link 
              key={game.id} 
              to={game.path} 
              className="game-card relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <h3 className="text-xl font-bold mb-2">{game.name}</h3>
              <p className="text-gray-400 mb-4">{game.description}</p>
              <div className="text-app-purple">Play Now →</div>
            </Link>
          ))}
        </div>

        <Link 
          to="/leaderboard" 
          className="game-card relative overflow-hidden group flex items-center justify-between"
        >
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Leaderboard
            </h3>
            <p className="text-gray-400">See who's winning the most</p>
          </div>
          <div className="text-app-purple">View →</div>
        </Link>

        <BetHistory />
      </div>
    </Layout>
  );
};

export default Index;
