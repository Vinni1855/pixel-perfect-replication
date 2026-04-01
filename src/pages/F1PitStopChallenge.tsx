import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

export default function F1PitStopChallenge() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [muted, setMuted] = useState(false);
  const [result, setResult] = useState("");
  const [gameActive, setGameActive] = useState(false);
  const [stopTime, setStopTime] = useState<number | null>(null);
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [team, setTeam] = useState<string | null>(null);

  const teams = [
    { name: "Mercedes", icon: "🏁", speed: 2.1, color: "from-cyan-500 to-blue-600" },
    { name: "Ferrari", icon: "🔴", speed: 2.3, color: "from-red-600 to-red-700" },
    { name: "McLaren", icon: "🟠", speed: 2.2, color: "from-orange-500 to-orange-600" },
    { name: "Red Bull", icon: "⚫", speed: 2.0, color: "from-blue-700 to-purple-600" },
  ];

  const playGame = (selectedTeam: string) => {
    if (balance < bet) {
      setResult("❌ Saldo insuficiente!");
      return;
    }

    setTeam(selectedTeam);
    setGameActive(true);
    setBalance(balance - bet);
    setResult("");

    // Gera tempo alvo para a parada (entre 2.0 e 2.5 segundos)
    const target = parseFloat((Math.random() * 0.5 + 2.0).toFixed(2));
    setTargetTime(target);

    // Simula a parada
    setTimeout(() => {
      const teamData = teams.find((t) => t.name === selectedTeam);
      const variation = (Math.random() - 0.5) * 0.3; // ±0.15 segundos de variação
      const actualTime = parseFloat((teamData!.speed + variation).toFixed(2));
      setStopTime(actualTime);

      // Verifica resultado
      const timeDifference = Math.abs(actualTime - target);

      if (timeDifference < 0.1) {
        const winAmount = bet * 15; // Perfeito!
        setBalance((prev) => prev + winAmount);
        setResult(`🏆 PERFEITO! ${actualTime}s = ${target}s +R$ ${winAmount}`);
      } else if (timeDifference < 0.2) {
        const winAmount = bet * 8; // Excelente
        setBalance((prev) => prev + winAmount);
        setResult(`🥇 EXCELENTE! ${actualTime}s vs ${target}s +R$ ${winAmount}`);
      } else if (timeDifference < 0.35) {
        const winAmount = bet * 3; // Bom
        setBalance((prev) => prev + winAmount);
        setResult(`✅ BOM! ${actualTime}s vs ${target}s +R$ ${winAmount}`);
      } else {
        setResult(`❌ Parada lenta demais! ${actualTime}s vs ${target}s. Tente novamente!`);
      }

      setGameActive(false);
    }, 2000);
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
              🏁 F1 Pit Stop Challenge
            </h2>
          </div>
          <button onClick={() => setMuted(!muted)} className="text-primary hover:text-primary/80 transition-colors">
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </header>

        {/* Content */}
        <div className="p-6 max-w-4xl mx-auto">
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
              Escolha um time de F1 e faça sua aposta. Quanto mais próximo você acertar o tempo de pit stop,
              maior será seu prêmio! Acertar o tempo exato rende até 15x sua aposta.
            </p>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {teams.map((t) => (
              <button
                key={t.name}
                onClick={() => playGame(t.name)}
                disabled={gameActive || balance < bet}
                className={`relative overflow-hidden rounded-lg p-6 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                  ${team === t.name && gameActive ? "ring-2 ring-yellow-400" : ""}
                `}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${t.color} opacity-20 group-hover:opacity-30 transition-opacity`}
                />
                <div className="relative z-10">
                  <div className="text-5xl mb-2">{t.icon}</div>
                  <p className="font-display text-foreground uppercase tracking-wider">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Tempo médio: {t.speed}s</p>
                  {gameActive && team === t.name && (
                    <div className="mt-3 text-yellow-400 animate-pulse">
                      <p className="text-sm font-bold">⏱️ Parada em andamento...</p>
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
                <p className="font-display text-lg text-primary uppercase tracking-wider mb-2">Resultado</p>
                <p className="text-2xl font-bold text-white mb-4">{result}</p>

                {stopTime && targetTime && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Seu Tempo</p>
                      <p className="text-xl font-display text-primary">{stopTime}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Tempo Alvo</p>
                      <p className="text-xl font-display text-yellow-400">{targetTime}s</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setResult("");
                    setStopTime(null);
                    setTargetTime(null);
                    setTeam(null);
                  }}
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Jogar Novamente
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
