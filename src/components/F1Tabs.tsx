import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// F1 Racing Games - Based on actual game modes
const f1Games = [
  {
    id: 1,
    title: "🎰 Poker Slots: Monaco Speedway",
    category: "Poker Slots",
    odds: "3.8x",
    prize: "R$ 30.000",
    image: "🏰",
    description: "Slots de Poker nas ruas de Mônaco",
    route: "/game/poker-slots",
  },
  {
    id: 2,
    title: "🎡 Roulette Raceway: Pit Lane",
    category: "Roulette",
    odds: "4.2x",
    prize: "R$ 48.000",
    image: "⚙️",
    description: "Roleta de paradas na pit lane",
    route: "/game/roulette-raceway",
  },
  {
    id: 3,
    title: "🎴 Blackjack Speedway: Qualification",
    category: "Blackjack",
    odds: "2.9x",
    prize: "R$ 21.000",
    image: "🏁",
    description: "Blackjack da qualificação",
    route: "/game/blackjack-speedway",
  },
  {
    id: 4,
    title: "💎 Live Casino Grand Prix",
    category: "Live Casino",
    odds: "3.15x",
    prize: "R$ 39.000",
    image: "🎰",
    description: "Casino ao vivo do Grande Prêmio",
    route: "/game/live-casino-grand-prix",
  },
];

// F1 Betting Markets
const bettingMarkets = [
  {
    id: 1,
    title: "Vencedor da Corrida",
    category: "Race Winner",
    driver: "George Russell (Mercedes)",
    odds: "3.20",
    stake: "Min R$ 30",
    flag: "🇬🇧",
  },
  {
    id: 2,
    title: "Pódio Top 3",
    category: "Podium",
    driver: "Kimi Antonelli (Mercedes)",
    odds: "2.15",
    stake: "Min R$ 60",
    flag: "🇮🇹",
  },
  {
    id: 3,
    title: "Volta Mais Rápida",
    category: "Fastest Lap",
    driver: "Charles Leclerc (Ferrari)",
    odds: "4.50",
    stake: "Min R$ 30",
    flag: "🇲🇨",
  },
  {
    id: 4,
    title: "Qualificação P1",
    category: "Pole Position",
    driver: "Lewis Hamilton (Ferrari)",
    odds: "2.85",
    stake: "Min R$ 60",
    flag: "🇬🇧",
  },
  {
    id: 5,
    title: "Campeão 2026",
    category: "Championship",
    driver: "George Russell",
    odds: "5.20",
    stake: "Min R$ 120",
    flag: "🇬🇧",
  },
  {
    id: 6,
    title: "Construtor Campeão",
    category: "Constructor",
    driver: "Mercedes",
    odds: "2.40",
    stake: "Min R$ 90",
    flag: "🇩🇪",
  },
];

// F1 Tournaments
const tournaments = [
  {
    id: 1,
    title: "Grand Prix Masters",
    prize: "R$ 300.000",
    players: "1,824",
    status: "Em Andamento",
    image: "👑",
    description: "Torneio semanal de F1 com bônus progressivos",
  },
  {
    id: 2,
    title: "Qualifying Rush",
    prize: "R$ 150.000",
    players: "892",
    status: "Registrado",
    image: "⚡",
    description: "Competição de qualificação com prêmios em cascata",
  },
  {
    id: 3,
    title: "Pit Stop Challenge",
    prize: "R$ 90.000",
    players: "556",
    status: "Registrado",
    image: "🏁",
    description: "Desafio de velocidade das paradas",
  },
  {
    id: 4,
    title: "Championship Series",
    prize: "R$ 600.000",
    players: "2,451",
    status: "Em Andamento",
    image: "🏆",
    description: "Série de campeonato com 10 etapas",
  },
];

// VIP F1 Experience
const vipExperiences = [
  {
    id: 1,
    title: "VIP Paddock Access",
    benefit: "Acesso à Paddock Club",
    value: "R$ 30.000",
    image: "🎫",
    description: "Ingressos exclusivos para 4 Grandes Prêmios",
  },
  {
    id: 2,
    title: "Meet & Greet",
    benefit: "Conhecer os Pilotos",
    value: "R$ 15.000",
    image: "🤝",
    description: "Encontro exclusivo com pilotos F1",
  },
  {
    id: 3,
    title: "Simulator Championship",
    benefit: "Competição Virtual F1",
    value: "R$ 60.000",
    image: "🎮",
    description: "Campeonato de simulador com prêmios reais",
  },
  {
    id: 4,
    title: "Luxury Trip to Monaco",
    benefit: "Experiência Premium",
    value: "R$ 90.000",
    image: "✈️",
    description: "Viagem 5 estrelas para o GP de Mônaco",
  },
];

