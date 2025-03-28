
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import Coinflip from "@/components/games/Coinflip";
import BetHistory from "@/components/BetHistory";
import { useGameContext } from "@/context/GameContext";
import { Coins } from "lucide-react";

const CoinflipPage = () => {
  const { setCurrentGame } = useGameContext();

  useEffect(() => {
    setCurrentGame("coinflip");
  }, [setCurrentGame]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-2">
            Coinflip Game
          </h1>
          <p className="text-gray-400">Choose heads or tails and win 1.8x your bet if you're right!</p>
        </div>
        
        <div className="glass-card p-6 mb-6 backdrop-blur-xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute -top-20 right-20 w-40 h-40 rounded-full bg-yellow-500/10 filter blur-3xl"></div>
          <div className="absolute -bottom-20 left-20 w-40 h-40 rounded-full bg-app-purple/10 filter blur-3xl"></div>
          <Coinflip />
        </div>
        
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <Coins className="mr-2 h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Recent Coinflip Bets</h2>
          </div>
          <div className="neomorphic-card p-6">
            <BetHistory gameType="coinflip" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoinflipPage;
