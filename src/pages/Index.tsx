
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import BetHistory from "@/components/BetHistory";
import { CircleDollarSign, Trophy, Users, BarChart3, Sparkles } from "lucide-react";
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

// Global statistics
const globalStats = {
  activeUsers: "60K+",
  betsPlaced: "1.1M+",
  totalPayout: "890K+",
};

const Index = () => {
  const { currentUserStats, setCurrentGame } = useGameContext();
  const { user } = useTelegramContext();

  // Reset current game on home page
  React.useEffect(() => {
    setCurrentGame(null);
  }, [setCurrentGame]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            TON Casino
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Play exciting games, bet TON, and win up to 1.8x your bet!
          </p>
          {user && (
            <p className="text-sm text-gray-400">
              Welcome, <span className="text-app-purple font-semibold">@{user.username}!</span>
            </p>
          )}
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="neomorphic-stat p-4 rounded-xl flex items-center">
            <div className="rounded-full bg-app-purple/20 p-2 mr-3">
              <Users className="h-6 w-6 text-app-purple" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-white font-bold text-xl">{globalStats.activeUsers}</p>
            </div>
          </div>
          
          <div className="neomorphic-stat p-4 rounded-xl flex items-center">
            <div className="rounded-full bg-app-pink/20 p-2 mr-3">
              <BarChart3 className="h-6 w-6 text-app-pink" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bets Placed</p>
              <p className="text-white font-bold text-xl">{globalStats.betsPlaced}</p>
            </div>
          </div>
          
          <div className="neomorphic-stat p-4 rounded-xl flex items-center">
            <div className="rounded-full bg-ton/20 p-2 mr-3">
              <CircleDollarSign className="h-6 w-6 text-ton" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">TON Paid Out</p>
              <p className="text-white font-bold text-xl">{globalStats.totalPayout}</p>
            </div>
          </div>
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
            <Sparkles size={36} className="text-yellow-400" />
          </div>
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">Stake TON to Win</h2>
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
