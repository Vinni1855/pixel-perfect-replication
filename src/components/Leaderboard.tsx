import { useScrollReveal } from "@/hooks/useScrollReveal";

const drivers = [
  { pos: 1, name: "George Russell", country: "🇬🇧", team: "Mercedes", points: 127 },
  { pos: 2, name: "Lewis Hamilton", country: "🇬🇧", team: "Ferrari", points: 104 },
  { pos: 3, name: "Charles Leclerc", country: "🇲🇨", team: "Ferrari", points: 91 },
  { pos: 4, name: "Kimi Antonelli", country: "🇮🇹", team: "Mercedes", points: 78 },
  { pos: 5, name: "Lando Norris", country: "🇬🇧", team: "McLaren", points: 65 },
];

const constructors = [
  { pos: 1, name: "Mercedes", country: "🇩🇪", points: 205 },
  { pos: 2, name: "Ferrari", country: "🇮🇹", points: 195 },
  { pos: 3, name: "McLaren", country: "🇬🇧", points: 142 },
  { pos: 4, name: "Red Bull Racing", country: "🇦🇹", points: 98 },
  { pos: 5, name: "Aston Martin", country: "🇬🇧", points: 67 },
];

export default function Leaderboard() {
  const ref = useScrollReveal();

  return (
    <div className="space-y-5">
      {/* Constructors Championship */}
      <section ref={ref} className="reveal bg-card rounded-lg border border-border p-5 hover:border-primary/40 transition-colors duration-300">
        <h2 className="font-display text-foreground text-lg uppercase tracking-wide mb-4 font-bold">
          🏭 F1 2026 - Constructors Championship
        </h2>

        <div className="space-y-2.5">
          {constructors.map((constructor) => (
            <div
              key={constructor.pos}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                constructor.pos === 1 ? "bg-primary/15 border border-primary/30" : 
                constructor.pos === 2 ? "bg-secondary/10 border border-secondary/20" :
                constructor.pos === 3 ? "bg-primary/8 border border-primary/20" :
                "bg-muted/40 border border-transparent hover:bg-muted/60"
              }`}
            >
              <span
                className={`font-display text-xl font-black w-8 text-center ${
                  constructor.pos === 1 ? "text-gold" :
                  constructor.pos === 2 ? "text-silver" :
                  constructor.pos === 3 ? "text-tertiary" :
                  "text-muted-foreground"
                }`}
              >
                {constructor.pos}
              </span>
              <span className="text-xl">{constructor.country}</span>
              <span className="text-foreground text-sm font-semibold flex-1">{constructor.name}</span>
              <span className={`font-display font-bold text-sm tabular-nums whitespace-nowrap ${
                constructor.pos <= 3 ? "text-gold text-lg" : "text-foreground"
              }`}>
                {constructor.points} pts
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* <section ref={ref} className="reveal bg-card rounded-lg border border-border p-5 hover:border-primary/40 transition-colors duration-300">
        <h2 className="font-display text-foreground text-lg uppercase tracking-wide mb-4 font-bold">
          🏎️ F1 2026 - Drivers Championship
        </h2>

        <div className="space-y-2.5">
          {drivers.map((driver) => (
            <div
              key={driver.pos}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                driver.pos === 1 ? "bg-primary/15 border border-primary/30" : 
                driver.pos === 2 ? "bg-secondary/10 border border-secondary/20" :
                driver.pos === 3 ? "bg-primary/8 border border-primary/20" :
                "bg-muted/40 border border-transparent hover:bg-muted/60"
              }`}
            >
              <span
                className={`font-display text-xl font-black w-8 text-center ${
                  driver.pos === 1 ? "text-gold" :
                  driver.pos === 2 ? "text-silver" :
                  driver.pos === 3 ? "text-tertiary" :
                  "text-muted-foreground"
                }`}
              >
                {driver.pos}
              </span>
              <span className="text-xl">{driver.country}</span>
              <div className="flex-1 min-w-0">
                <span className="text-foreground text-sm font-semibold block truncate">{driver.name}</span>
                <span className="text-muted-foreground text-xs">{driver.team}</span>
              </div>
              <span className={`font-display font-bold text-sm tabular-nums whitespace-nowrap ${
                driver.pos <= 3 ? "text-gold text-lg" : "text-foreground"
              }`}>
                {driver.points} pts
              </span>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}
