import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type PokerHand = "royal-flush" | "straight-flush" | "four-of-a-kind" | "full-house" | "flush" | "straight" | "three-of-a-kind" | "two-pair" | "pair" | "high-card";

const PokerSlotsGame = () => {
  const { balance, addTransaction } = useWallet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ hand: PokerHand; multiplier: number; winAmount: number } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalWins, setTotalWins] = useState(0);
  const [stats, setStats] = useState({ spins: 0, wins: 0, losses: 0 });

  const handMultipliers: Record<PokerHand, number> = {
    "royal-flush": 1000,
    "straight-flush": 500,
    "four-of-a-kind": 250,
    "full-house": 100,
    "flush": 50,
    "straight": 40,
    "three-of-a-kind": 30,
    "two-pair": 15,
    "pair": 5,
    "high-card": 0,
  };

  const handDescriptions: Record<PokerHand, string> = {
    "royal-flush": "Royal Flush",
    "straight-flush": "Straight Flush",
    "four-of-a-kind": "Four of a Kind",
    "full-house": "Full House",
    "flush": "Flush",
    "straight": "Straight",
    "three-of-a-kind": "Three of a Kind",
    "two-pair": "Two Pair",
    "pair": "One Pair",
    "high-card": "High Card",
  };

  const getRandomHand = (): PokerHand => {
    const hands: PokerHand[] = [
      "royal-flush",
      "straight-flush",
      "four-of-a-kind",
      "full-house",
      "flush",
      "straight",
      "three-of-a-kind",
      "two-pair",
      "pair",
      "high-card",
    ];
    const weights = [1, 2, 3, 5, 8, 10, 12, 15, 20, 30];
    const random = Math.random() * weights.reduce((a, b) => a + b, 0);
    let cumulative = 0;

    for (let i = 0; i < hands.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return hands[i];
      }
    }
    return "high-card";
  };

  const spin = () => {
    if (betAmount < 10) {
      toast({
        title: "Aposta Inválida",
        description: "A aposta mínima é R$ 10",
        variant: "destructive",
      });
      return;
    }

    if (betAmount > balance) {
      toast({
        title: "Saldo Insuficiente",
        description: `Você tem R$ ${balance.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    setSpinning(true);
    
    // Simular rotação
    setTimeout(() => {
      const hand = getRandomHand();
      const multiplier = handMultipliers[hand];
      const winAmount = betAmount * multiplier;

      addTransaction({
        type: "aposta_colocada",
        amount: betAmount,
        description: `Poker Slots - Aposta de R$ ${betAmount.toFixed(2)}`,
      });

      if (multiplier > 0) {
        addTransaction({
          type: "aposta_vencida",
          amount: winAmount,
          description: `Poker Slots - ${handDescriptions[hand]} - Ganho de R$ ${winAmount.toFixed(2)}`,
        });
        setTotalWins(totalWins + winAmount);
        setStats({ ...stats, spins: stats.spins + 1, wins: stats.wins + 1 });
        
        toast({
          title: "🎉 Você Ganhou!",
          description: `${handDescriptions[hand]} - R$ ${winAmount.toFixed(2)}`,
        });
      } else {
        addTransaction({
          type: "aposta_perdida",
          amount: betAmount,
          description: `Poker Slots - High Card - Perdeu R$ ${betAmount.toFixed(2)}`,
        });
        setStats({ ...stats, spins: stats.spins + 1, losses: stats.losses + 1 });
      }

      setResult({ hand, multiplier, winAmount });
      setShowResult(true);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">♠️ POKER SLOTS ♠️</h1>
          <p className="text-amber-200/70">Spinning the cards of fortune</p>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Game Display */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-amber-600/50 p-8">
              <div className="aspect-video bg-gradient-to-br from-amber-900 to-slate-900 rounded-lg border-2 border-amber-600 flex items-center justify-center overflow-hidden">
                <div className={`text-8xl transition-transform ${spinning ? "animate-spin" : ""}`}>
                  🃏
                </div>
              </div>

              {/* Bet Controls */}
              <div className="mt-8 space-y-4">
                <div>
                  <label className="text-amber-300 font-semibold block mb-2">Valor da Aposta (R$)</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(10, Number(e.target.value)))}
                    disabled={spinning}
                    className="bg-slate-700 border-amber-600 text-white text-lg h-12"
                    min="10"
                    step="10"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {[50, 100, 250, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      disabled={spinning || amount > balance}
                      variant={betAmount === amount ? "default" : "outline"}
                      className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500"
                    >
                      R$ {amount}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={spin}
                  disabled={spinning || balance < betAmount}
                  className="w-full bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold h-14 text-lg rounded-lg shadow-lg"
                >
                  {spinning ? "🎰 GIRANDO..." : "🎰 GIRAR"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-amber-600/50 p-6">
              <h3 className="text-amber-400 font-bold text-lg mb-4">📊 Saldo</h3>
              <div className="text-3xl font-bold text-amber-300">
                R$ {balance.toFixed(2)}
              </div>
            </Card>

            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-amber-600/50 p-6">
              <h3 className="text-amber-400 font-bold text-lg mb-4">🏆 Ganhos Totais</h3>
              <div className="text-3xl font-bold text-green-400">
                R$ {totalWins.toFixed(2)}
              </div>
            </Card>

            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-amber-600/50 p-6">
              <h3 className="text-amber-400 font-bold text-lg mb-4">📈 Estatísticas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-200">Giros:</span>
                  <Badge className="bg-amber-600">{stats.spins}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Ganhos:</span>
                  <Badge className="bg-green-600">{stats.wins}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-300">Perdas:</span>
                  <Badge className="bg-red-600">{stats.losses}</Badge>
                </div>
                {stats.spins > 0 && (
                  <div className="flex justify-between pt-2 border-t border-amber-600/30">
                    <span className="text-amber-200">Taxa Vitória:</span>
                    <span className="text-amber-300 font-bold">
                      {((stats.wins / stats.spins) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Payout Table */}
        <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-amber-600/50 p-6">
          <h3 className="text-amber-400 font-bold text-lg mb-4">💰 Tabela de Pagamento</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(Object.entries(handMultipliers) as [PokerHand, number][]).map(([hand, multiplier]) => (
              <div key={hand} className="bg-slate-700/50 border border-amber-600/30 rounded p-3 text-center">
                <div className="text-amber-300 font-semibold text-sm">{handDescriptions[hand]}</div>
                <div className={`text-lg font-bold ${multiplier > 50 ? "text-green-400" : multiplier > 0 ? "text-yellow-400" : "text-red-400"}`}>
                  {multiplier > 0 ? `x${multiplier}` : "PERDE"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="bg-gradient-to-b from-slate-800 to-slate-900 border-amber-600">
          <DialogHeader>
            <DialogTitle className="text-amber-400 text-center text-2xl">
              {result?.multiplier ? "🎉 VOCÊ GANHOU! 🎉" : "😢 Você Perdeu"}
            </DialogTitle>
          </DialogHeader>
          {result && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🃏</div>
              <div className="text-3xl font-bold text-amber-300">{handDescriptions[result.hand]}</div>
              {result.multiplier > 0 && (
                <>
                  <div className="text-5xl font-bold text-green-400">
                    +R$ {result.winAmount.toFixed(2)}
                  </div>
                  <div className="text-amber-200">Multiplicador: x{result.multiplier}</div>
                </>
              )}
              <Button
                onClick={() => setShowResult(false)}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                Continuar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PokerSlotsGame;
