import { ChevronLeft, ChevronRight, Wallet, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import TransactionHistory from "@/components/TransactionHistory";
import gameBlackjack from "@/assets/game-blackjack.jpg";
import gameLiveCasino from "@/assets/game-live-casino.jpg";

const games = [
  {
    img: gameBlackjack,
    title: "Blackjack",
    emoji: "🎴",
    subtitle: "Speedway",
    route: "/game/blackjack-speedway",
  },
  {
    img: gameLiveCasino,
    title: "Live Casino",
    emoji: "💎",
    subtitle: "Grand Prix",
    route: "/game/live-casino-grand-prix",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const navigate = useNavigate();
  const { balance } = useWallet();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar z-50 border-r border-sidebar-border flex flex-col transition-[width] duration-300 ease-out ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
          <span className="font-display text-primary-foreground text-sm font-bold">GP</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-display text-foreground text-sm font-bold tracking-wide whitespace-nowrap">
              GRAND PRIX
            </span>
            <span className="block text-gold text-[10px] font-medium tracking-widest uppercase">
              Casino
            </span>
          </div>
        )}
      </div>

      {/* Balance */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Balance</p>
            <p className="text-gold font-display text-lg font-bold">R$ {balance.toFixed(2)}</p>
          </div>
          
          {/* Wallet Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setDepositOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gold/10 hover:bg-gold/20 text-gold rounded-md text-xs font-semibold transition-all duration-200 active:scale-[0.95]"
            >
              <span>+</span>
              <span className="hidden sm:inline">Depositar</span>
            </button>
            <button
              onClick={() => setWithdrawOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-xs font-semibold transition-all duration-200 active:scale-[0.95]"
            >
              <span>-</span>
              <span className="hidden sm:inline">Sacar</span>
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-md text-xs font-semibold transition-all duration-200 active:scale-[0.95]"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </button>
          </div>
        </div>
      )}

      {/* Games */}
      <nav className="flex-1 py-3 space-y-2 overflow-y-auto px-2">
        {games.map((game) => (
          <button
            key={game.title}
            onClick={() => navigate(game.route)}
            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-150 active:scale-[0.97] group"
          >
            <div className="w-10 h-10 rounded overflow-hidden shrink-0 group-hover:shadow-md group-hover:shadow-primary/30 transition-shadow">
              <img src={game.img} alt={game.title} className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-semibold text-sidebar-foreground truncate">{game.emoji} {game.title}</div>
                <div className="text-xs text-sidebar-foreground/60 truncate">{game.subtitle}</div>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 border-t border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Modals */}
      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <TransactionHistory open={historyOpen} onOpenChange={setHistoryOpen} />
    </aside>
  );
}
