import { useScrollReveal } from "@/hooks/useScrollReveal";

const drivers = [
  { pos: 1, name: "George Russell", country: "🇬🇧", team: "Mercedes", points: 51 },
  { pos: 2, name: "Kimi Antonelli", country: "🇮🇹", team: "Mercedes", points: 47 },
  { pos: 3, name: "Charles Leclerc", country: "🇲🇨", team: "Ferrari", points: 34 },
  { pos: 4, name: "Lewis Hamilton", country: "🇬🇧", team: "Ferrari", points: 33 },
  { pos: 5, name: "Oliver Bearman", country: "🇬🇧", team: "Haas", points: 17 },
];

const constructors = [
  { pos: 1, name: "Mercedes", country: "🇩🇪", points: 98 },
  { pos: 2, name: "Ferrari", country: "🇮🇹", points: 67 },
  { pos: 3, name: "McLaren-Mercedes", country: "🇬🇧", points: 18 },
  { pos: 4, name: "Haas-Ferrari", country: "🇺🇸", points: 17 },
  { pos: 5, name: "Red Bull Racing", country: "🇦🇹", points: 12 },
];

const posColors: Record<number, string> = {
  1: "text-gold",
  2: "text-secondary-foreground",
  3: "text-primary",
};

export default function Leaderboard() {
  const ref = useScrollReveal();

  return (
    <div className="space-y-5">
      {/* Drivers Championship */}
      <section ref={ref} className="reveal bg-card rounded-lg border border-border p-5">
        <h2 className="font-display text-foreground text-xl uppercase tracking-wide mb-4">
          🏎️ F1 2026 - Drivers Championship
        </h2>

        <div className="space-y-2">
          {drivers.map((driver) => (
            <div
              key={driver.pos}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 hover:bg-muted/50 ${
                driver.pos <= 3 ? "bg-muted/30" : ""
              }`}
            >
              <span
                className={`font-display text-lg font-bold w-8 text-center ${
                  posColors[driver.pos] || "text-muted-foreground"
                }`}
              >
                {driver.pos}
              </span>
              <span className="text-lg">{driver.country}</span>
              <div className="flex-1">
                <span className="text-foreground text-sm font-medium block">{driver.name}</span>
                <span className="text-muted-foreground text-xs">{driver.team}</span>
              </div>
              <span className="text-gold font-display font-semibold text-sm tabular-nums">
                {driver.points} pts
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Constructors Championship */}
      <section ref={ref} className="reveal bg-card rounded-lg border border-border p-5">
        <h2 className="font-display text-foreground text-xl uppercase tracking-wide mb-4">
          🏭 F1 2026 - Constructors Championship
        </h2>

        <div className="space-y-2">
          {constructors.map((constructor) => (
            <div
              key={constructor.pos}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-150 hover:bg-muted/50 ${
                constructor.pos <= 3 ? "bg-muted/30" : ""
              }`}
            >
              <span
                className={`font-display text-lg font-bold w-8 text-center ${
                  posColors[constructor.pos] || "text-muted-foreground"
                }`}
              >
                {constructor.pos}
              </span>
              <span className="text-lg">{constructor.country}</span>
              <span className="text-foreground text-sm font-medium flex-1">{constructor.name}</span>
              <span className="text-gold font-display font-semibold text-sm tabular-nums">
                {constructor.points} pts
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
