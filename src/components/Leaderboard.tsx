
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Trophy, Award, TrendingUp } from "lucide-react";

interface LeaderboardProps {
  type?: "wins" | "bets" | "profit";
}

const Leaderboard: React.FC<LeaderboardProps> = ({ type = "wins" }) => {
  const { userStats } = useGameContext();
  
  // Sort users based on leaderboard type
  const sortedUsers = [...userStats].sort((a, b) => {
    if (type === "wins") {
      return b.totalWins - a.totalWins;
    } else if (type === "bets") {
      return b.totalBets - a.totalBets;
    } else {
      return b.netProfit - a.netProfit;
    }
  }).slice(0, 10); // Top 10 users

  // Get the title and icon based on type
  const getTitle = () => {
    switch (type) {
      case "wins":
        return { text: "Most Wins", icon: <Trophy className="h-5 w-5 text-yellow-500" /> };
      case "bets":
        return { text: "Most Active Players", icon: <Award className="h-5 w-5 text-blue-500" /> };
      case "profit":
        return { text: "Top Earners", icon: <TrendingUp className="h-5 w-5 text-green-500" /> };
    }
  };
  
  const title = getTitle();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-2 mb-4">
        {title.icon}
        <h2 className="text-xl font-bold text-center">{title.text}</h2>
      </div>
      
      <Table>
        <TableCaption>Top 10 players ranked by {type}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">
              {type === "wins" ? "Wins" : type === "bets" ? "Total Bets" : "Net Profit"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user, index) => (
            <TableRow key={user.userId}>
              <TableCell className="font-medium">
                {index + 1}
                {index === 0 && <span className="ml-1">🥇</span>}
                {index === 1 && <span className="ml-1">🥈</span>}
                {index === 2 && <span className="ml-1">🥉</span>}
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell className="text-right">
                {type === "wins" 
                  ? user.totalWins 
                  : type === "bets" 
                    ? user.totalBets 
                    : user.netProfit.toFixed(2) + " TON"}
              </TableCell>
            </TableRow>
          ))}
          {sortedUsers.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-gray-400">
                No data available yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;
