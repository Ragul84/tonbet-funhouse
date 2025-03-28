
import React from "react";
import Layout from "@/components/Layout";
import Coinflip from "@/components/games/Coinflip";
import BetHistory from "@/components/BetHistory";

const CoinflipPage = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Coinflip />
        <div className="mt-6">
          <BetHistory />
        </div>
      </div>
    </Layout>
  );
};

export default CoinflipPage;
