import gamePokerSlots from "@/assets/game-poker-slots.jpg";
import gameRoulette from "@/assets/game-roulette.jpg";
import gameBlackjack from "@/assets/game-blackjack.jpg";
import gameLiveCasino from "@/assets/game-live-casino.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const games = [
  { img: gamePokerSlots, title: "Poker Slots", subtitle: "F1 Red Car", category: "Race Slots" },
  { img: gameRoulette, title: "Roulette Raceway", subtitle: "Wheel & Paddock", category: "Race Slots" },
  { img: gameBlackjack, title: "Blackjack Speedway", subtitle: "Cards & Helmets", category: "Blackjack" },
  { img: gameLiveCasino, title: "Live Casino Grand Prix", subtitle: "Dealer & Track", category: "Live Casino" },
];

export default function HotGames() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="reveal">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-foreground text-xl md:text-2xl uppercase tracking-wide">
          🔥 Hot Games
        </h2>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game, i) => (
          <div
            key={game.title}
            className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 cursor-pointer"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={game.img}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <p className="text-[10px] uppercase tracking-widest text-primary font-medium">{game.category}</p>
              <h3 className="font-display text-foreground text-sm font-semibold mt-0.5 uppercase">{game.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{game.subtitle}</p>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-primary text-primary-foreground font-display uppercase text-xs tracking-wider px-5 py-2.5 rounded-md active:scale-95 transition-transform">
                Play Now
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
