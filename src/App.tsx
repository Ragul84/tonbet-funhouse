
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import { TelegramProvider } from "@/context/TelegramContext";

import Index from "./pages/Index";
import CoinflipPage from "./pages/CoinflipPage";
import DicePage from "./pages/DicePage";
import CrashPage from "./pages/CrashPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TelegramProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/coinflip" element={<CoinflipPage />} />
            <Route path="/dice" element={<DicePage />} />
            <Route path="/crash" element={<CrashPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GameProvider>
      </TelegramProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
