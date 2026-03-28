import { useNavigate } from "react-router-dom";
import gamePokerSlots from "@/assets/game-poker-slots.jpg";
import gameRoulette from "@/assets/game-roulette.jpg";
import gameBlackjack from "@/assets/game-blackjack.jpg";
import gameLiveCasino from "@/assets/game-live-casino.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const games = [
  {
    img: gamePokerSlots,
    title: "🎰 Poker Slots: Monaco",
    subtitle: "F1 Racing Slots",
    category: "Poker Slots",
    route: "/game/poker-slots",
  },
  {
    img: gameRoulette,
    title: "🎡 Roulette Raceway",
    subtitle: "Pit Lane Edition",
    category: "Live Roulette",
    route: "/game/roulette-raceway",
  },
  {
    img: gameBlackjack,
    title: "🎴 Blackjack Speedway",
    subtitle: "Qualifying Round",
    category: "Blackjack",
    route: "/game/blackjack-speedway",
  },
  {
    img: gameLiveCasino,
    title: "💎 Live Casino Grand Prix",
    subtitle: "Premium Experience",
    category: "Live Casino",
    route: "/game/live-casino-grand-prix",
  },
];

export default function HotGames() {
  const ref = useScrollReveal();
  const navigate = useNavigate();

  const handlePlayGame = (route: string) => {
    navigate(route);
  };

  return (
    <section ref={ref} className="reveal">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-foreground text-xl md:text-2xl uppercase tracking-wide">
          🏁 Hot Games - F1 Edition
        </h2>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game, i) => (
          <div
            key={game.title}
            className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/60 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/20"
            style={{ transitionDelay: `${i * 60}ms` }}
            onClick={() => handlePlayGame(game.route)}
          >
            <div className="aspect-square overflow-hidden relative">
              <img
                src={game.img}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* F1 Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-3 relative z-10">
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{game.category}</p>
              <h3 className="font-display text-foreground text-sm font-semibold mt-0.5 uppercase">{game.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{game.subtitle}</p>
            </div>

            {/* Hover overlay with button */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="bg-primary text-primary-foreground font-display uppercase text-xs tracking-wider px-5 py-2.5 rounded-md active:scale-95 transition-transform hover:bg-primary/90">
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
