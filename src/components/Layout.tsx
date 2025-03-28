
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CircleDollarSign, Trophy, Home, Coins, Dice1, TrendingUp, User, Wallet, LogOut } from "lucide-react";
import { useGameContext } from "@/context/GameContext";
import { useTelegramContext } from "@/context/TelegramContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { balance } = useGameContext();
  const { user, wallet, connectWallet, disconnectWallet } = useTelegramContext();
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigation = [
    { name: "Home", path: "/", icon: Home },
    { name: "Coinflip", path: "/coinflip", icon: Coins },
    { name: "Dice", path: "/dice", icon: Dice1 },
    { name: "Crash", path: "/crash", icon: TrendingUp },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Profile", path: "/profile", icon: User },
  ];

  // Format wallet address for display
  const formatAddress = () => {
    if (wallet.formattedAddress) {
      console.log("Using formatted address:", wallet.formattedAddress);
      return wallet.formattedAddress;
    }
    return "";
  };

  // Format balance for display
  const displayBalance = () => {
    if (wallet.connected && wallet.balance) {
      // Ensure wallet balance is properly displayed
      return wallet.balance;
    }
    return balance.toFixed(2);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-800 m-4 py-3 px-4 md:px-6 flex flex-wrap justify-between items-center gap-3 rounded-xl shadow-lg border border-white/10">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            TON Casino
          </span>
          <span className="ml-1 text-xs px-1.5 py-0.5 bg-purple-600/50 rounded-md text-white font-medium border border-purple-500/40">PRO</span>
        </Link>
        
        <div className="flex flex-wrap items-center gap-3">
          {user && (
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-full border border-white/10">
              <Avatar className="h-8 w-8 ring-2 ring-app-purple/30">
                {user.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user.username} />
                ) : (
                  <AvatarFallback className="bg-app-purple/20 text-white">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium text-white">@{user.username}</span>
            </div>
          )}
          
          {wallet.connected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2 neomorphic-wallet px-3 py-2 rounded-full">
                <Wallet className="h-4 w-4 text-app-purple" />
                <span className="text-xs font-medium text-white">{formatAddress()}</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={disconnectWallet} 
                    variant="outline" 
                    size="sm"
                    className="neomorphic-button hover:bg-red-500/20 border-red-500/30 text-white p-2 h-8 w-8"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disconnect Wallet</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <Button 
              onClick={connectWallet} 
              variant="outline" 
              size="sm"
              className="neomorphic-button hover:bg-app-purple/20 border-app-purple/30 text-white"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
          
          <div className="flex items-center space-x-2 neomorphic-balance px-3 py-2 rounded-full">
            <CircleDollarSign className="h-5 w-5 text-ton" />
            <span className="font-medium text-white">{displayBalance()} TON</span>
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
                className={`flex flex-col items-center p-2 transition-all duration-300 ${
                  location.pathname === item.path 
                    ? "text-app-purple font-medium" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className={`p-2 rounded-full ${location.pathname === item.path ? 'bg-app-purple/20' : 'hover:bg-white/5'}`}>
                  <Icon className={`h-5 w-5 ${location.pathname === item.path ? 'text-app-purple' : ''}`} />
                </div>
                {!isMobile && <span className="text-sm mt-1">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
