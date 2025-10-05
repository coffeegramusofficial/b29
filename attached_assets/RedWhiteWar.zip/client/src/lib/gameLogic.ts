import { GameState, GameCard, Target } from "../types/cards";

export function canAttackTarget(attacker: GameCard, target: Target, gameState: GameState): boolean {
  // Check if attacker can attack
  if (attacker.hasAttacked || !attacker.attack || attacker.attack <= 0) {
    return false;
  }

  const enemyFaction = gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard";
  const enemyField = enemyFaction === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;

  // Unit type specific rules
  switch (attacker.unitType) {
    case "flying":
      // Flying units attack towers and caravan directly, ignoring enemy units
      // Can attack towers if they exist, or caravan if no towers
      if (target.type === "tower") return true;
      if (target.type === "caravan") {
        const leftTower = target.faction === "white_guard" ? gameState.whiteGuardLeftTower : gameState.bolshevikLeftTower;
        const rightTower = target.faction === "white_guard" ? gameState.whiteGuardRightTower : gameState.bolshevikRightTower;
        return leftTower === 0 && rightTower === 0; // Only if both towers are destroyed
      }
      return false;

    case "spy":
      // Spies can ONLY attack the caravan, nothing else
      return target.type === "caravan";

    case "assault":
      // Assault units attack other units first, then towers if no units, then caravan
      if (target.type === "unit") return true;
      if (target.type === "tower") {
        return enemyField.length === 0; // Only if no enemy units
      }
      if (target.type === "caravan") {
        const leftTower = target.faction === "white_guard" ? gameState.whiteGuardLeftTower : gameState.bolshevikLeftTower;
        const rightTower = target.faction === "white_guard" ? gameState.whiteGuardRightTower : gameState.bolshevikRightTower;
        return enemyField.length === 0 && leftTower === 0 && rightTower === 0;
      }
      return false;

    case "support":
      // Support units can attack other units first, then towers, then caravan
      if (target.type === "unit") return true;
      if (target.type === "tower") {
        return enemyField.length === 0;
      }
      if (target.type === "caravan") {
        const leftTower = target.faction === "white_guard" ? gameState.whiteGuardLeftTower : gameState.bolshevikLeftTower;
        const rightTower = target.faction === "white_guard" ? gameState.whiteGuardRightTower : gameState.bolshevikRightTower;
        return enemyField.length === 0 && leftTower === 0 && rightTower === 0;
      }
      return false;

    default:
      // Default behavior: attack units
      return target.type === "unit";
  }
}

export function getValidTargets(attacker: GameCard, gameState: GameState): Target[] {
  const targets: Target[] = [];
  const enemyFaction = gameState.currentPlayer === "white_guard" ? "bolshevik" : "white_guard";
  
  // Add enemy units as targets
  const enemyField = enemyFaction === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;
  enemyField.forEach(card => {
    if (canAttackTarget(attacker, { type: "unit", faction: enemyFaction, cardId: card.id }, gameState)) {
      targets.push({ type: "unit", faction: enemyFaction, cardId: card.id });
    }
  });

  // Add towers as targets
  const leftTowerHealth = enemyFaction === "white_guard" ? gameState.whiteGuardLeftTower : gameState.bolshevikLeftTower;
  const rightTowerHealth = enemyFaction === "white_guard" ? gameState.whiteGuardRightTower : gameState.bolshevikRightTower;

  if (leftTowerHealth > 0 && canAttackTarget(attacker, { type: "tower", faction: enemyFaction, structure: "left_tower" }, gameState)) {
    targets.push({ type: "tower", faction: enemyFaction, structure: "left_tower" });
  }

  if (rightTowerHealth > 0 && canAttackTarget(attacker, { type: "tower", faction: enemyFaction, structure: "right_tower" }, gameState)) {
    targets.push({ type: "tower", faction: enemyFaction, structure: "right_tower" });
  }

  // Add caravan as target
  const caravanHealth = enemyFaction === "white_guard" ? gameState.whiteGuardCaravan : gameState.bolshevikCaravan;
  if (caravanHealth > 0 && canAttackTarget(attacker, { type: "caravan", faction: enemyFaction }, gameState)) {
    targets.push({ type: "caravan", faction: enemyFaction });
  }

  return targets;
}

export function calculateDamage(attacker: GameCard, target: GameCard): number {
  const attackPower = attacker.attack || 0;
  const defense = target.defense || 0;
  
  // Simple damage calculation: attack - defense, minimum 1 damage
  return Math.max(1, attackPower - defense);
}

export function isGameOver(gameState: GameState): { gameOver: boolean; winner?: "white_guard" | "bolshevik" } {
  if (gameState.whiteGuardCaravan <= 0) {
    return { gameOver: true, winner: "bolshevik" };
  }
  
  if (gameState.bolshevikCaravan <= 0) {
    return { gameOver: true, winner: "white_guard" };
  }

  return { gameOver: false };
}

export function getStructureHealth(gameState: GameState, faction: "white_guard" | "bolshevik", structure: "left_tower" | "right_tower" | "caravan"): number {
  const prefix = faction === "white_guard" ? "whiteGuard" : "bolshevik";
  
  switch (structure) {
    case "left_tower":
      return gameState[`${prefix}LeftTower` as keyof GameState] as number;
    case "right_tower":
      return gameState[`${prefix}RightTower` as keyof GameState] as number;
    case "caravan":
      return gameState[`${prefix}Caravan` as keyof GameState] as number;
    default:
      return 0;
  }
}
