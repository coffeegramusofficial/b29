import { useState, useEffect } from "react";
import { useGameState } from "./lib/stores/useGameState";
import { MainMenu } from "./components/MainMenu";
import { DeckBuilder } from "./components/DeckBuilder";
import { GameBoard } from "./components/GameBoard";
import { GameUI } from "./components/GameUI";
import { BotController } from "./components/BotController";
import { SoundInitializer } from "./components/SoundInitializer";
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
    <div className="w-full h-screen bg-gradient-to-br from-red-900 via-gray-800 to-blue-900 overflow-hidden">
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
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {gameState.winner === "white_guard" ? "🔥 Белая Гвардия побеждает!" : "⚔️ Большевики побеждают!"}
            </h2>
            <button
              onClick={handleBackToMenu}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Вернуться в меню
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
