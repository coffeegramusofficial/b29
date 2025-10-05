import { useGameState } from "../lib/stores/useGameState";
import { Card } from "./Card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SoundToggle } from "./SoundToggle";
import { useState } from "react";

export function GameUI() {
  const { gameState, endTurn, playCard, applyBonus } = useGameState();
  const [selectedBonusCard, setSelectedBonusCard] = useState<string | null>(null);
  const [selectedTargetCard, setSelectedTargetCard] = useState<string | null>(null);

  if (!gameState) return null;

  const currentHand = gameState.currentPlayer === "white_guard" 
    ? gameState.whiteGuardHand 
    : gameState.bolshevikHand;

  const currentSupply = gameState.currentPlayer === "white_guard" 
    ? gameState.whiteGuardSupply 
    : gameState.bolshevikSupply;

  const currentField = gameState.currentPlayer === "white_guard" 
    ? gameState.whiteGuardField 
    : gameState.bolshevikField;

  const handleCardPlay = (cardId: string) => {
    const card = currentHand.find(c => c.id === cardId);
    if (!card) return;

    if (card.type === "unit") {
      playCard(cardId);
    } else if (card.type === "bonus") {
      if (selectedBonusCard === cardId) {
        setSelectedBonusCard(null);
      } else {
        setSelectedBonusCard(cardId);
        setSelectedTargetCard(null);
      }
    }
  };

  const handleTargetSelection = (targetCardId: string) => {
    if (selectedBonusCard) {
      if (applyBonus(selectedBonusCard, targetCardId)) {
        setSelectedBonusCard(null);
        setSelectedTargetCard(null);
      }
    } else {
      setSelectedTargetCard(targetCardId);
    }
  };

  const getFactionDisplay = () => {
    if (gameState.currentPlayer === "white_guard") {
      return { name: "Белая Гвардия", icon: "🔥", color: "text-blue-600" };
    } else {
      return { name: "Большевики", icon: "⚔️", color: "text-red-600" };
    }
  };

  const faction = getFactionDisplay();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <div className="bg-white/90 rounded-lg px-4 py-2 backdrop-blur">
          <div className={`text-lg font-bold ${faction.color}`}>
            {faction.icon} {faction.name}
          </div>
          <div className="text-sm text-gray-600">
            Ход: {gameState.turn} | Снабжение: <Badge variant="outline">{currentSupply}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <SoundToggle />
          <Button
            onClick={endTurn}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            Завершить ход
          </Button>
        </div>
      </div>

      {/* Hand (Bottom) */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold">Рука:</h3>
            {selectedBonusCard && (
              <Badge variant="destructive">
                Выберите цель для бонуса
              </Badge>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {currentHand.map(card => {
              const canPlay = currentSupply >= card.cost;
              return (
                <Card
                  key={card.id}
                  card={card}
                  isOwned={true}
                  onSelect={() => handleCardPlay(card.id)}
                  isSelected={selectedBonusCard === card.id}
                  className={`flex-shrink-0 ${!canPlay ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                />
              );
            })}
            {currentHand.length === 0 && (
              <div className="text-gray-500 text-center py-8 w-full">
                Нет карт в руке
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Field Units (For bonus targeting) */}
      {selectedBonusCard && currentField.length > 0 && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur rounded-lg p-4">
            <h4 className="font-bold mb-2">Выберите цель:</h4>
            <div className="space-y-2">
              {currentField.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleTargetSelection(card.id)}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-xl">{card.emoji}</span>
                  <span className="text-sm font-medium">{card.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Status */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        {selectedBonusCard && (
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-center">
            <p className="font-bold text-yellow-800">
              Применить бонус к юниту на поле
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
