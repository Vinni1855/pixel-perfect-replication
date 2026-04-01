import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX, Trash2, TrendingUp, Clock, Award, AlertCircle, BarChart3 } from "lucide-react";

interface BetSelection {
  id: string;
  market: BettingMarket;
  amount: number;
  potentialWin: number;
}

interface Bet {
  id: string;
  selections: BetSelection[];
  betType: "simple" | "combined" | "system";
  totalStake: number;
  totalOdds: number;
  potentialWin: number;
  status: "pending" | "won" | "lost" | "partial";
  result?: string;
  createdAt: Date;
  message?: string;
}

interface BettingMarket {
  id: string;
  title: string;
  category: string;
  option: string;
  odds: number;
  minStake: number;
  icon: string;
  live: boolean;
  hotBet: boolean;
}

interface PlayerStats {
  totalBets: number;
  wonBets: number;
  totalStaked: number;
  totalWon: number;
  winRate: number;
}

const bettingMarkets: BettingMarket[] = [
  {
    id: "m1",
    title: "Vencedor da Corrida",
    category: "Race Winner",
    option: "George Russell (Mercedes)",
    odds: 3.2,
    minStake: 30,
    icon: "🇬🇧",
    live: true,
    hotBet: true,
  },
  {
    id: "m2",
    title: "Pódio Top 3",
    category: "Podium",
    option: "Kimi Antonelli (Mercedes)",
    odds: 2.15,
    minStake: 60,
    icon: "🏁",
    live: true,
    hotBet: false,
  },
  {
    id: "m3",
    title: "Volta Mais Rápida",
    category: "Fastest Lap",
    option: "Charles Leclerc (Ferrari)",
    odds: 4.5,
    minStake: 30,
    icon: "⚡",
    live: true,
    hotBet: true,
  },
  {
    id: "m4",
    title: "Qualificação P1",
    category: "Pole Position",
    option: "Lewis Hamilton (Ferrari)",
    odds: 2.85,
    minStake: 60,
    icon: "🇬🇧",
    live: false,
    hotBet: false,
  },
  {
    id: "m5",
    title: "Campeão 2026",
    category: "Championship",
    option: "George Russell",
    odds: 5.2,
    minStake: 120,
    icon: "👑",
    live: false,
    hotBet: true,
  },
  {
    id: "m6",
    title: "Construtor Campeão",
    category: "Constructor",
    option: "Mercedes",
    odds: 2.4,
    minStake: 90,
    icon: "🏆",
    live: false,
    hotBet: false,
  },
  {
    id: "m7",
    title: "Top 5 Finalizadores",
    category: "Top 5",
    option: "Carlos Sainz (Ferrari)",
    odds: 1.85,
    minStake: 50,
    icon: "🎯",
    live: true,
    hotBet: false,
  },
  {
    id: "m8",
    title: "Primeiro Abandono",
    category: "First DNF",
    option: "Oscar Piastri (McLaren)",
    odds: 6.5,
    minStake: 40,
    icon: "🚫",
    live: true,
    hotBet: false,
  },
];

