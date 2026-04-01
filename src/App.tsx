import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import F1PitStopChallenge from "./pages/F1PitStopChallenge.tsx";
import F1RacePredictor from "./pages/F1RacePredictor.tsx";
import BettingMarketsGame from "./pages/BettingMarketsGame.tsx";
import BlackjackSpeedwayGame from "./pages/BlackjackSpeedwayGame.tsx";
import LiveCasinoGrandPrixGame from "./pages/LiveCasinoGrandPrixGame.tsx";
import PokerSlotsGame from "./pages/PokerSlotsGame.tsx";
import RouletteRacewayGame from "./pages/RouletteRacewayGame.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game/f1-pit-stop-challenge" element={<F1PitStopChallenge />} />
          <Route path="/game/betting-markets" element={<BettingMarketsGame />} />
          <Route path="/game/f1-race-predictor" element={<F1RacePredictor />} />
          <Route path="/game/blackjack-speedway" element={<BlackjackSpeedwayGame />} />
          <Route path="/game/live-casino-grand-prix" element={<LiveCasinoGrandPrixGame />} />
          <Route path="/game/poker-slots" element={<PokerSlotsGame />} />
          <Route path="/game/roulette-raceway" element={<RouletteRacewayGame />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
