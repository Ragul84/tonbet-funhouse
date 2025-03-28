
import React from "react";
import Layout from "@/components/Layout";
import { useTelegramContext } from "@/context/TelegramContext";
import { useGameContext } from "@/context/GameContext";
import { CircleDollarSign, Trophy, TrendingUp, BarChart3 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProfileIconSelector from "@/components/ProfileIconSelector";

const ProfilePage = () => {
  const { user, wallet } = useTelegramContext();
  const { currentUserStats } = useGameContext();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-card p-6 text-center">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4 ring-4 ring-app-purple/30">
              {user?.profileImage ? (
                <AvatarImage src={user.profileImage} alt={user?.username} />
              ) : (
                <AvatarFallback className="bg-app-purple/20 text-white text-3xl">
                  {user?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <h1 className="text-2xl font-bold mb-1">{user?.firstName} {user?.lastName}</h1>
            <p className="text-gray-400 mb-4">@{user?.username}</p>
            
            {wallet.connected ? (
              <div className="neomorphic-wallet px-4 py-2 rounded-full mb-4">
                <p className="text-sm text-gray-400">Wallet</p>
                <p className="font-medium text-white text-sm">{wallet.address}</p>
              </div>
            ) : (
              <p className="text-gray-400 mb-4">No wallet connected</p>
            )}
          </div>
          
          {currentUserStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="neomorphic-stat p-3 rounded-xl">
                <p className="text-gray-400 text-xs">Total Bets</p>
                <p className="text-white font-bold text-xl">{currentUserStats.totalBets}</p>
              </div>
              
              <div className="neomorphic-stat p-3 rounded-xl">
                <p className="text-gray-400 text-xs">Total Wins</p>
                <p className="text-white font-bold text-xl">{currentUserStats.totalWins}</p>
              </div>
              
              <div className="neomorphic-stat p-3 rounded-xl">
                <p className="text-gray-400 text-xs">Win Rate</p>
                <p className="text-white font-bold text-xl">
                  {currentUserStats.totalBets > 0 
                    ? Math.round((currentUserStats.totalWins / currentUserStats.totalBets) * 100) 
                    : 0}%
                </p>
              </div>
              
              <div className="neomorphic-stat p-3 rounded-xl">
                <p className="text-gray-400 text-xs">Net Profit</p>
                <p className={`font-bold text-xl ${currentUserStats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentUserStats.netProfit.toFixed(2)} TON
                </p>
              </div>
            </div>
          )}
        </div>
        
        <ProfileIconSelector />
      </div>
    </Layout>
  );
};

export default ProfilePage;
