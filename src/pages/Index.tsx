
import React from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { useTelegramContext } from "@/context/TelegramContext";
import { useGameContext } from "@/context/GameContext";
import { Link } from "react-router-dom";
import { 
  Coins, 
  Dice5, 
  TrendingUp, 
  Trophy, 
  Wallet 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BetHistory from "@/components/BetHistory";
import RevenueInfo from "@/components/RevenueInfo";

const GameCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  gradient = "from-app-purple to-app-pink"
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  to: string;
  gradient?: string;
}) => (
  <Link to={to} className="block">
    <Card className="relative p-6 h-full bg-gray-900/50 border-gray-800 overflow-hidden hover:border-app-purple/50 transition-all duration-300">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}></div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-r from-transparent to-app-purple/10 z-0"></div>
      
      <div className="flex items-center mb-4">
        <div className="p-2 bg-black/30 rounded-lg mr-4">
          <Icon className="h-8 w-8 text-app-purple" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      <p className="text-gray-400">{description}</p>
    </Card>
  </Link>
);

const Index: React.FC = () => {
  const { wallet, connectWallet } = useTelegramContext();
  
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-app-purple/20 filter blur-2xl"></div>
          <div className="absolute -bottom-32 -left-20 w-64 h-64 rounded-full bg-app-pink/10 filter blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-app-purple to-app-pink bg-clip-text text-transparent">
                TON Casino Games
              </span>
            </h1>
            <p className="text-center text-gray-400 mb-6">
              Play, win and earn TON with our fun crypto games!
            </p>
            
            {!wallet.connected && (
              <div className="flex justify-center">
                <Button 
                  onClick={connectWallet}
                  className="bg-app-purple hover:bg-app-purple/90 py-6 px-8 text-lg"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <GameCard 
            title="Coinflip" 
            description="Predict heads or tails. Win 1.8x your stake!"
            icon={Coins}
            to="/coinflip"
          />
          <GameCard 
            title="Dice" 
            description="Predict high or low rolls. Simple and fun!"
            icon={Dice5}
            to="/dice"
            gradient="from-blue-600 to-app-purple"
          />
          <GameCard 
            title="Crash" 
            description="Cash out before the crash for big wins!"
            icon={TrendingUp}
            to="/crash"
            gradient="from-amber-500 to-red-500"
          />
          <GameCard 
            title="Leaderboard" 
            description="See who's winning big on our platform!"
            icon={Trophy}
            to="/leaderboard"
            gradient="from-green-500 to-emerald-700"
          />
        </div>
        
        {/* Revenue Information */}
        <RevenueInfo />
        
        {/* Recent Bets */}
        <BetHistory gameType="all" />
      </div>
    </Layout>
  );
};

export default Index;
