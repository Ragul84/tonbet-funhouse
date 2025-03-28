
import React from "react";
import { Trophy, Dice1, Award, Star, CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTelegramContext } from "@/context/TelegramContext";
import { useGameContext } from "@/context/GameContext";

// Define achievement types
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  unlocked: boolean;
  progress?: {
    current: number;
    total: number;
  };
}

const ProfileAchievements: React.FC = () => {
  const { user } = useTelegramContext();
  const { currentUserStats } = useGameContext();

  // Mock achievements - in a real app, these would be fetched from the backend
  const achievements: Achievement[] = [
    {
      id: "first-bet",
      title: "First Steps",
      description: "Place your first bet",
      icon: CircleDollarSign,
      unlocked: currentUserStats?.totalBets > 0,
    },
    {
      id: "dice-master",
      title: "Dice Master",
      description: "Roll the dice 5 times",
      icon: Dice1,
      unlocked: currentUserStats?.totalBets >= 5,
      progress: {
        current: Math.min(currentUserStats?.totalBets || 0, 5),
        total: 5
      }
    },
    {
      id: "winning-streak",
      title: "Lucky Streak",
      description: "Win 3 games in a row",
      icon: Star,
      unlocked: false, // Would need streak tracking logic
      progress: {
        current: 0,
        total: 3
      }
    },
    {
      id: "high-roller",
      title: "High Roller",
      description: "Place a bet of 10 TON or more",
      icon: Award,
      unlocked: false, // Would need to track max bet amount
    },
  ];

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-app-purple" />
          Achievements
        </CardTitle>
        <CardDescription>
          Complete challenges to earn special badges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`
                p-4 rounded-xl transition-all duration-300
                ${achievement.unlocked 
                  ? 'bg-gradient-to-br from-app-purple/20 to-app-pink/20 border border-app-purple/30 shadow-neon-sm' 
                  : 'neomorphic-stat border border-white/5'}
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  p-3 rounded-full flex-shrink-0
                  ${achievement.unlocked 
                    ? 'bg-app-purple/30 text-white' 
                    : 'bg-gray-800/50 text-gray-400'}
                `}>
                  <achievement.icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-white">{achievement.title}</h3>
                    {achievement.unlocked ? (
                      <Badge className="bg-app-purple border-0">Unlocked</Badge>
                    ) : (
                      <Badge className="bg-gray-700 border-0">Locked</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                  
                  {achievement.progress && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-app-purple rounded-full transition-all duration-500"
                          style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {achievement.progress.current}/{achievement.progress.total}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAchievements;
