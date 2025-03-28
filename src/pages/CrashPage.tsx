
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import Crash from "@/components/games/Crash";
import BetHistory from "@/components/BetHistory";
import { useGameContext } from "@/context/GameContext";

const CrashPage = () => {
  const { setCurrentGame } = useGameContext();

  useEffect(() => {
    setCurrentGame("crash");
  }, [setCurrentGame]);

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="glass-card p-6 mb-6">
          <Crash />
        </div>
        <div className="mt-6">
          <BetHistory />
        </div>
      </div>
    </Layout>
  );
};

export default CrashPage;
