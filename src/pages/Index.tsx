import Sidebar from "@/components/Sidebar";
import HeroBanner from "@/components/HeroBanner";
import HotGames from "@/components/HotGames";
import Leaderboard from "@/components/Leaderboard";
import Promotions from "@/components/Promotions";
import F1Tabs from "@/components/F1Tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main content area — offset for sidebar */}
      <main className="ml-16 md:ml-56 transition-[margin] duration-300">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-foreground text-sm uppercase tracking-widest">
              Lobby
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors active:scale-95">
              Log In
            </button>
            <button className="bg-primary text-primary-foreground font-display uppercase text-xs tracking-wider px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]">
              Sign Up
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-8 max-w-[1200px]">
          <HeroBanner />
          <HotGames />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Promotions />
            </div>
            <div>
              <Leaderboard />
            </div>
          </div>

          <F1Tabs />

          {/* Footer */}
          <footer className="border-t border-border pt-6 pb-8 text-center">
            <p className="text-muted-foreground text-xs">
              © 2026 Grand Prix Casino. All rights reserved. 18+ Only. Gamble responsibly.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
