
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import BetHistory from "@/components/BetHistory";
import { CircleDollarSign, Trophy, Users, BarChart3, Sparkles, ArrowRight, Bolt, Flame } from "lucide-react";
import { useGameContext } from "@/context/GameContext";
import { useTelegramContext } from "@/context/TelegramContext";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

const games = [
  {
    id: "coinflip",
    name: "Coinflip",
    description: "50/50 chance. Heads or Tails?",
    path: "/coinflip",
    color: "from-yellow-400 to-orange-500",
    icon: <CircleDollarSign className="h-8 w-8" />,
    highlight: "2x Multiplier"
  },
  {
    id: "dice",
    name: "Dice Roll",
    description: "Bet on high or low numbers",
    path: "/dice",
    color: "from-app-purple to-app-pink",
    icon: <Bolt className="h-8 w-8" />,
    highlight: "6x Multiplier"
  },
  {
    id: "crash",
    name: "Crash",
    description: "Cash out before it crashes",
    path: "/crash",
    color: "from-green-500 to-emerald-700",
    icon: <Flame className="h-8 w-8" />,
    highlight: "100x Potential"
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
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mt-4">
          <div className="relative inline-block">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-md">
              TON Casino
            </h1>
            <div className="absolute -top-4 -right-10">
              <Badge className="bg-gradient-to-r from-app-purple to-app-pink border-none px-2 py-1 text-xs font-bold shadow-md">
                PRO
              </Badge>
            </div>
          </div>
          
          <p className="text-gray-300 max-w-lg mx-auto text-lg">
            Experience the thrill of decentralized gaming with TON Casino. Play, bet, and win with transparency and instant payouts.
          </p>
          
          {user && (
            <div className="neomorphic-card py-2 px-4 inline-block rounded-full">
              <p className="text-sm text-white">
                Welcome, <span className="text-app-purple font-semibold">@{user.username}!</span>
              </p>
            </div>
          )}
        </div>

        {/* Global Stats with enhanced neomorphic design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neomorphic-stat p-6 rounded-xl flex items-center transition-all duration-300 hover:shadow-neon hover:scale-105">
            <div className="rounded-full bg-app-purple/20 p-3 mr-4">
              <Users className="h-7 w-7 text-app-purple" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-white font-bold text-2xl">{globalStats.activeUsers}</p>
            </div>
          </div>
          
          <div className="neomorphic-stat p-6 rounded-xl flex items-center transition-all duration-300 hover:shadow-neon-pink hover:scale-105">
            <div className="rounded-full bg-app-pink/20 p-3 mr-4">
              <BarChart3 className="h-7 w-7 text-app-pink" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bets Placed</p>
              <p className="text-white font-bold text-2xl">{globalStats.betsPlaced}</p>
            </div>
          </div>
          
          <div className="neomorphic-stat p-6 rounded-xl flex items-center transition-all duration-300 hover:shadow-neon hover:scale-105">
            <div className="rounded-full bg-ton/20 p-3 mr-4">
              <CircleDollarSign className="h-7 w-7 text-ton" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">TON Paid Out</p>
              <p className="text-white font-bold text-2xl">{globalStats.totalPayout}</p>
            </div>
          </div>
        </div>

        {/* User stats card with enhanced design */}
        {currentUserStats && (
          <div className="glass-card p-6 max-w-md mx-auto backdrop-blur-xl bg-app-dark/40 border border-white/10 rounded-xl overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-app-purple/20 filter blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-app-pink/20 filter blur-3xl"></div>
            
            <h3 className="text-xl font-medium mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Your Stats</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="neomorphic-card p-4 rounded-xl">
                <p className="text-sm text-gray-400">Total Bets</p>
                <p className="text-lg font-bold text-white">{currentUserStats.totalBets}</p>
              </div>
              
              <div className="neomorphic-card p-4 rounded-xl">
                <p className="text-sm text-gray-400">Wins</p>
                <p className="text-lg font-bold text-white">{currentUserStats.totalWins}</p>
              </div>
              
              <div className="neomorphic-card p-4 rounded-xl col-span-2">
                <p className="text-sm text-gray-400">Net Profit</p>
                <p className={`text-lg font-bold ${currentUserStats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentUserStats.netProfit.toFixed(2)} TON
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured promotion */}
        <div className="neomorphic-card p-8 text-center bg-gradient-radial overflow-hidden relative">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm -z-10"></div>
          <div className="absolute -top-20 right-20 w-40 h-40 rounded-full bg-yellow-500/20 filter blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-20 left-20 w-40 h-40 rounded-full bg-app-purple/20 filter blur-3xl animate-pulse-glow"></div>
          
          <div className="inline-block bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-full mb-6 shadow-lg">
            <Sparkles size={42} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Stake TON to Win Big
          </h2>
          
          <p className="text-gray-300 text-lg max-w-lg mx-auto mb-6">
            Play games with your TON coins and win instant rewards with multipliers up to 100x!
          </p>
          
          <Link 
            to="/crash" 
            className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105"
          >
            Play Now
          </Link>
        </div>

        {/* Games grid with enhanced hover effects */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Popular Games
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game) => (
              <Link 
                key={game.id} 
                to={game.path} 
                className="relative overflow-hidden group transition-all duration-500 hover:scale-105"
              >
                <div className="neomorphic-card p-6 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg bg-${game.color.split('-')[1]}/10`}>
                      {game.icon}
                    </div>
                    <Badge className="bg-white/10 text-xs font-medium">{game.highlight}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-app-purple transition-colors">{game.name}</h3>
                  <p className="text-gray-400 mb-4">{game.description}</p>
                  
                  <div className="flex items-center text-app-purple group-hover:translate-x-2 transition-transform">
                    <span>Play Now</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Leaderboard link */}
        <div className="neomorphic-card p-6 overflow-hidden group transition-transform duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Trophy className="mr-3 h-6 w-6 text-yellow-500" />
                Leaderboard
              </h3>
              <p className="text-gray-400">See who's winning the most and climb to the top</p>
            </div>
            
            <Link 
              to="/leaderboard" 
              className="flex items-center bg-app-purple/20 px-4 py-2 rounded-full text-app-purple group-hover:bg-app-purple group-hover:text-white transition-colors"
            >
              <span>View</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Recent bets with enhanced styling */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Recent Bets
          </h2>
          <div className="neomorphic-card p-6">
            <BetHistory />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
