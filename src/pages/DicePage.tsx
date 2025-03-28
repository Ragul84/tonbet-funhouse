
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import Dice from "@/components/games/Dice";
import BetHistory from "@/components/BetHistory";
import { useGameContext } from "@/context/GameContext";
import { Dice1 } from "lucide-react";

const DicePage = () => {
  const { setCurrentGame } = useGameContext();

  useEffect(() => {
    setCurrentGame("dice");
  }, [setCurrentGame]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent mb-2">
            Dice Game
          </h1>
          <p className="text-gray-400">Roll the dice and win big if your prediction is correct!</p>
        </div>
        
        <div className="glass-card p-6 mb-6 backdrop-blur-xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute -top-20 right-20 w-40 h-40 rounded-full bg-blue-500/10 filter blur-3xl"></div>
          <div className="absolute -bottom-20 left-20 w-40 h-40 rounded-full bg-app-purple/10 filter blur-3xl"></div>
          <Dice />
        </div>
        
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <Dice1 className="mr-2 h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Recent Dice Bets</h2>
          </div>
          <div className="neomorphic-card p-6">
            <BetHistory gameType="dice" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DicePage;
