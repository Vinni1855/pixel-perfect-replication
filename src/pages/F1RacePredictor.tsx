import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

export default function F1RacePredictor() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [muted, setMuted] = useState(false);
  const [result, setResult] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState(false);

  const drivers = [
    { name: "George Russell", country: "🇬🇧 GBR", odds: 2.5, team: "Mercedes", icon: "👤" },
    { name: "Lewis Hamilton", country: "🇬🇧 GBR", odds: 2.8, team: "Ferrari", icon: "👑" },
    { name: "Charles Leclerc", country: "🇲🇨 MON", odds: 3.2, team: "Ferrari", icon: "🏎️" },
    { name: "Carlos Sainz", country: "🇪🇸 ESP", odds: 3.5, team: "Ferrari", icon: "🚄" },
    { name: "Lando Norris", country: "🇬🇧 GBR", odds: 2.9, team: "McLaren", icon: "⚡" },
    { name: "Oscar Piastri", country: "🇦🇺 AUS", odds: 3.1, team: "McLaren", icon: "🌟" },
    { name: "Max Verstappen", country: "🇳🇱 NED", odds: 3.8, team: "Red Bull", icon: "👹" },
    { name: "Yuki Tsunoda", country: "🇯🇵 JPN", odds: 4.2, team: "Red Bull", icon: "🌸" },
  ];

  const predictWinner = (driverName: string, odds: number) => {
    if (balance < bet) {
      setResult("❌ Saldo insuficiente!");
      return;
    }

    setSelectedDriver(driverName);
    setGameActive(true);
    setBalance(balance - bet);
    setResult("");

    // Simula a corrida
    setTimeout(() => {
      // Odds influenciam a chance de ganhar
      const winChance = 1 / odds;
      const random = Math.random();

      if (random < winChance) {
        const winAmount = Math.floor(bet * odds);
        setBalance((prev) => prev + winAmount);
        setWinner(driverName);
        setResult(
          `🏆 VOCÊ ACERTOU! ${driverName} venceu a corrida! +R$ ${winAmount}`
        );
      } else {
        // Escolhe um piloto aleatório como vencedor
        const randomWinner =
          drivers[Math.floor(Math.random() * drivers.length)].name;
        setWinner(randomWinner);
        setResult(
          `❌ Errou! ${randomWinner} foi o vencedor. Tente novamente!`
        );
      }

      setGameActive(false);
    }, 3000);
  };

  const handleBetChange = (amount: number) => {
    if (amount > 0 && amount <= balance) {
      setBet(amount);
      setResult("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black">
      <Sidebar />

      <main className="ml-16 md:ml-56 transition-[margin] duration-300">
        {/* Header */}
        <header className="h-16 border-b border-primary/30 flex items-center justify-between px-6 sticky top-0 bg-black/40 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-primary hover:text-primary/80 transition-colors active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-display text-primary text-sm uppercase tracking-widest">
              🏁 F1 Race Predictor
            </h2>
          </div>
          <button onClick={() => setMuted(!muted)} className="text-primary hover:text-primary/80 transition-colors">
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </header>

        {/* Content */}
        <div className="p-6 max-w-6xl mx-auto">
          {/* Balance and Bet Section */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 mb-6 border border-primary/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wider">Saldo Atual</p>
                <p className="font-display text-2xl text-primary">R$ {balance.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm uppercase tracking-wider">Aposta</p>
                <p className="font-display text-2xl text-yellow-400">R$ {bet.toLocaleString()}</p>
              </div>
            </div>

            {/* Bet Controls */}
            <div className="flex gap-2 flex-wrap">
              {[100, 500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleBetChange(amount)}
                  disabled={amount > balance || gameActive}
                  className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-all ${
                    bet === amount
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-700 text-foreground hover:bg-slate-600 disabled:opacity-50"
                  }`}
                >
                  R$ {amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Game Description */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-primary/20">
            <h3 className="font-display text-primary uppercase tracking-wider mb-2">Como Jogar</h3>
            <p className="text-sm text-muted-foreground">
              Escolha qual piloto você acha que vai vencer a corrida! Pilotos com menores odds
              (favoritos) pagam menos, mas têm mais chances. Menores odds = Maiores chances!
            </p>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {drivers.map((driver) => (
              <button
                key={driver.name}
                onClick={() => predictWinner(driver.name, driver.odds)}
                disabled={gameActive || balance < bet}
                className={`relative overflow-hidden rounded-lg p-4 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2
                  ${
                    selectedDriver === driver.name && gameActive
                      ? "border-yellow-400 bg-slate-700/80 ring-2 ring-yellow-400/50"
                      : "border-primary/20 bg-slate-800/50 hover:border-primary/50 hover:bg-slate-800"
                  }
                `}
              >
                <div className="relative z-10">
                  <div className="text-3xl mb-2">{driver.icon}</div>
                  <p className="font-display text-foreground text-sm font-bold uppercase truncate">
                    {driver.name}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">{driver.country}</p>
                  <div className="bg-primary/20 rounded px-2 py-1 inline-block">
                    <p className="text-xs text-primary font-bold">{driver.odds}x odds</p>
                  </div>

                  {selectedDriver === driver.name && gameActive && (
                    <div className="mt-2 text-yellow-400 animate-pulse text-xs">
                      <p className="font-bold">🏁 Corrida em andamento...</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Result Display */}
          {result && (
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 border border-primary/30 mb-6">
              <div className="text-center">
                <p className="font-display text-lg text-primary uppercase tracking-wider mb-2">Resultado da Corrida</p>
                <p className="text-2xl font-bold text-white mb-4">{result}</p>

                {winner && (
                  <div className="mt-4 p-4 bg-slate-700/50 rounded inline-block">
                    <p className="text-xs text-muted-foreground uppercase">Vencedor</p>
                    <p className="text-xl font-display text-yellow-400">{winner}</p>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setResult("");
                    setWinner(null);
                    setSelectedDriver(null);
                  }}
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Nova Aposte
                </Button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>⚠️ Jogue com responsabilidade. Maiores de 18+ apenas.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
