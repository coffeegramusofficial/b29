export type CardType = "unit" | "bonus";

export type UnitType = "assault" | "flying" | "spy" | "support" | "medic" | "instructor" | "engineer";

export type Faction = "white_guard" | "bolshevik" | "both";

export interface Card {
  id: string;
  name: string;
  faction: Faction;
  type: CardType;
  unitType?: UnitType;
  cost: number;
  attack?: number;
  construction?: number;
  defense?: number;
  health?: number;
  description?: string;
  emoji: string;
}

export interface GameCard extends Card {
  currentHealth?: number;
  position?: { x: number; y: number };
  hasAttacked?: boolean;
}

export interface GameState {
  currentPlayer: "white_guard" | "bolshevik";
  turn: number;
  whiteGuardSupply: number;
  bolshevikSupply: number;
  
  // Structures
  whiteGuardLeftTower: number;
  whiteGuardRightTower: number;
  whiteGuardCaravan: number;
  bolshevikLeftTower: number;
  bolshevikRightTower: number;
  bolshevikCaravan: number;
  
  // Cards in play
  whiteGuardField: GameCard[];
  bolshevikField: GameCard[];
  
  // Hands and decks
  whiteGuardHand: Card[];
  bolshevikHand: Card[];
  whiteGuardDeck: Card[];
  bolshevikDeck: Card[];
  
  gameOver: boolean;
  winner?: "white_guard" | "bolshevik";
  
  // Game mode
  gameMode: "bot" | "multiplayer";
}

export interface Target {
  type: "unit" | "tower" | "caravan";
  faction: "white_guard" | "bolshevik";
  cardId?: string;
  structure?: "left_tower" | "right_tower" | "caravan";
}
