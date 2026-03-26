import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

export default function PokerSlotsGame() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(["🏎️", "🏁", "💰"]);
  const [result, setResult] = useState("");
  const [muted, setMuted] = useState(false);

  const spin = () => {
    if (balance < bet) {
      setResult("Saldo insuficiente!");
      return;
    }

    setSpinning(true);
    setResult("");
    setBalance(balance - bet);

    // Animação de spin
    setTimeout(() => {
      const symbols = ["🏎️", "🏁", "💰", "🎰", "⚡", "🌟"];
      const newReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];

      setReels(newReels);

      // Verificar vitória
      if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
        const winAmount = bet * 10;
        setBalance((prev) => prev + winAmount);
        setResult(`🎉 VITÓRIA! +€${winAmount}`);
      } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2]) {
        const winAmount = bet * 3;
        setBalance((prev) => prev + winAmount);
        setResult(`✅ Dois Iguais! +€${winAmount}`);
      } else {
        setResult("Tente novamente!");
      }

      setSpinning(false);
    }, 2000);
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
              🍎 Poker Slots - F1 Red Car
            </h1>
            <p className="text-muted-foreground">Jogo temático com emoção de corrida</p>
          </div>

          {/* Game Board */}
          <div className="bg-gradient-to-b from-primary/10 to-primary/5 rounded-xl border-2 border-gold p-8 space-y-6">
            {/* Reels */}
            <div className="flex justify-center gap-4">
              {reels.map((reel, idx) => (
                <div
                  key={idx}
                  className={`w-24 h-24 bg-gradient-to-br from-muted to-background border-2 border-gold rounded-lg flex items-center justify-center text-5xl font-bold transition-transform duration-200 ${
                    spinning ? "animate-bounce" : ""
                  }`}
                >
                  {reel}
                </div>
              ))}
            </div>

            {/* Result Display */}
            {result && (
              <div className="text-center">
                <p
                  className={`text-2xl font-display font-bold ${
                    result.includes("+") ? "text-gold" : "text-orange-500"
                  }`}
                >
                  {result}
                </p>
              </div>
            )}

            {/* Controls */}
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
                onClick={spin}
                disabled={spinning || balance < bet}
                className="w-full h-14 bg-gold hover:bg-gold/90 text-black font-display text-xl font-bold uppercase"
              >
                {spinning ? "🎰 Girando..." : "🎰 Girar"}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Saldo Disponível</span>
              <span className="text-gold font-display text-3xl font-bold">€{balance}</span>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Multiplicador Máximo</span>
              <span className="text-primary font-display text-3xl font-bold">10x</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
            <h3 className="font-display font-bold text-blue-400">Como Jogar:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ 3 Símbolos Iguais = 10x sua aposta</li>
              <li>✓ 2 Símbolos Iguais = 3x sua aposta</li>
              <li>✓ Sem combinação = Tente outra rodada</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
