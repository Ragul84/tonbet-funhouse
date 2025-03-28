
import React from "react";
import Layout from "@/components/Layout";
import Dice from "@/components/games/Dice";
import BetHistory from "@/components/BetHistory";

const DicePage = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Dice />
        <div className="mt-6">
          <BetHistory />
        </div>
      </div>
    </Layout>
  );
};

export default DicePage;
