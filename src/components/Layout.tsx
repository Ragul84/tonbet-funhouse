
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleDollarSign, Trophy, Home, Coins, Dice1, TrendingUp, User, Wallet } from "lucide-react";
import { useGameContext } from "@/context/GameContext";
import { useTelegramContext } from "@/context/TelegramContext";
import { Button } from "@/components/ui/button";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { balance } = useGameContext();
  const { user, wallet, connectWallet } = useTelegramContext();
  const location = useLocation();

  const navigation = [
    { name: "Home", path: "/", icon: Home },
    { name: "Coinflip", path: "/coinflip", icon: Coins },
    { name: "Dice", path: "/dice", icon: Dice1 },
    { name: "Crash", path: "/crash", icon: TrendingUp },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Profile", path: "/profile", icon: User },
  ];

  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

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
          
          {wallet.connected ? (
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-2 rounded-full">
              <Wallet className="h-4 w-4 text-ton" />
              <span className="text-xs font-medium">{formatAddress(wallet.address)}</span>
            </div>
          ) : (
            <Button 
              onClick={connectWallet} 
              variant="outline" 
              size="sm"
              className="bg-black/20 hover:bg-app-purple/20 border-app-purple/30 text-white"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          
          <div className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-full">
            <CircleDollarSign className="h-5 w-5 text-ton" />
            <span className="font-medium">{wallet.connected ? (Number(wallet.balance)/1e9).toFixed(2) : balance.toFixed(2)} TON</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-app-dark border-t border-white/10 py-4">
        <nav className="flex justify-around max-w-md mx-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center p-2 ${
                  location.pathname === item.path 
                    ? "text-app-purple font-medium" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
