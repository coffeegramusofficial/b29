import { useState, useEffect } from "react";
import { useGameState } from "./lib/stores/useGameState";
import { MainMenu } from "./components/MainMenu";
import { DeckBuilder } from "./components/DeckBuilder";
import { GameBoard } from "./components/GameBoard";
import { GameUI } from "./components/GameUI";
import { BotController } from "./components/BotController";
import { SoundInitializer } from "./components/SoundInitializer";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import "@fontsource/inter";

type GamePhase = "menu" | "deck_building" | "playing" | "game_over";

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("menu");
  const [gameMode, setGameMode] = useState<"bot" | "multiplayer">("bot");
  const { initializeGame, gameState } = useGameState();

  const handleStartGame = (mode: "bot" | "multiplayer") => {
    setGameMode(mode);
    setGamePhase("deck_building");
  };

  const handleDeckBuilt = (whiteGuardDeck: string[], bolshevikDeck: string[]) => {
    initializeGame(whiteGuardDeck, bolshevikDeck, gameMode);
    setGamePhase("playing");
  };

  const handleBackToMenu = () => {
    setGamePhase("menu");
  };

  useEffect(() => {
    if (gameState?.gameOver) {
      setGamePhase("game_over");
    }
  }, [gameState?.gameOver]);

  return (
    <div className="w-full h-screen bg-background overflow-hidden">
      <SoundInitializer />
      
      {gamePhase === "menu" && (
        <MainMenu onStartGame={handleStartGame} />
      )}

      {gamePhase === "deck_building" && (
        <DeckBuilder onDeckBuilt={handleDeckBuilt} onBack={handleBackToMenu} />
      )}

      {gamePhase === "playing" && gameState && (
        <>
          <GameBoard />
          <GameUI />
          {gameMode === "bot" && <BotController />}
        </>
      )}

      {gamePhase === "game_over" && gameState && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
          <Card className="w-96 border-2" data-testid="modal-game-over">
            <CardHeader>
              <CardTitle className={`text-3xl text-center ${
                gameState.winner === "white_guard" ? "text-white-guard" : "text-bolshevik"
              }`}>
                {gameState.winner === "white_guard" ? "Белая Гвардия побеждает!" : "Большевики побеждают!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={handleBackToMenu}
                size="lg"
                className="w-full"
                data-testid="button-back-to-menu"
              >
                Вернуться в меню
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default App;
