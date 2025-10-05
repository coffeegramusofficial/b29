import { useGameState } from "../lib/stores/useGameState";
import { Card } from "./Card";
import { Tower } from "./Tower";
import { Caravan } from "./Caravan";
import { useState } from "react";
import { GameCard, Target } from "../types/cards";
import { getValidTargets, canAttackTarget } from "../lib/gameLogic";

export function GameBoard() {
  const { gameState, attack } = useGameState();
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  if (!gameState) return null;

  const handleCardSelect = (cardId: string) => {
    const currentField = gameState.currentPlayer === "white_guard" 
      ? gameState.whiteGuardField 
      : gameState.bolshevikField;
    
    const card = currentField.find((c: GameCard) => c.id === cardId);
    if (card && !card.hasAttacked && card.attack && card.attack > 0) {
      setSelectedAttacker(cardId);
    }
  };

  const handleTargetSelect = (target: Target) => {
    if (selectedAttacker) {
      const currentField = gameState.currentPlayer === "white_guard" 
        ? gameState.whiteGuardField 
        : gameState.bolshevikField;
      const attackerCard = currentField.find((c: GameCard) => c.id === selectedAttacker);
      
      if (attackerCard && canAttackTarget(attackerCard, target, gameState)) {
        attack(selectedAttacker, target);
        setSelectedAttacker(null);
      }
    }
  };

  // Get valid targets for selected attacker
  const validTargets = selectedAttacker ? (() => {
    const currentField = gameState.currentPlayer === "white_guard" 
      ? gameState.whiteGuardField 
      : gameState.bolshevikField;
    const attackerCard = currentField.find((c: GameCard) => c.id === selectedAttacker);
    return attackerCard ? getValidTargets(attackerCard, gameState) : [];
  })() : [];

  const isValidTarget = (target: Target): boolean => {
    return validTargets.some(vt => 
      vt.type === target.type && 
      vt.faction === target.faction &&
      (vt.type !== "unit" || vt.cardId === target.cardId) &&
      (vt.type !== "tower" || vt.structure === target.structure)
    );
  };

  const handleDrop = (cardId: string, position: { x: number; y: number }) => {
    // Handle card placement on field
    console.log("Card dropped:", cardId, "at", position);
    setDraggedCard(null);
  };

  return (
    <div className="h-screen w-full relative bg-gradient-to-b from-blue-200 via-green-200 to-brown-200 pb-52">
      {/* Enemy Side (Top) */}
      <div className="absolute top-0 left-0 right-0 h-[30%] border-b-2 border-red-500">
        <div className="flex justify-between items-start p-2">
          {/* Enemy Towers */}
          <Tower
            health={gameState.currentPlayer === "white_guard" ? gameState.bolshevikLeftTower : gameState.whiteGuardLeftTower}
            maxHealth={10}
            faction={gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard"}
            side="left"
            onTargeted={() => handleTargetSelect({
              type: "tower",
              faction: gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard",
              structure: "left_tower"
            })}
            canTarget={selectedAttacker !== null && isValidTarget({
              type: "tower",
              faction: gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard",
              structure: "left_tower"
            })}
          />
          
          <Caravan
            health={gameState.currentPlayer === "white_guard" ? gameState.bolshevikCaravan : gameState.whiteGuardCaravan}
            maxHealth={15}
            faction={gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard"}
            onTargeted={() => handleTargetSelect({
              type: "caravan",
              faction: gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard"
            })}
            canTarget={selectedAttacker !== null && isValidTarget({
              type: "caravan",
              faction: gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard"
            })}
          />
          
          <Tower
            health={gameState.currentPlayer === "white_guard" ? gameState.bolshevikRightTower : gameState.whiteGuardRightTower}
            maxHealth={10}
            faction={gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard"}
            side="right"
            onTargeted={() => handleTargetSelect({
              type: "tower",
              faction: gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard",
              structure: "right_tower"
            })}
            canTarget={selectedAttacker !== null && isValidTarget({
              type: "tower",
              faction: gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard",
              structure: "right_tower"
            })}
          />
        </div>
        
        {/* Enemy Field */}
        <div className="flex flex-wrap gap-2 px-2 mt-1">
          {(gameState.currentPlayer === "white_guard" ? gameState.bolshevikField : gameState.whiteGuardField).map((card: GameCard) => (
            <Card
              key={card.id}
              card={card}
              isOwned={false}
              onSelect={() => handleTargetSelect({
                type: "unit",
                faction: gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard",
                cardId: card.id
              })}
              canTarget={selectedAttacker !== null && isValidTarget({
                type: "unit",
                faction: gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard",
                cardId: card.id
              })}
            />
          ))}
        </div>
      </div>

      {/* Battle Field (Middle) */}
      <div className="absolute top-[30%] left-0 right-0 h-[30%] bg-gradient-to-r from-red-100 to-blue-100 border-y-2 border-gray-500 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">⚔️ Поле боя ⚔️</h2>
          {selectedAttacker && (
            <p className="text-base text-red-600 animate-pulse">
              Выберите цель для атаки
            </p>
          )}
        </div>
      </div>

      {/* Player Side (Bottom) */}
      <div className="absolute top-[60%] left-0 right-0 bottom-0 border-t-2 border-blue-500 pb-52">
        <div className="flex justify-between items-start p-2">
          {/* Player Towers */}
          <Tower
            health={gameState.currentPlayer === "white_guard" ? gameState.whiteGuardLeftTower : gameState.bolshevikLeftTower}
            maxHealth={10}
            faction={gameState.currentPlayer}
            side="left"
            onTargeted={() => {}}
            canTarget={false}
          />
          
          <Caravan
            health={gameState.currentPlayer === "white_guard" ? gameState.whiteGuardCaravan : gameState.bolshevikCaravan}
            maxHealth={15}
            faction={gameState.currentPlayer}
            onTargeted={() => {}}
            canTarget={false}
          />
          
          <Tower
            health={gameState.currentPlayer === "white_guard" ? gameState.whiteGuardRightTower : gameState.bolshevikRightTower}
            maxHealth={10}
            faction={gameState.currentPlayer}
            side="right"
            onTargeted={() => {}}
            canTarget={false}
          />
        </div>
        
        {/* Player Field */}
        <div className="flex flex-wrap gap-2 px-2 mt-2">
          {(gameState.currentPlayer === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField).map((card: GameCard) => (
            <Card
              key={card.id}
              card={card}
              isOwned={true}
              onSelect={() => handleCardSelect(card.id)}
              isSelected={selectedAttacker === card.id}
              canAttack={!card.hasAttacked && (card.attack || 0) > 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
