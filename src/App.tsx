import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PokerSlotsGame from "./pages/PokerSlotsGame.tsx";
import RouletteRacewayGame from "./pages/RouletteRacewayGame.tsx";
import BlackjackSpeedwayGame from "./pages/BlackjackSpeedwayGame.tsx";
import LiveCasinoGrandPrixGame from "./pages/LiveCasinoGrandPrixGame.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game/poker-slots" element={<PokerSlotsGame />} />
          <Route path="/game/roulette-raceway" element={<RouletteRacewayGame />} />
          <Route path="/game/blackjack-speedway" element={<BlackjackSpeedwayGame />} />
          <Route path="/game/live-casino-grand-prix" element={<LiveCasinoGrandPrixGame />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
