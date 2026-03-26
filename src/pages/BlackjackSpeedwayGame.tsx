import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

interface Card {
  suit: string;
  value: string;
}

export default function BlackjackSpeedwayGame() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [result, setResult] = useState("");
  const [muted, setMuted] = useState(false);

  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  const getCardValue = (card: Card): number => {
    if (["J", "Q", "K"].includes(card.value)) return 10;
    if (card.value === "A") return 11;
    return parseInt(card.value);
  };

  const calculateTotal = (cards: Card[]): number => {
    let total = cards.reduce((sum, card) => sum + getCardValue(card), 0);
    const aces = cards.filter((c) => c.value === "A").length;
    while (total > 21 && aces > 0) {
      total -= 10;
    }
    return total;
  };

  const getRandomCard = (): Card => {
    return {
      suit: suits[Math.floor(Math.random() * suits.length)],
      value: values[Math.floor(Math.random() * values.length)],
    };
  };

  const startGame = () => {
    if (balance < bet) {
      setResult("Saldo insuficiente!");
      return;
    }

    setBalance(balance - bet);
    const newPlayerCards = [getRandomCard(), getRandomCard()];
    const newDealerCards = [getRandomCard(), getRandomCard()];

    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setGameStarted(true);
    setResult("");
  };

  const hit = () => {
    const newCards = [...playerCards, getRandomCard()];
    setPlayerCards(newCards);

    const total = calculateTotal(newCards);
    if (total > 21) {
      setResult("💥 Esourou! Dealer Vence!");
      setGameStarted(false);
    }
  };

  const stand = () => {
    let dealerCards_ = [...dealerCards];
    while (calculateTotal(dealerCards_) < 17) {
      dealerCards_.push(getRandomCard());
    }

    const playerTotal = calculateTotal(playerCards);
    const dealerTotal = calculateTotal(dealerCards_);

    setDealerCards(dealerCards_);

    if (dealerTotal > 21) {
      const winAmount = bet * 2;
      setBalance((prev) => prev + winAmount);
      setResult(`🎉 DEALER ESOUROU! Você venceu! +€${winAmount}`);
    } else if (playerTotal > dealerTotal) {
      const winAmount = bet * 2;
      setBalance((prev) => prev + winAmount);
      setResult(`🎉 Você venceu! ${playerTotal} vs ${dealerTotal}! +€${winAmount}`);
    } else if (playerTotal === dealerTotal) {
      setBalance((prev) => prev + bet);
      setResult(`🤝 Empate! +€${bet} restituído`);
    } else {
      setResult(`❌ Dealer venceu! ${dealerTotal} vs ${playerTotal}`);
    }

    setGameStarted(false);
  };

  const playerTotal = calculateTotal(playerCards);
  const dealerTotal = calculateTotal(dealerCards);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-16 md:ml-56 transition-[margin] duration-300">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-40">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Lobby
          </Button>
          <button
            onClick={() => setMuted(!muted)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </header>

        {/* Game Content */}
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl uppercase tracking-wider text-foreground">
              🎴 Blackjack Speedway - Cards & Helmets
            </h1>
            <p className="text-muted-foreground">Chegue a 21 e vença o Dealer!</p>
          </div>

          {/* Game Board */}
          <div className="bg-gradient-to-b from-green-900/20 to-black/40 rounded-xl border-2 border-gold p-8 space-y-6">
            {/* Dealer Cards */}
            <div>
              <p className="text-muted-foreground text-sm mb-3">🎰 Cartas do Dealer:</p>
              <div className="flex gap-4">
                {dealerCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-28 bg-gradient-to-br from-white to-gray-200 border-2 border-gold rounded-lg flex flex-col items-center justify-center text-center font-display font-bold"
                  >
                    <span className="text-2xl">{card.suit}</span>
                    <span className="text-xl text-black">{card.value}</span>
                  </div>
                ))}
              </div>
              {gameStarted && (
                <p className="text-muted-foreground text-sm mt-2">Total: ?</p>
              )}
              {!gameStarted && dealerCards.length > 0 && (
                <p className="text-gold font-semibold mt-2">Dealer Total: {dealerTotal}</p>
              )}
            </div>

            {/* Player Cards */}
            <div>
              <p className="text-muted-foreground text-sm mb-3">🏎️ Suas Cartas:</p>
              <div className="flex gap-4 mb-3">
                {playerCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-28 bg-gradient-to-br from-red-600 to-red-800 border-2 border-gold rounded-lg flex flex-col items-center justify-center text-center font-display font-bold text-white"
                  >
                    <span className="text-2xl">{card.suit}</span>
                    <span className="text-xl">{card.value}</span>
                  </div>
                ))}
              </div>
              {playerCards.length > 0 && (
                <p className="text-gold font-semibold">Seu Total: {playerTotal}</p>
              )}
            </div>

            {/* Result Display */}
            {result && (
              <div className="text-center">
                <p
                  className={`text-2xl font-display font-bold ${
                    result.includes("🎉") ? "text-gold" : "text-orange-500"
                  }`}
                >
                  {result}
                </p>
              </div>
            )}

            {/* Bet Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-background/50 rounded-lg p-4">
                <span className="text-muted-foreground">Aposta Atual:</span>
                <span className="text-gold font-display text-2xl font-bold">€{bet}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant={bet === amount ? "default" : "outline"}
                    onClick={() => setBet(amount)}
                    disabled={gameStarted}
                  >
                    €{amount}
                  </Button>
                ))}
              </div>

              <div className="flex gap-3">
                {!gameStarted && playerCards.length === 0 && (
                  <Button
                    onClick={startGame}
                    className="flex-1 h-14 bg-gold hover:bg-gold/90 text-black font-display text-lg font-bold"
                  >
                    🎰 Começar Jogo
                  </Button>
                )}

                {gameStarted && (
                  <>
                    <Button
                      onClick={hit}
                      disabled={playerTotal >= 21}
                      className="flex-1 h-14 bg-primary hover:bg-primary/90 font-display text-lg font-bold"
                    >
                      Hit
                    </Button>
                    <Button
                      onClick={stand}
                      className="flex-1 h-14 bg-green-600 hover:bg-green-700 font-display text-lg font-bold"
                    >
                      Stand
                    </Button>
                  </>
                )}

                {!gameStarted && playerCards.length > 0 && (
                  <Button
                    onClick={() => {
                      setPlayerCards([]);
                      setDealerCards([]);
                      setResult("");
                    }}
                    className="flex-1 h-14 bg-gold hover:bg-gold/90 text-black font-display text-lg font-bold"
                  >
                    Nova Rodada
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">Saldo Disponível</span>
              <span className="text-gold font-display text-3xl font-bold">€{balance}</span>
            </div>
            <div className="bg-background rounded-lg border border-border p-4">
              <span className="text-muted-foreground block text-sm mb-1">RTP (Retorno)</span>
              <span className="text-primary font-display text-3xl font-bold">96%</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
            <h3 className="font-display font-bold text-red-400">Regras:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Chegue a 21 ou perto disso sem estourar</li>
              <li>✓ Vencer = 2x sua aposta | Empate = Devolução</li>
              <li>✓ Esourar (&gt;21) = Derrota automática</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
