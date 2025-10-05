import { GameState, GameCard, Target } from "../types/cards";
import { getValidTargets, canAttackTarget } from "./gameLogic";

export interface BotAction {
  type: "play_card" | "attack" | "apply_bonus" | "end_turn";
  cardId?: string;
  target?: Target;
  targetCardId?: string;
}

export class BotAI {
  private difficulty: "easy" | "medium" | "hard";

  constructor(difficulty: "easy" | "medium" | "hard" = "medium") {
    this.difficulty = difficulty;
  }

  public async getNextAction(gameState: GameState): Promise<BotAction> {
    // Wait a bit to simulate thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const botFaction = gameState.currentPlayer;
    const botHand = botFaction === "white_guard" ? gameState.whiteGuardHand : gameState.bolshevikHand;
    const botField = botFaction === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;
    const botSupply = botFaction === "white_guard" ? gameState.whiteGuardSupply : gameState.bolshevikSupply;

    // Priority 1: Attack with available units
    const attackAction = this.findBestAttack(gameState);
    if (attackAction) {
      return attackAction;
    }

    // Priority 2: Play cards from hand
    const playAction = this.findBestCardToPlay(gameState);
    if (playAction) {
      return playAction;
    }

    // Priority 3: Apply bonuses
    const bonusAction = this.findBestBonus(gameState);
    if (bonusAction) {
      return bonusAction;
    }

    // If nothing else, end turn
    return { type: "end_turn" };
  }

  private findBestAttack(gameState: GameState): BotAction | null {
    const botFaction = gameState.currentPlayer;
    const botField = botFaction === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;
    const enemyFaction = botFaction === "white_guard" ? "bolshevik" : "white_guard";

    // Find all units that can attack
    const attackableUnits = botField.filter(unit => 
      !unit.hasAttacked && unit.attack && unit.attack > 0
    );

    if (attackableUnits.length === 0) return null;

    // Score potential attacks
    const attackOptions: Array<{ unit: GameCard; target: Target; score: number }> = [];

    for (const unit of attackableUnits) {
      const validTargets = getValidTargets(unit, gameState);
      
      for (const target of validTargets) {
        const score = this.scoreAttack(unit, target, gameState);
        attackOptions.push({ unit, target, score });
      }
    }

    if (attackOptions.length === 0) return null;

    // Sort by score and pick the best
    attackOptions.sort((a, b) => b.score - a.score);
    const bestAttack = attackOptions[0];

    return {
      type: "attack",
      cardId: bestAttack.unit.id,
      target: bestAttack.target
    };
  }

  private scoreAttack(attacker: GameCard, target: Target, gameState: GameState): number {
    let score = 0;
    const attackPower = attacker.attack || 0;

    if (target.type === "caravan") {
      // Highest priority - winning the game
      score += 1000;
      score += attackPower * 10; // More damage = better
    } else if (target.type === "tower") {
      // Medium priority - removing defensive structures
      score += 500;
      score += attackPower * 5;
    } else if (target.type === "unit" && target.cardId) {
      // Variable priority based on threat assessment
      const enemyFaction = target.faction;
      const enemyField = enemyFaction === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;
      const targetUnit = enemyField.find(u => u.id === target.cardId);
      
      if (targetUnit) {
        // Prioritize dangerous units
        const threatScore = (targetUnit.attack || 0) * 20;
        
        // Can we kill it?
        const canKill = (targetUnit.currentHealth || targetUnit.health || 0) <= attackPower;
        const killBonus = canKill ? 200 : 0;

        score += threatScore + killBonus + attackPower;
      }
    }

    return score;
  }

  private findBestCardToPlay(gameState: GameState): BotAction | null {
    const botFaction = gameState.currentPlayer;
    const botHand = botFaction === "white_guard" ? gameState.whiteGuardHand : gameState.bolshevikHand;
    const botSupply = botFaction === "white_guard" ? gameState.whiteGuardSupply : gameState.bolshevikSupply;

    // Find playable unit cards
    const playableUnits = botHand.filter(card => 
      card.type === "unit" && card.cost <= botSupply
    );

    if (playableUnits.length === 0) return null;

    // Simple strategy: play the most expensive unit we can afford
    playableUnits.sort((a, b) => b.cost - a.cost);
    
    return {
      type: "play_card",
      cardId: playableUnits[0].id
    };
  }

  private findBestBonus(gameState: GameState): BotAction | null {
    const botFaction = gameState.currentPlayer;
    const botHand = botFaction === "white_guard" ? gameState.whiteGuardHand : gameState.bolshevikHand;
    const botField = botFaction === "white_guard" ? gameState.whiteGuardField : gameState.bolshevikField;
    const botSupply = botFaction === "white_guard" ? gameState.whiteGuardSupply : gameState.bolshevikSupply;

    // Find playable bonus cards
    const playableBonuses = botHand.filter(card => 
      card.type === "bonus" && card.cost <= botSupply
    );

    if (playableBonuses.length === 0 || botField.length === 0) return null;

    // Find best target for bonuses
    for (const bonusCard of playableBonuses) {
      let bestTarget: GameCard | null = null;
      let bestScore = 0;

      for (const fieldCard of botField) {
        const score = this.scoreBonusApplication(bonusCard, fieldCard, gameState);
        if (score > bestScore) {
          bestScore = score;
          bestTarget = fieldCard;
        }
      }

      if (bestTarget) {
        return {
          type: "apply_bonus",
          cardId: bonusCard.id,
          targetCardId: bestTarget.id
        };
      }
    }

    return null;
  }

  private scoreBonusApplication(bonusCard: any, targetCard: GameCard, gameState: GameState): number {
    let score = 0;

    if (bonusCard.unitType === "medic") {
      // Heal damaged units
      const missingHealth = (targetCard.health || 0) - (targetCard.currentHealth || 0);
      score += missingHealth * 50; // Value healing
    } else if (bonusCard.unitType === "instructor") {
      // Boost attack on strong units
      score += (targetCard.attack || 0) * 30;
    } else if (bonusCard.unitType === "engineer") {
      // Boost construction on builder units
      score += (targetCard.construction || 0) * 20;
    }

    return score;
  }
}

export const botAI = new BotAI("medium");
