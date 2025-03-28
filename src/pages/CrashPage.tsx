
import React from "react";
import Layout from "@/components/Layout";
import Crash from "@/components/games/Crash";
import BetHistory from "@/components/BetHistory";

const CrashPage = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Crash />
        <div className="mt-6">
          <BetHistory />
        </div>
      </div>
    </Layout>
  );
};

export default CrashPage;
