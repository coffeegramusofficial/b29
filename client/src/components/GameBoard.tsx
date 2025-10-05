import { useGameState } from "../lib/stores/useGameState";
import { Card } from "./Card";
import { Tower } from "./Tower";
import { Caravan } from "./Caravan";
import { useState } from "react";
import { GameCard, Target } from "../types/cards";
import { getValidTargets, canAttackTarget } from "../lib/gameLogic";
import { Target as TargetIcon, Swords } from "lucide-react";
import { Badge } from "./ui/badge";

export function GameBoard() {
  const { gameState, attack } = useGameState();
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  if (!gameState) return null;

  const playerFaction = gameState.playerFaction;
  const enemyFaction = playerFaction === "white_guard" ? "bolshevik" : "white_guard";
  
  // Fields for display (player always at bottom)
  const playerDisplayField = playerFaction === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;
  const enemyDisplayField = enemyFaction === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;
  
  // Active field for current player (for attacks)
  const currentPlayerField = gameState.currentPlayer === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;

  const handleCardSelect = (cardId: string) => {
    // Only allow selection during player's turn
    if (gameState.currentPlayer !== playerFaction) return;
    
    const card = currentPlayerField.find((c: GameCard) => c.id === cardId);
    if (card && !card.hasAttacked && card.attack && card.attack > 0) {
      setSelectedAttacker(cardId);
    }
  };

  const handleTargetSelect = (target: Target) => {
    if (selectedAttacker) {
      const attackerCard = currentPlayerField.find((c: GameCard) => c.id === selectedAttacker);
      
      if (attackerCard && canAttackTarget(attackerCard, target, gameState)) {
        attack(selectedAttacker, target);
        setSelectedAttacker(null);
      }
    }
  };

  // Get valid targets for selected attacker
  const validTargets = selectedAttacker ? (() => {
    const attackerCard = currentPlayerField.find((c: GameCard) => c.id === selectedAttacker);
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
    console.log("Card dropped:", cardId, "at", position);
    setDraggedCard(null);
  };

  return (
    <div className="h-screen w-full relative bg-gradient-to-b from-background via-card/30 to-background pb-52">
      {/* Enemy Side (Top) */}
      <div className={`absolute top-0 left-0 right-0 h-[30%] border-b-2 ${enemyFaction === "bolshevik" ? "border-bolshevik/50" : "border-white-guard/50"} bg-gradient-to-b from-card/10 to-transparent`}>
        <div className="flex justify-between items-start p-4" data-testid="enemy-structures">
          {/* Enemy Towers */}
          <Tower
            health={enemyFaction === "white_guard" ? gameState.whiteGuardLeftTower : gameState.bolshevikLeftTower}
            maxHealth={10}
            faction={enemyFaction}
            side="left"
            onTargeted={() => handleTargetSelect({
              type: "tower",
              faction: enemyFaction,
              structure: "left_tower"
            })}
            canTarget={selectedAttacker !== null && isValidTarget({
              type: "tower",
              faction: enemyFaction,
              structure: "left_tower"
            })}
          />
          
          <Caravan
            health={enemyFaction === "white_guard" ? gameState.whiteGuardCaravan : gameState.bolshevikCaravan}
            maxHealth={15}
            faction={enemyFaction}
            onTargeted={() => handleTargetSelect({
              type: "caravan",
              faction: enemyFaction
            })}
            canTarget={selectedAttacker !== null && isValidTarget({
              type: "caravan",
              faction: enemyFaction
            })}
          />
          
          <Tower
            health={enemyFaction === "white_guard" ? gameState.whiteGuardRightTower : gameState.bolshevikRightTower}
            maxHealth={10}
            faction={enemyFaction}
            side="right"
            onTargeted={() => handleTargetSelect({
              type: "tower",
              faction: enemyFaction,
              structure: "right_tower"
            })}
            canTarget={selectedAttacker !== null && isValidTarget({
              type: "tower",
              faction: enemyFaction,
              structure: "right_tower"
            })}
          />
        </div>
        
        {/* Enemy Field */}
        <div className="flex flex-wrap gap-2 px-4 mt-2" data-testid="enemy-field">
          {enemyDisplayField.map((card: GameCard) => (
            <Card
              key={card.id}
              card={card}
              isOwned={false}
              onSelect={() => handleTargetSelect({
                type: "unit",
                faction: enemyFaction,
                cardId: card.id
              })}
              canTarget={selectedAttacker !== null && isValidTarget({
                type: "unit",
                faction: enemyFaction,
                cardId: card.id
              })}
            />
          ))}
        </div>
      </div>

      {/* Battle Field (Middle) */}
      <div className="absolute top-[30%] left-0 right-0 h-[30%] bg-gradient-to-r from-bolshevik/5 via-muted/10 to-white-guard/5 border-y-2 border-border flex items-center justify-center">
        <div className="text-center backdrop-blur-sm bg-card/80 rounded-lg px-6 py-4 border-2 border-border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Swords className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Поле боя</h2>
            <Swords className="w-6 h-6 text-primary" />
          </div>
          {selectedAttacker && (
            <Badge variant="destructive" className="animate-pulse">
              <TargetIcon className="w-4 h-4 mr-1" />
              Выберите цель для атаки
            </Badge>
          )}
        </div>
      </div>

      {/* Player Side (Bottom) */}
      <div className={`absolute top-[60%] left-0 right-0 bottom-0 border-t-2 ${playerFaction === "white_guard" ? "border-white-guard/50" : "border-bolshevik/50"} bg-gradient-to-t from-card/10 to-transparent pb-52`}>
        <div className="flex justify-between items-start p-4" data-testid="player-structures">
          {/* Player Towers */}
          <Tower
            health={playerFaction === "white_guard" ? gameState.whiteGuardLeftTower : gameState.bolshevikLeftTower}
            maxHealth={10}
            faction={playerFaction}
            side="left"
            onTargeted={() => {}}
            canTarget={false}
          />
          
          <Caravan
            health={playerFaction === "white_guard" ? gameState.whiteGuardCaravan : gameState.bolshevikCaravan}
            maxHealth={15}
            faction={playerFaction}
            onTargeted={() => {}}
            canTarget={false}
          />
          
          <Tower
            health={playerFaction === "white_guard" ? gameState.whiteGuardRightTower : gameState.bolshevikRightTower}
            maxHealth={10}
            faction={playerFaction}
            side="right"
            onTargeted={() => {}}
            canTarget={false}
          />
        </div>
        
        {/* Player Field */}
        <div className="flex flex-wrap gap-2 px-4 mt-2" data-testid="player-field">
          {playerDisplayField.map((card: GameCard) => (
            <Card
              key={card.id}
              card={card}
              isOwned={true}
              onSelect={() => handleCardSelect(card.id)}
              isSelected={selectedAttacker === card.id}
              canAttack={!card.hasAttacked && (card.attack || 0) > 0 && gameState.currentPlayer === playerFaction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