export default function F1Tabs() {
  const ref = useScrollReveal();
  const navigate = useNavigate();

  return (
    <div ref={ref} className="reveal space-y-4">
      {/* Section Header */}
      <div className="px-1">
        <h2 className="font-display text-foreground text-xl md:text-2xl uppercase tracking-wide mb-2">
          🏎️ F1 Grand Prix Casino
        </h2>
        <p className="text-muted-foreground text-sm">
          Viva a emoção da Fórmula 1 com slots temáticos, apostas em tempo real e torneios exclusivos
        </p>
      </div>
      
      {/* Tabs Content */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Tabs defaultValue="racing" className="w-full">
          {/* Tabs Header */}
          <TabsList className="w-full rounded-none border-b border-border bg-muted/50 p-0">
            <TabsTrigger
              value="racing"
              className="rounded-none border-r border-border data-[state=active]:bg-background"
            >
              🏎️ F1 Racing
            </TabsTrigger>
            <TabsTrigger
              value="betting"
              className="rounded-none border-r border-border data-[state=active]:bg-background"
            >
              💰 Betting Markets
            </TabsTrigger>
            <TabsTrigger
              value="tournaments"
              className="rounded-none border-r border-border data-[state=active]:bg-background"
            >
              🏆 Tournaments
            </TabsTrigger>
            <TabsTrigger value="vip" className="rounded-none data-[state=active]:bg-background">
              👑 VIP F1 Experience
            </TabsTrigger>
          </TabsList>

          {/* Racing Games Tab */}
          <TabsContent value="racing" className="p-5 space-y-4 m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {f1Games.map((game) => (
              <div
                key={game.id}
                className="group relative bg-muted rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-200 cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-200">
                  {game.image}
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                  <h3 className="font-display font-bold text-white text-lg mb-1">{game.title}</h3>
                  <p className="text-white/80 text-sm">{game.description}</p>
                </div>

                <div className="p-4 border-t border-border bg-background/50">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">{game.category}</Badge>
                    <span className="text-gold font-semibold text-sm">{game.odds}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground text-sm">Prêmio:</span>
                    <span className="text-gold font-display font-bold">{game.prize}</span>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 active:scale-95 transition-transform"
                    onClick={() => navigate(game.route)}
                  >
                    Play Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
          </TabsContent>

          {/* Betting Markets Tab */}
          <TabsContent value="betting" className="p-5 space-y-3 m-0">
          <div className="space-y-3">
            {bettingMarkets.map((market) => (
              <div
                key={market.id}
                className="bg-muted rounded-lg border border-border p-4 hover:border-primary transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{market.flag}</span>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{market.title}</h3>
                      <p className="text-muted-foreground text-sm">{market.driver}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-gold font-display font-bold text-lg">
                      {market.odds}
                    </span>
                    <Badge variant="secondary" className="mt-1">
                      {market.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{market.stake}</span>
                  <Button variant="outline" size="sm">
                    Apostar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          </TabsContent>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="p-5 space-y-4 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-muted rounded-lg border border-border overflow-hidden hover:border-primary transition-colors duration-200"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-7xl">
                  {tournament.image}
                </div>

                <div className="p-4 bg-background/50 border-t border-border space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg">
                      {tournament.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{tournament.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted rounded p-2">
                      <span className="text-xs text-muted-foreground block">Prêmio</span>
                      <span className="text-gold font-display font-bold">{tournament.prize}</span>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <span className="text-xs text-muted-foreground block">Jogadores</span>
                      <span className="font-semibold text-foreground">{tournament.players}</span>
                    </div>
                    <div className="bg-muted rounded p-2">
                      <span className="text-xs text-muted-foreground block">Status</span>
                      <Badge className="text-xs" variant="secondary">
                        {tournament.status}
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">Registrar</Button>
                </div>
              </div>
            ))}
          </div>
          </TabsContent>

          {/* VIP Experience Tab */}
          <TabsContent value="vip" className="p-5 space-y-4 m-0">
          <div className="bg-gradient-to-r from-gold/10 to-primary/10 rounded-lg border border-gold/30 p-4 mb-4">
            <p className="text-foreground text-sm">
              ✨ Experimente o luxo da F1 com nossos pacotes VIP exclusivos. Ganhe pontos a cada
              aposta e resgate pelos melhores prêmios!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vipExperiences.map((experience) => (
              <div
                key={experience.id}
                className="bg-gradient-to-br from-muted to-muted/50 rounded-lg border border-border overflow-hidden hover:border-gold transition-colors duration-200"
              >
                <div className="aspect-video bg-gradient-to-br from-gold/20 to-primary/20 flex items-center justify-center text-6xl">
                  {experience.image}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-foreground">{experience.title}</h3>
                    <p className="text-muted-foreground text-sm">{experience.description}</p>
                  </div>

                  <div className="bg-background/50 rounded p-3 flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">{experience.benefit}</span>
                    <span className="text-gold font-display font-bold text-lg">{experience.value}</span>
                  </div>

                  <Button className="w-full bg-gold hover:bg-gold/90 text-black font-semibold">
                    Resgatar Agora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
