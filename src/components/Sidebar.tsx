import { Home, Gamepad2, Radio, Gift, Trophy, Crown, Link, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Gamepad2, label: "Race Slots" },
  { icon: Radio, label: "Live Casino" },
  { icon: Gift, label: "Promotions" },
  { icon: Trophy, label: "Tournaments" },
  { icon: Crown, label: "VIP Club" },
  { icon: Link, label: "Quick Links" },
  { icon: FileText, label: "Log" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Balance</p>
          <p className="text-gold font-display text-lg font-bold">€2,847.50</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto px-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm transition-colors duration-150 active:scale-[0.97] ${
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon size={18} className={item.active ? "text-primary" : ""} />
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
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
    </aside>
  );
}
