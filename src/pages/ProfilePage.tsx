
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useTelegramContext } from "@/context/TelegramContext";
import { useGameContext } from "@/context/GameContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Award, Clock, CheckCircle2, Flame } from "lucide-react";

const ProfilePage = () => {
  const { user } = useTelegramContext();
  const { balance, bets } = useGameContext();
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate total bets placed
  const totalBets = bets?.length || 0;
  const totalWins = bets?.filter(bet => bet.outcome === "win").length || 0;
  const winRate = totalBets > 0 ? Math.round((totalWins / totalBets) * 100) : 0;

  // Simulate recent activity
  const recentActivity = bets?.slice(0, 5) || [];

  // Simulate achievements
  const achievements = [
    {
      id: "first_bet",
      name: "First Bet",
      description: "Place your first bet",
      icon: CheckCircle2,
      unlocked: totalBets > 0,
    },
    {
      id: "lucky_streak",
      name: "Lucky Streak",
      description: "Win 5 bets in a row",
      icon: Flame,
      unlocked: false, // This would be calculated based on actual streak
    },
    {
      id: "big_winner",
      name: "Big Winner",
      description: "Win more than 10 TON in a single bet",
      icon: Award,
      unlocked: false, // This would be calculated based on actual wins
    }
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            {user && (
              <p className="text-gray-400">@{user.username}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-full">
            <CircleDollarSign className="h-5 w-5 text-ton" />
            <span className="font-medium">{balance.toFixed(2)} TON</span>
          </div>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <CircleDollarSign className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Your betting stats and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold text-white">{totalBets}</div>
                    <div className="text-sm text-gray-400">Total Bets</div>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold text-white">{totalWins}</div>
                    <div className="text-sm text-gray-400">Wins</div>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold text-white">{winRate}%</div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                </div>
                <div className="glass-card p-4">
                  <h3 className="text-md font-medium mb-2">Balance History</h3>
                  <div className="h-32 flex items-center justify-center">
                    <p className="text-gray-400">Balance history chart will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Unlock achievements as you play</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`glass-card p-4 flex items-center space-x-4 ${
                        achievement.unlocked ? "bg-opacity-70" : "opacity-60"
                      }`}
                    >
                      <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-app-purple/20" : "bg-gray-700/20"}`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? "text-app-purple" : "text-gray-500"}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{achievement.name}</h3>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <span className="ml-auto text-xs bg-app-purple/20 text-app-purple px-2 py-1 rounded-full">
                          Unlocked
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent bets and outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((bet, index) => (
                      <div key={index} className="glass-card p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${bet.outcome === "win" ? "bg-green-500" : "bg-red-500"}`}></div>
                          <div>
                            <h3 className="font-medium">{bet.game}</h3>
                            <p className="text-xs text-gray-400">{new Date(bet.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className={`font-medium ${bet.outcome === "win" ? "text-green-500" : "text-red-500"}`}>
                          {bet.outcome === "win" ? "+" : "-"}{bet.amount.toFixed(2)} TON
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No recent activity yet</p>
                    <p className="text-gray-500 text-sm">Start playing to see your activity here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
