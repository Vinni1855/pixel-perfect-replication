import { useScrollReveal } from "@/hooks/useScrollReveal";

const leaders = [
  { pos: 1, name: "TurboMax_88", country: "🇩🇪", amount: "€12,430" },
  { pos: 2, name: "SpeedQueen", country: "🇧🇷", amount: "€9,812" },
  { pos: 3, name: "NightRacer", country: "🇬🇧", amount: "€7,654" },
  { pos: 4, name: "LuckyPit", country: "🇮🇹", amount: "€5,290" },
  { pos: 5, name: "Apex_Hunter", country: "🇪🇸", amount: "€4,103" },
];

const posColors: Record<number, string> = {
  1: "text-gold",
  2: "text-secondary-foreground",
  3: "text-primary",
};

export default function Leaderboard() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="reveal bg-card rounded-lg border border-border p-5">
      <h2 className="font-display text-foreground text-xl uppercase tracking-wide mb-4">
        🏁 Current Race Leaders
      </h2>

      <div className="space-y-2">
        {leaders.map((leader) => (
          <div
            key={leader.pos}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 hover:bg-muted/50 ${
              leader.pos <= 3 ? "bg-muted/30" : ""
            }`}
          >
            <span
              className={`font-display text-lg font-bold w-8 text-center ${
                posColors[leader.pos] || "text-muted-foreground"
              }`}
            >
              {leader.pos}
            </span>
            <span className="text-lg">{leader.country}</span>
            <span className="text-foreground text-sm font-medium flex-1">{leader.name}</span>
            <span className="text-gold font-display font-semibold text-sm tabular-nums">
              {leader.amount}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
