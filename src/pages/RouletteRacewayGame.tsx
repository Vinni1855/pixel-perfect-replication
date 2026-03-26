import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

export default function RouletteRacewayGame() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [spin, setSpin] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);

  const handleSpin = () => {
    if (!selectedNumber) {
      setResult("Escolha um número primeiro!");
      return;
    }

    if (balance < bet) {
      setResult("Saldo insuficiente!");
      return;
    }

    setSpinning(true);
    setResult("");
    setBalance(balance - bet);

    // Animação de spin
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 36);
      setSpin(winningNumber);

      if (winningNumber === selectedNumber) {
        const winAmount = bet * 36;
        setBalance((prev) => prev + winAmount);
        setResult(`🎉 NÚMERO CERTO! Saiu ${winningNumber}! +€${winAmount}`);
      } else if (Math.floor(winningNumber / 12) === Math.floor(selectedNumber / 12)) {
        const winAmount = bet * 3;
        setBalance((prev) => prev + winAmount);
        setResult(`✅ Acertou a Dúzia! Saiu ${winningNumber}! +€${winAmount}`);
      } else if (winningNumber % 2 === selectedNumber % 2) {
        const winAmount = bet * 2;
        setBalance((prev) => prev + winAmount);
        setResult(`✅ Acertou Par/Ímpar! Saiu ${winningNumber}! +€${winAmount}`);
      } else {
        setResult(`❌ Saiu ${winningNumber}. Tente novamente!`);
      }

      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-16 md:ml-56 transition-[margin] duration-300">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-40">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Lobby
          </Button>
          <button
            onClick={() => setMuted(!muted)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </header>

        {/* Game Content */}
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl uppercase tracking-wider text-foreground">
              🎡 Roulette Raceway - Wheel & Paddock
            </h1>
            <p className="text-muted-foreground">Escolha o número vencedor da corrida!</p>
          </div>

          {/* Game Board */}
          <div className="bg-gradient-to-b from-primary/10 to-primary/5 rounded-xl border-2 border-gold p-8 space-y-6">
            {/* Roulette Display */}
            <div
              className={`w-40 h-40 mx-auto rounded-full border-4 border-gold bg-gradient-to-br from-red-600 to-black flex items-center justify-center transition-transform duration-300 ${
                spinning ? "animate-spin" : ""
              }`}
            >
              <div className="text-4xl font-display font-bold text-white">
                {spin !== null ? spin : "?"}
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div className="text-center">
                <p
                  className={`text-2xl font-display font-bold ${
                    result.includes("✅") || result.includes("🎉") ? "text-gold" : "text-orange-500"
                  }`}
                >
                  {result}
                </p>
              </div>
            )}

            {/* Number Selection */}
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">Selecione um número (0-36):</p>
              <div className="grid grid-cols-9 gap-2">
                {Array.from({ length: 37 }).map((_, num) => (
                  <Button
                    key={num}
                    variant={selectedNumber === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedNumber(num)}
                    disabled={spinning}
                    className="text-xs"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bet Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-background/50 rounded-lg p-4">
                <span className="text-muted-foreground">Aposta Atual:</span>
                <span className="text-gold font-display text-2xl font-bold">€{bet}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant={bet === amount ? "default" : "outline"}
                    onClick={() => setBet(amount)}
                    disabled={spinning}
                  >
                    €{amount}
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleSpin}
                disabled={spinning || !selectedNumber}
                className="w-full h-14 bg-gold hover:bg-gold/90 text-black font-display text-xl font-bold uppercase"
              >
                {spinning ? "🎡 Girando..." : "🎡 Girar Rouleta"}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Saldo</span>
              <span className="text-gold font-display text-3xl font-bold">€{balance}</span>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Número Escolhido</span>
              <span className="text-primary font-display text-3xl font-bold">
                {selectedNumber !== null ? selectedNumber : "-"}
              </span>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Premiação</span>
              <span className="text-green-500 font-display text-3xl font-bold">36x</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
            <h3 className="font-display font-bold text-purple-400">Tabela de Pagamento:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Número Exato = 36x sua aposta</li>
              <li>✓ Acertar Dúzia (12 números) = 3x sua aposta</li>
              <li>✓ Par/Ímpar (18 números) = 2x sua aposta</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
