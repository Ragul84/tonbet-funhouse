
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
      <div className="max-w-3xl mx-auto"> {/* Further increased width for better visibility */}
        <div className="glass-card p-6 mb-6">
          <Crash />
        </div>
        <div className="mt-6">
          <BetHistory gameType="crash" />
        </div>
      </div>
    </Layout>
  );
};

export default CrashPage;
