
import React, { useState } from "react";
import Layout from "@/components/Layout";
import Leaderboard from "@/components/Leaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, TrendingUp } from "lucide-react";

const LeaderboardPage = () => {
  const [leaderboardType, setLeaderboardType] = useState<"wins" | "bets" | "profit">("wins");

  return (
    <Layout>
      <div className="space-y-6 max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 mt-2">
            See who's winning the most and topping the charts
          </p>
        </div>

        <Tabs defaultValue="wins" onValueChange={(value) => setLeaderboardType(value as "wins" | "bets" | "profit")}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="wins" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Most Wins</span>
            </TabsTrigger>
            <TabsTrigger value="bets" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Most Bets</span>
            </TabsTrigger>
            <TabsTrigger value="profit" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Top Earners</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wins">
            <Leaderboard type="wins" />
          </TabsContent>
          <TabsContent value="bets">
            <Leaderboard type="bets" />
          </TabsContent>
          <TabsContent value="profit">
            <Leaderboard type="profit" />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
