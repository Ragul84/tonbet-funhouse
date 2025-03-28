
import React from "react";
import Layout from "@/components/Layout";
import Dice from "@/components/games/Dice";
import BetHistory from "@/components/BetHistory";

const DicePage = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="glass-card p-6 mb-6">
          <Dice />
        </div>
        <div className="mt-6">
          <BetHistory />
        </div>
      </div>
    </Layout>
  );
};

export default DicePage;
