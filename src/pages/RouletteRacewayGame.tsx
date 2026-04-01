import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RouletteNumber {
  number: number;
  color: "red" | "black" | "green";
  odds: number;
}

const rouletteNumbers: RouletteNumber[] = [
  // Green (0 e 00)
  { number: 0, color: "green", odds: 36 },
  { number: 37, color: "green", odds: 36 }, // 00

  // Red numbers
  ...[[1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]].flat().map((n) => ({
    number: n,
    color: "red" as const,
    odds: 2,
  })),

  // Black numbers
  ...[[2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]].flat().map((n) => ({
    number: n,
    color: "black" as const,
    odds: 2,
  })),
];

const RouletteRacewayGame = () => {
  const { balance, addTransaction } = useWallet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedBet, setSelectedBet] = useState<"red" | "black" | "number" | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<RouletteNumber | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalWins, setTotalWins] = useState(0);
  const [stats, setStats] = useState({ spins: 0, wins: 0, losses: 0 });
  const [winAmount, setWinAmount] = useState(0);

  const spin = () => {
    if (!selectedBet) {
      toast({
        title: "Selecione uma Aposta",
        description: "Escolha Red, Black ou um Número",
        variant: "destructive",
      });
      return;
    }

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
      const winningNumber = rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)];
      let won = false;
      let payout = 0;

      if (selectedBet === "red" && winningNumber.color === "red") {
        won = true;
        payout = betAmount * 2;
      } else if (selectedBet === "black" && winningNumber.color === "black") {
        won = true;
        payout = betAmount * 2;
      } else if (selectedBet === "number" && winningNumber.number === selectedNumber) {
        won = true;
        payout = betAmount * 35;
      }

      addTransaction({
        type: "aposta_colocada",
        amount: betAmount,
        description: `Roulette Raceway - Aposta em ${selectedBet} - R$ ${betAmount.toFixed(2)}`,
      });

      if (won) {
        addTransaction({
          type: "aposta_vencida",
          amount: payout,
          description: `Roulette Raceway - Número ${winningNumber.number} - Ganho de R$ ${payout.toFixed(2)}`,
        });
        setTotalWins(totalWins + payout);
        setStats({ ...stats, spins: stats.spins + 1, wins: stats.wins + 1 });
        setWinAmount(payout);

        toast({
          title: "🎉 Número Vencedor!",
          description: `${winningNumber.number} - ${winningNumber.color.toUpperCase()} - R$ ${payout.toFixed(2)}`,
        });
      } else {
        addTransaction({
          type: "aposta_perdida",
          amount: betAmount,
          description: `Roulette Raceway - Número ${winningNumber.number} - Perdeu R$ ${betAmount.toFixed(2)}`,
        });
        setStats({ ...stats, spins: stats.spins + 1, losses: stats.losses + 1 });
        setWinAmount(0);
      }

      setResult(winningNumber);
      setShowResult(true);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-green-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-2">🎡 ROULETTE RACEWAY 🎡</h1>
          <p className="text-green-200/70">The wheel of fortune spins</p>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Game Display */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-green-600/50 p-8">
              {/* Roulette Wheel Display */}
              <div className="bg-gradient-to-br from-green-900 to-slate-900 rounded-lg border-4 border-green-600 p-8 mb-8">
                <div className="flex justify-center">
                  <div
                    className={`relative w-64 h-64 rounded-full bg-gradient-to-b from-green-800 to-black border-8 border-yellow-500 flex items-center justify-center ${
                      spinning ? "animate-spin" : ""
                    }`}
                    style={{
                      backgroundImage: `conic-gradient(
                        red 0deg 9.5deg,
                        black 9.5deg 19deg,
                        red 19deg 28.5deg,
                        black 28.5deg 38deg,
                        red 38deg 47.5deg,
                        black 47.5deg 57deg,
                        red 57deg 66.5deg,
                        black 66.5deg 76deg,
                        red 76deg 85.5deg,
                        black 85.5deg 95deg,
                        red 95deg 104.5deg,
                        black 104.5deg 114deg,
                        red 114deg 123.5deg,
                        black 123.5deg 133deg,
                        red 133deg 142.5deg,
                        black 142.5deg 152deg,
                        red 152deg 161.5deg,
                        black 161.5deg 171deg,
                        red 171deg 180.5deg,
                        black 180.5deg 190deg,
                        red 190deg 199.5deg,
                        black 199.5deg 209deg,
                        red 209deg 218.5deg,
                        black 218.5deg 228deg,
                        red 228deg 237.5deg,
                        black 237.5deg 247deg,
                        red 247deg 256.5deg,
                        black 256.5deg 266deg,
                        red 266deg 275.5deg,
                        black 275.5deg 285deg,
                        red 285deg 294.5deg,
                        black 294.5deg 304deg,
                        red 304deg 313.5deg,
                        black 313.5deg 323deg,
                        red 323deg 332.5deg,
                        black 332.5deg 342deg,
                        red 342deg 351.5deg,
                        black 351.5deg 360deg
                      )`,
                    }}
                  >
                    <div className="flex items-center justify-center text-white font-bold text-2xl">
                      {result ? result.number : "?"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bet Selection */}
              <div className="space-y-4">
                <label className="text-green-300 font-semibold block">Tipo de Aposta</label>

                {/* Red/Black/Green Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => setSelectedBet("red")}
                    disabled={spinning}
                    variant={selectedBet === "red" ? "default" : "outline"}
                    className={`h-12 font-bold ${
                      selectedBet === "red"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-slate-700 hover:bg-slate-600 text-red-400"
                    }`}
                  >
                    🔴 RED
                  </Button>
                  <Button
                    onClick={() => setSelectedBet("black")}
                    disabled={spinning}
                    variant={selectedBet === "black" ? "default" : "outline"}
                    className={`h-12 font-bold ${
                      selectedBet === "black"
                        ? "bg-black hover:bg-slate-900"
                        : "bg-slate-700 hover:bg-slate-600 text-yellow-300"
                    }`}
                  >
                    ⚫ BLACK
                  </Button>
                  <Button
                    onClick={() => setSelectedBet("number")}
                    disabled={spinning}
                    variant={selectedBet === "number" ? "default" : "outline"}
                    className={`h-12 font-bold ${
                      selectedBet === "number"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-slate-700 hover:bg-slate-600 text-green-400"
                    }`}
                  >
                    💚 NÚMERO
                  </Button>
                </div>

                {/* Number Selection */}
                {selectedBet === "number" && (
                  <div>
                    <label className="text-green-300 font-semibold block mb-2">Escolha o Número</label>
                    <div className="grid grid-cols-6 gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36].map((num) => (
                        <Button
                          key={num}
                          onClick={() => setSelectedNumber(num)}
                          disabled={spinning}
                          variant={selectedNumber === num ? "default" : "outline"}
                          className={`h-10 text-sm font-bold ${
                            selectedNumber === num
                              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                              : "bg-slate-700 hover:bg-slate-600"
                          }`}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bet Amount */}
                <div>
                  <label className="text-green-300 font-semibold block mb-2">Valor da Aposta (R$)</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(10, Number(e.target.value)))}
                    disabled={spinning}
                    className="bg-slate-700 border-green-600 text-white text-lg h-12"
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
                      className="bg-green-600 hover:bg-green-700 text-white border-green-500"
                    >
                      R$ {amount}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={spin}
                  disabled={spinning || balance < betAmount || !selectedBet || (selectedBet === "number" && selectedNumber === null)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold h-14 text-lg rounded-lg shadow-lg"
                >
                  {spinning ? "🎡 RODANDO..." : "🎡 GIRAR"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-green-600/50 p-6">
              <h3 className="text-green-400 font-bold text-lg mb-4">💰 Saldo</h3>
              <div className="text-3xl font-bold text-green-300">
                R$ {balance.toFixed(2)}
              </div>
            </Card>

            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-green-600/50 p-6">
              <h3 className="text-green-400 font-bold text-lg mb-4">🏆 Ganhos Totais</h3>
              <div className="text-3xl font-bold text-yellow-400">
                R$ {totalWins.toFixed(2)}
              </div>
            </Card>

            <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-green-600/50 p-6">
              <h3 className="text-green-400 font-bold text-lg mb-4">📈 Estatísticas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-200">Giros:</span>
                  <Badge className="bg-green-600">{stats.spins}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Ganhos:</span>
                  <Badge className="bg-emerald-600">{stats.wins}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-300">Perdas:</span>
                  <Badge className="bg-red-600">{stats.losses}</Badge>
                </div>
                {stats.spins > 0 && (
                  <div className="flex justify-between pt-2 border-t border-green-600/30">
                    <span className="text-green-200">Taxa Vitória:</span>
                    <span className="text-green-300 font-bold">
                      {((stats.wins / stats.spins) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Payout Info */}
        <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-green-600/50 p-6">
          <h3 className="text-green-400 font-bold text-lg mb-4">💰 Pagamentos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 border border-red-600/30 rounded p-4">
              <div className="font-semibold text-red-400">Red</div>
              <div className="text-2xl font-bold text-red-300 mt-1">2:1</div>
              <div className="text-sm text-gray-300 mt-2">50% de chance</div>
            </div>
            <div className="bg-slate-700/50 border border-yellow-600/30 rounded p-4">
              <div className="font-semibold text-yellow-400">Black</div>
              <div className="text-2xl font-bold text-yellow-300 mt-1">2:1</div>
              <div className="text-sm text-gray-300 mt-2">50% de chance</div>
            </div>
            <div className="bg-slate-700/50 border border-green-600/30 rounded p-4">
              <div className="font-semibold text-green-400">Número Exato</div>
              <div className="text-2xl font-bold text-green-300 mt-1">35:1</div>
              <div className="text-sm text-gray-300 mt-2">2.7% de chance</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="bg-gradient-to-b from-slate-800 to-slate-900 border-green-600">
          <DialogHeader>
            <DialogTitle className="text-green-400 text-center text-2xl">
              {winAmount > 0 ? "🎉 VOCÊ GANHOU! 🎉" : "😢 Você Perdeu"}
            </DialogTitle>
          </DialogHeader>
          {result && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">
                {result.color === "red" ? "🔴" : result.color === "black" ? "⚫" : "💚"}
              </div>
              <div className="text-4xl font-bold text-yellow-300">{result.number}</div>
              {winAmount > 0 && (
                <>
                  <div className="text-5xl font-bold text-green-400">
                    +R$ {winAmount.toFixed(2)}
                  </div>
                </>
              )}
              {winAmount === 0 && (
                <div className="text-2xl font-semibold text-red-400">
                  -R$ {betAmount.toFixed(2)}
                </div>
              )}
              <Button
                onClick={() => setShowResult(false)}
                className="w-full bg-green-600 hover:bg-green-700"
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

export default RouletteRacewayGame;
