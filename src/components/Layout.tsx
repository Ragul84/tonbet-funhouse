
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleDollarSign, Trophy } from "lucide-react";
import { useGameContext } from "@/context/GameContext";
import { useTelegramContext } from "@/context/TelegramContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { balance } = useGameContext();
  const { user } = useTelegramContext();
  const location = useLocation();

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Coinflip", path: "/coinflip" },
    { name: "Dice", path: "/dice" },
    { name: "Crash", path: "/crash" },
    { name: "Leaderboard", path: "/leaderboard" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="glass-card m-4 py-3 px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-purple-pink-gradient bg-clip-text text-transparent">
          TON Bet
        </Link>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-sm text-gray-300">
              @{user.username}
            </div>
          )}
          <div className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-full">
            <CircleDollarSign className="h-5 w-5 text-ton" />
            <span className="font-medium">{balance.toFixed(2)} TON</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-app-dark border-t border-white/10 py-4">
        <nav className="flex justify-around max-w-md mx-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center p-2 ${
                location.pathname === item.path 
                  ? "text-app-purple font-medium" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.name === "Leaderboard" ? (
                <Trophy className="h-5 w-5" />
              ) : null}
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