export default function BettingMarketsGame() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(50000);
  const [muted, setMuted] = useState(false);
  const [betSelections, setBetSelections] = useState<BetSelection[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<BettingMarket | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [betType, setBetType] = useState<"simple" | "combined" | "system">("simple");
  const [showBetslip, setShowBetslip] = useState(false);
  const [processingBet, setProcessingBet] = useState(false);
  const [betResult, setBetResult] = useState<Bet | null>(null);
  const [betHistory, setBetHistory] = useState<Bet[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const totalOdds = betSelections.length > 0 
    ? betSelections.reduce((acc, sel) => acc * sel.market.odds, 1).toFixed(2) 
    : "1.00";
  const totalStake = betSelections.reduce((acc, sel) => acc + sel.amount, 0);
  const potentialWin = Math.floor(totalStake * parseFloat(totalOdds));

  // Calculate player stats
  const playerStats: PlayerStats = {
    totalBets: betHistory.length,
    wonBets: betHistory.filter(b => b.status === "won").length,
    totalStaked: betHistory.reduce((acc, b) => acc + b.totalStake, 0),
    totalWon: betHistory.reduce((acc, b) => acc + (b.status === "won" ? b.potentialWin : 0), 0),
    winRate: betHistory.length > 0 ? Math.round((betHistory.filter(b => b.status === "won").length / betHistory.length) * 100) : 0,
  };

  const handleSelectMarket = (market: BettingMarket) => {
    setSelectedMarket(market);
    setBetAmount("");
    setShowBetslip(true);
  };

  const handleAddSelection = () => {
    if (!selectedMarket || !betAmount || isNaN(Number(betAmount))) {
      alert("Insira um valor de aposta válido");
      return;
    }

    const amount = Number(betAmount);
    if (amount < selectedMarket.minStake) {
      alert(`Aposta mínima: R$ ${selectedMarket.minStake}`);
      return;
    }

    if (amount > balance) {
      alert("Saldo insuficiente");
      return;
    }

    const newSelection: BetSelection = {
      id: Date.now().toString(),
      market: selectedMarket,
      amount,
      potentialWin: amount * selectedMarket.odds,
    };

    setBetSelections([...betSelections, newSelection]);
    setSelectedMarket(null);
    setBetAmount("");
    setShowBetslip(false);
  };

  const handleRemoveSelection = (id: string) => {
    setBetSelections(betSelections.filter((sel) => sel.id !== id));
  };

  const handlePlaceBet = () => {
    if (betSelections.length === 0) {
      alert("Adicione pelo menos uma seleção");
      return;
    }

    if (totalStake > balance) {
      alert("Saldo insuficiente para essa aposta");
      return;
    }

    setProcessingBet(true);
    setBalance(balance - totalStake);

    setTimeout(() => {
      // Simula resultado baseado em odds (odds menores = maiores chances)
      const results = betSelections.map((sel) => {
        const winChance = Math.min(1 / sel.market.odds, 0.85);
        return Math.random() < winChance;
      });

      let status: "won" | "lost" | "partial" = "lost";
      const wonCount = results.filter((r) => r).length;

      if (wonCount === betSelections.length) {
        status = "won";
        const earnings = potentialWin;
        setBalance((prev) => prev + earnings);
      } else if (wonCount > 0 && betSelections.length > 1) {
        status = "partial";
        const partialWin = Math.floor(totalStake * 0.5);
        setBalance((prev) => prev + partialWin);
      }

      const newBet: Bet = {
        id: Date.now().toString(),
        selections: betSelections,
        betType,
        totalStake,
        totalOdds: parseFloat(totalOdds),
        potentialWin,
        status,
        createdAt: new Date(),
        message: 
          status === "won" 
            ? `🎉 VOCÊ GANHOU +R$ ${potentialWin}! Parabéns!`
            : status === "partial"
            ? `⚠️ Aposta Parcial +R$ ${Math.floor(totalStake * 0.5)}`
            : `❌ Aposta não venceu. Tente novamente!`,
      };

      setBetResult(newBet);
      setBets([...bets, newBet]);
      setBetHistory([...betHistory, newBet]);
      setBetSelections([]);
      setProcessingBet(false);
    }, 2500);
  };

  const clearSlip = () => {
    setBetSelections([]);
    setBetResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <Sidebar />

      <main className="ml-16 md:ml-56 transition-[margin] duration-300">
        {/* Header Sticky */}
        <header className="h-16 border-b border-amber-500/30 flex items-center justify-between px-6 sticky top-0 bg-black/60 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-amber-400 hover:text-amber-300 transition-colors active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-display text-amber-400 text-sm uppercase tracking-widest font-bold">
              💰 F1 Betting Markets Pro
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="text-amber-400 hover:text-amber-300 transition-colors text-sm flex items-center gap-2 px-3 py-1 rounded border border-amber-400/30 hover:border-amber-400 "
            >
              <Clock size={16} />
              Histórico
            </button>
            <button onClick={() => setMuted(!muted)} className="text-amber-400 hover:text-amber-300 transition-colors">
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-xl p-6 mb-6 border border-amber-500/40 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-amber-400/70 text-xs uppercase tracking-wider font-semibold">Saldo</p>
                <p className="font-display text-2xl md:text-3xl text-amber-300 mt-1">R$ {balance.toLocaleString()}</p>
              </div>
              <div className="border-l border-amber-500/20 pl-4">
                <p className="text-amber-400/70 text-xs uppercase tracking-wider font-semibold">Seleções</p>
                <p className="font-display text-2xl md:text-3xl text-blue-300 mt-1">{betSelections.length}</p>
              </div>
              <div className="border-l border-amber-500/20 pl-4">
                <p className="text-amber-400/70 text-xs uppercase tracking-wider font-semibold">Total Apostado</p>
                <p className="font-display text-2xl md:text-3xl text-orange-300 mt-1">R$ {totalStake.toLocaleString()}</p>
              </div>
              <div className="border-l border-amber-500/20 pl-4">
                <p className="text-amber-400/70 text-xs uppercase tracking-wider font-semibold">Possível Ganho</p>
                <p className="font-display text-2xl md:text-3xl text-green-400 mt-1">R$ {potentialWin.toLocaleString()}</p>
              </div>
              <div className="border-l border-amber-500/20 pl-4">
                <p className="text-amber-400/70 text-xs uppercase tracking-wider font-semibold">Taxa de Vitória</p>
                <p className="font-display text-2xl md:text-3xl text-violet-400 mt-1">{playerStats.winRate}%</p>
              </div>
            </div>
          </div>

          {!showHistory ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Markets Grid */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-display text-amber-400 text-lg uppercase tracking-wider font-bold">
                    Mercados Disponíveis
                  </h3>
                  <span className="text-xs text-amber-400/60">({bettingMarkets.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bettingMarkets.map((market) => (
                    <div
                      key={market.id}
                      onClick={() => handleSelectMarket(market)}
                      className="group cursor-pointer relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/20 group-hover:to-transparent rounded-lg transition-all duration-300" />
                      <div className={`relative bg-slate-800/60 border rounded-lg p-4 transition-all duration-300 ${
                        market.live ? "border-green-500/50 hover:border-green-400" : "border-amber-500/30 hover:border-amber-400"
                      } group-hover:bg-slate-800/80 backdrop-blur-sm`}>
                        
                        {/* Hot Bet Badge */}
                        {market.hotBet && (
                          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            🔥 HOT
                          </div>
                        )}

                        {/* Live Badge */}
                        {market.live && (
                          <div className="absolute top-2 right-2 animate-pulse bg-green-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full" />
                            AO VIVO
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-3xl">{market.icon}</span>
                            <div>
                              <p className="font-display font-bold text-amber-300 uppercase text-xs">
                                {market.title}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">{market.option}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-xl font-bold text-amber-400">{market.odds}x</p>
                            <p className="text-xs text-slate-500 mt-1">Odds</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-semibold">
                            {market.category}
                          </span>
                          <span className="text-slate-400">
                            Min: R$ {market.minStake}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Betslip */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 rounded-xl border border-amber-500/40 overflow-hidden sticky top-24 backdrop-blur-sm">
                  
                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-b border-amber-500/30 p-4">
                    <h4 className="font-display text-amber-400 font-bold uppercase tracking-wider text-sm">
                      🎟️ Seu Betslip
                    </h4>
                    <p className="text-xs text-amber-400/60 mt-1">
                      {betSelections.length} seleção(ões) • {betType === "simple" ? "Simples" : "Combinada"}
                    </p>
                  </div>

                  {/* Selections */}
                  <div className="p-4 space-y-2 max-h-[320px] overflow-y-auto">
                    {betSelections.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle size={28} className="text-amber-400/60 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">
                          Clique em um mercado para adicionar
                        </p>
                      </div>
                    ) : (
                      betSelections.map((sel) => (
                        <div key={sel.id} className="bg-slate-700/50 border border-amber-500/20 rounded p-3 text-sm group hover:bg-slate-700 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-bold text-amber-300 text-xs uppercase">
                                {sel.market.title}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">{sel.market.option}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveSelection(sel.id)}
                              className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex justify-between text-xs pt-2 border-t border-slate-600/50">
                            <span className="text-amber-400 font-bold">{sel.market.odds}x</span>
                            <span className="text-green-400">R$ {sel.potentialWin.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Bet Type Selection */}
                  {betSelections.length > 0 && (
                    <div className="border-t border-amber-500/20 p-4 space-y-2">
                      <p className="text-xs text-amber-400 font-semibold uppercase">Tipo de Aposta</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setBetType("simple")}
                          className={`text-xs py-2 px-3 rounded font-semibold transition-all uppercase tracking-wider ${
                            betType === "simple"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-700 text-amber-400 hover:bg-slate-600"
                          }`}
                        >
                          Simples
                        </button>
                        <button
                          onClick={() => setBetType("combined")}
                          className={`text-xs py-2 px-3 rounded font-semibold transition-all uppercase tracking-wider ${
                            betType === "combined"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-700 text-amber-400 hover:bg-slate-600"
                          }`}
                        >
                          Combinada
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bet Amount Input */}
                  {showBetslip && selectedMarket && (
                    <div className="border-t border-amber-500/20 p-4 bg-slate-900/50 space-y-3">
                      <div>
                        <label className="text-xs text-amber-400 uppercase tracking-wider font-semibold block mb-2">
                          Valor da Aposta (Min: R$ {selectedMarket.minStake})
                        </label>
                        <input
                          autoFocus
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          placeholder="R$ 0"
                          className="w-full bg-slate-800 border border-amber-500/30 rounded px-3 py-2 text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[50, 100, 500, 1000].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setBetAmount(amount.toString())}
                            disabled={amount > balance}
                            className="text-xs py-1.5 px-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-amber-400"
                          >
                            R$ {amount.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddSelection}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase"
                        >
                          Adicionar
                        </Button>
                        <Button
                          onClick={() => setShowBetslip(false)}
                          variant="outline"
                          className="flex-1 text-xs font-bold"
                        >
                          Fechar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  {betSelections.length > 0 && (
                    <div className="border-t border-amber-500/20 p-4 space-y-3 bg-slate-800/40">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Odds:</span>
                          <span className="font-display font-bold text-amber-400">{totalOdds}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Apostado:</span>
                          <span className="font-bold text-orange-400">R$ {totalStake.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-amber-500/20 pt-2">
                          <span className="text-slate-400">Possível Ganho:</span>
                          <span className="font-display font-bold text-green-400">
                            R$ {potentialWin.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={handlePlaceBet}
                        disabled={processingBet || totalStake > balance}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider disabled:opacity-50"
                      >
                        {processingBet ? "⏳ Processando..." : "🎰 Confirmar"}
                      </Button>

                      <Button
                        onClick={clearSlip}
                        variant="outline"
                        className="w-full text-xs text-amber-400"
                      >
                        Limpar Betslip
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* History View */
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/60 border border-amber-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-amber-400/70 text-xs uppercase tracking-wider font-semibold">Total de Apostas</p>
                  <p className="font-display text-2xl text-amber-300 mt-2">{playerStats.totalBets}</p>
                </div>
                <div className="bg-slate-800/60 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-green-400/70 text-xs uppercase tracking-wider font-semibold">Apostas Vencidas</p>
                  <p className="font-display text-2xl text-green-400 mt-2">{playerStats.wonBets}</p>
                </div>
                <div className="bg-slate-800/60 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-blue-400/70 text-xs uppercase tracking-wider font-semibold">Total Apostado</p>
                  <p className="font-display text-2xl text-blue-300 mt-2">R$ {playerStats.totalStaked.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/60 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-purple-400/70 text-xs uppercase tracking-wider font-semibold">Total Ganho</p>
                  <p className="font-display text-2xl text-purple-400 mt-2">R$ {playerStats.totalWon.toLocaleString()}</p>
                </div>
              </div>

              <h3 className="font-display text-amber-400 text-lg uppercase tracking-wider font-bold mb-4">
                📜 Histórico de Apostas
              </h3>
              {betHistory.length === 0 ? (
                <div className="bg-slate-800/60 border border-amber-500/30 rounded-lg p-8 text-center">
                  <p className="text-slate-400">Sem apostas no histórico</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {betHistory.map((bet) => (
                    <div
                      key={bet.id}
                      className={`p-4 rounded-lg border-2 backdrop-blur-sm ${
                        bet.status === "won"
                          ? "border-green-500/50 bg-green-500/10"
                          : bet.status === "partial"
                          ? "border-yellow-500/50 bg-yellow-500/10"
                          : "border-red-500/50 bg-red-500/10"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-amber-300 uppercase text-sm">
                            {bet.betType === "simple" ? "Aposta Simples" : "Aposta Combinada"} • {bet.selections.length} seleção(ões)
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {bet.createdAt.toLocaleTimeString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold text-sm ${
                              bet.status === "won"
                                ? "text-green-400"
                                : bet.status === "partial"
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {bet.status === "won" ? "✅ Vencida" : bet.status === "partial" ? "⚠️ Parcial" : "❌ Perdida"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 text-sm">
                        <div>
                          <p className="text-slate-400 text-xs">Apostado</p>
                          <p className="font-bold text-amber-300 mt-1">R$ {bet.totalStake.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Odds</p>
                          <p className="font-bold text-amber-400 mt-1">{bet.totalOdds.toFixed(2)}x</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Possível</p>
                          <p className="font-bold text-green-400 mt-1">R$ {bet.potentialWin.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Mensagem</p>
                          <p className="font-bold text-amber-300/80 mt-1 text-xs">{bet.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Result Modal */}
          {betResult && !showHistory && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-8 border-2 border-amber-500/50 max-w-md w-full mx-4">
                <div className={`text-center ${
                  betResult.status === "won"
                    ? "text-green-400"
                    : betResult.status === "partial"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}>
                  <p className="font-display text-3xl font-bold mb-4">{betResult.message}</p>

                  <div className="grid grid-cols-2 gap-3 my-6 text-sm">
                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-slate-400 text-xs mb-1">Apostado</p>
                      <p className="font-bold text-amber-300">R$ {betResult.totalStake.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-slate-400 text-xs mb-1">Odds</p>
                      <p className="font-bold text-amber-400">{betResult.totalOdds.toFixed(2)}x</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setBetResult(null)}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase"
                    >
                      Novas Apostas
                    </Button>
                    <Button
                      onClick={() => navigate("/")}
                      variant="outline"
                      className="text-amber-400"
                    >
                      Voltar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-slate-500 mt-12 mb-4">
            <p>⚠️ Jogue com responsabilidade. Apenas maiores de 18+</p>
          </div>
        </div>
      </main>
    </div>
  );
}
