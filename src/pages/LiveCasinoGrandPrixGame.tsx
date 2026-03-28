import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

export default function LiveCasinoGrandPrixGame() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [result, setResult] = useState("");
  const [muted, setMuted] = useState(false);
  const [liveOdds, setLiveOdds] = useState({
    Mercedes: 2.5,
    Ferrari: 3.2,
    McLaren: 4.5,
    RedBull: 5.0,
  });

  const teams = [
    { name: "Mercedes", driver: "George Russell", odds: liveOdds.Mercedes, color: "from-cyan-500" },
    { name: "Ferrari", driver: "Charles Leclerc", odds: liveOdds.Ferrari, color: "from-red-600" },
    { name: "McLaren", driver: "Lando Norris", odds: liveOdds.McLaren, color: "from-orange-500" },
    { name: "Red Bull", driver: "Max Verstappen", odds: liveOdds.RedBull, color: "from-blue-600" },
  ];

  const placeBet = () => {
    if (!selectedTeam) {
      setResult("Selecione um time/piloto!");
      return;
    }

    if (balance < bet) {
      setResult("Saldo insuficiente!");
      return;
    }

    setGameStarted(true);
    setBalance(balance - bet);
    setResult("🏁 A corrida está começando...");

    // Simulação da corrida
    setTimeout(() => {
      const winners = ["Mercedes", "Ferrari", "McLaren", "Red Bull"];
      const winner = winners[Math.floor(Math.random() * winners.length)];
      const winnerOdds = liveOdds[winner as keyof typeof liveOdds];

      if (winner === selectedTeam) {
        const winAmount = Math.floor(bet * winnerOdds);
        setBalance((prev) => prev + winAmount);
        setResult(
          `🎉 ${selectedTeam} VENCEU! 🏆 Piloto cruzou a linha primeiro! +R$ ${winAmount}`
        );
      } else {
        setResult(`❌ ${winner} venceu! ${selectedTeam} não terminou em primeiro.`);
      }

      setGameStarted(false);
    }, 4000);
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
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl uppercase tracking-wider text-foreground">
              🏎️ Live Casino Grand Prix - Dealer & Track
            </h1>
            <p className="text-muted-foreground">Aposte em qual piloto vai vencer!</p>
          </div>

          {/* Live Status Bar */}
          <div className="bg-gradient-to-r from-gold/20 to-primary/20 rounded-lg border border-gold p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-gold font-display font-bold">AO VIVO</span>
            </div>
            <span className="text-muted-foreground text-sm">Circuito de Mônaco - 22°C</span>
          </div>

          {/* Game Board */}
          <div className="bg-gradient-to-b from-slate-900/50 to-black/50 rounded-xl border-2 border-gold p-8 space-y-6">
            {/* Track Visualization */}
            <div className="relative h-24 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-gold/30 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl animate-bounce">🏁</span>
              </div>
              <div className="absolute inset-0 flex items-center opacity-20">
                <span className="text-6xl animate-pulse">₿ 🏎️ 🏎️ 🏎️</span>
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div className="text-center">
                <p
                  className={`text-xl font-display font-bold ${
                    result.includes("🎉") ? "text-gold" : "text-orange-500"
                  }`}
                >
                  {result}
                </p>
              </div>
            )}

            {/* Team Selection */}
            <div>
              <p className="text-muted-foreground text-sm mb-4">Escolha o piloto/time vencedor:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.name}
                    onClick={() => !gameStarted && setSelectedTeam(team.name)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                      selectedTeam === team.name
                        ? "border-gold bg-gold/10"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-display font-bold text-foreground">{team.name}</h3>
                        <p className="text-muted-foreground text-sm">{team.driver}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${team.color} to-transparent`}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Odds: {team.odds.toFixed(2)}</Badge>
                      <span className="text-gold font-semibold">
                        +R$ {Math.floor(bet * team.odds)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bet Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-background/50 rounded-lg p-4">
                <span className="text-muted-foreground">Aposta Atual:</span>
                <span className="text-gold font-display text-2xl font-bold">R$ {bet}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant={bet === amount ? "default" : "outline"}
                    onClick={() => setBet(amount)}
                    disabled={gameStarted}
                  >
                    R$ {amount}
                  </Button>
                ))}
              </div>

              <Button
                onClick={placeBet}
                disabled={gameStarted || !selectedTeam}
                className="w-full h-14 bg-gold hover:bg-gold/90 text-black font-display text-xl font-bold uppercase"
              >
                {gameStarted ? "🏁 Corrida em Andamento..." : "🏁 Apostar Agora"}
              </Button>
            </div>
          </div>

          {/* Live Leaderboard */}
          <div className="bg-background rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-display font-bold text-foreground text-lg">📊 Classificação ao Vivo</h3>
            <div className="space-y-2">
              {[
                { pos: "🥇", team: "Ferrari", time: "1:14:32", gap: "-" },
                { pos: "🥈", team: "Mercedes", time: "1:14:45", gap: "+13s" },
                { pos: "🥉", team: "McLaren", time: "1:15:02", gap: "+30s" },
                { pos: "4️⃣", team: "Red Bull", time: "1:15:18", gap: "+46s" },
              ].map((driver, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-muted/50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{driver.pos}</span>
                    <span className="font-display font-semibold">{driver.team}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground text-sm">{driver.time}</span>
                    {driver.gap !== "-" && <span className="text-orange-500 text-sm ml-2">{driver.gap}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Saldo</span>
              <span className="text-gold font-display text-3xl font-bold">R$ {balance}</span>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Piloto Selecionado</span>
              <span className="text-primary font-display text-2xl font-bold">{selectedTeam || "-"}</span>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Ganho Potencial</span>
              <span className="text-green-500 font-display text-2xl font-bold">
                +R$ {selectedTeam ? Math.floor(bet * (liveOdds[selectedTeam as keyof typeof liveOdds] || 1)) : 0}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
            <h3 className="font-display font-bold text-blue-400">📢 Informações da Corrida:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Aposte na corrida de F1 ao vivo</li>
              <li>✓ Odds dinâmicas conforme a demonstração progride</li>
              <li>✓ Vença e ganhe múltiplos de sua aposta!</li>
              <li>✓ Experiência temática imersiva</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
