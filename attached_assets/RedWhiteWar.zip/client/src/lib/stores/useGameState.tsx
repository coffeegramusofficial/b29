import { create } from "zustand";
import { GameState, GameCard, Card, Target } from "../../types/cards";
import { getCardById } from "../../data/cards";
import { subscribeWithSelector } from "zustand/middleware";
import { useAudio } from "./useAudio";

interface GameStateStore {
  gameState: GameState | null;
  initializeGame: (whiteGuardDeckIds: string[], bolshevikDeckIds: string[], gameMode: "bot" | "multiplayer") => void;
  playCard: (cardId: string, position?: { x: number; y: number }) => boolean;
  attack: (attackerCardId: string, target: Target) => void;
  endTurn: () => void;
  applyBonus: (bonusCardId: string, targetCardId: string) => boolean;
  drawCard: (faction: "white_guard" | "bolshevik") => void;
}

const INITIAL_HAND_SIZE = 4;

export const useGameState = create<GameStateStore>()(
  subscribeWithSelector((set, get) => ({
    gameState: null,

    initializeGame: (whiteGuardDeckIds: string[], bolshevikDeckIds: string[], gameMode: "bot" | "multiplayer" = "bot") => {
      const whiteGuardCards = whiteGuardDeckIds.map(id => getCardById(id)).filter(Boolean) as Card[];
      const bolshevikCards = bolshevikDeckIds.map(id => getCardById(id)).filter(Boolean) as Card[];

      // Shuffle decks
      const shuffleArray = (array: Card[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const shuffledWhite = shuffleArray(whiteGuardCards);
      const shuffledRed = shuffleArray(bolshevikCards);

      const newGameState: GameState = {
        currentPlayer: Math.random() < 0.5 ? "white_guard" : "bolshevik",
        turn: 1,
        whiteGuardSupply: 3,
        bolshevikSupply: 3,
        
        whiteGuardLeftTower: 10,
        whiteGuardRightTower: 10,
        whiteGuardCaravan: 15,
        bolshevikLeftTower: 10,
        bolshevikRightTower: 10,
        bolshevikCaravan: 15,
        
        whiteGuardField: [],
        bolshevikField: [],
        whiteGuardHand: shuffledWhite.slice(0, INITIAL_HAND_SIZE),
        bolshevikHand: shuffledRed.slice(0, INITIAL_HAND_SIZE),
        whiteGuardDeck: shuffledWhite.slice(INITIAL_HAND_SIZE),
        bolshevikDeck: shuffledRed.slice(INITIAL_HAND_SIZE),
        
        gameOver: false,
        winner: undefined,
        gameMode
      };

      set({ gameState: newGameState });
    },

    playCard: (cardId: string, position?: { x: number; y: number }) => {
      const state = get().gameState;
      if (!state) return false;

      const currentFaction = state.currentPlayer;
      const hand = currentFaction === "white_guard" ? state.whiteGuardHand : state.bolshevikHand;
      const supply = currentFaction === "white_guard" ? state.whiteGuardSupply : state.bolshevikSupply;
      
      const card = hand.find((c: Card) => c.id === cardId);
      if (!card || supply < card.cost) return false;

      if (card.type === "unit") {
        const gameCard: GameCard = {
          ...card,
          currentHealth: card.health,
          position: position || { x: 0, y: 0 },
          hasAttacked: false
        };

        const newGameState = { ...state };
        if (currentFaction === "white_guard") {
          newGameState.whiteGuardField = [...state.whiteGuardField, gameCard];
          newGameState.whiteGuardHand = state.whiteGuardHand.filter((c: Card) => c.id !== cardId);
          newGameState.whiteGuardSupply = supply - card.cost;
        } else {
          newGameState.bolshevikField = [...state.bolshevikField, gameCard];
          newGameState.bolshevikHand = state.bolshevikHand.filter((c: Card) => c.id !== cardId);
          newGameState.bolshevikSupply = supply - card.cost;
        }

        set({ gameState: newGameState });
        
        // Play success sound
        useAudio.getState().playSuccess();
      }

      return true;
    },

    applyBonus: (bonusCardId: string, targetCardId: string) => {
      const state = get().gameState;
      if (!state) return false;

      const currentFaction = state.currentPlayer;
      const hand = currentFaction === "white_guard" ? state.whiteGuardHand : state.bolshevikHand;
      const supply = currentFaction === "white_guard" ? state.whiteGuardSupply : state.bolshevikSupply;
      
      const bonusCard = hand.find((c: Card) => c.id === bonusCardId);
      if (!bonusCard || supply < bonusCard.cost) return false;

      // Find target card on field
      const field = currentFaction === "white_guard" ? state.whiteGuardField : state.bolshevikField;
      const targetIndex = field.findIndex((c: GameCard) => c.id === targetCardId);
      if (targetIndex === -1) return false;

      const updatedField = [...field];
      const targetCard = { ...updatedField[targetIndex] };

      // Apply bonus effects
      if (bonusCard.unitType === "medic") {
        if (bonusCard.description?.includes("+2")) {
          targetCard.currentHealth = Math.min((targetCard.currentHealth || 0) + 2, targetCard.health || 0);
        } else {
          targetCard.currentHealth = targetCard.health;
        }
      } else if (bonusCard.unitType === "instructor") {
        targetCard.attack = (targetCard.attack || 0) + 4;
      } else if (bonusCard.unitType === "engineer") {
        targetCard.construction = (targetCard.construction || 0) + 3;
      } else if (bonusCard.description?.includes("🛡️")) {
        targetCard.defense = (targetCard.defense || 0) + 3;
      }

      updatedField[targetIndex] = targetCard;

      const newGameState = { ...state };
      if (currentFaction === "white_guard") {
        newGameState.whiteGuardField = updatedField;
        newGameState.whiteGuardHand = state.whiteGuardHand.filter((c: Card) => c.id !== bonusCardId);
        newGameState.whiteGuardSupply = supply - bonusCard.cost;
      } else {
        newGameState.bolshevikField = updatedField;
        newGameState.bolshevikHand = state.bolshevikHand.filter((c: Card) => c.id !== bonusCardId);
        newGameState.bolshevikSupply = supply - bonusCard.cost;
      }

      set({ gameState: newGameState });
      return true;
    },

    attack: (attackerCardId: string, target: Target) => {
      const state = get().gameState;
      if (!state) return;

      const currentFaction = state.currentPlayer;
      const field = currentFaction === "white_guard" ? state.whiteGuardField : state.bolshevikField;
      
      const attackerIndex = field.findIndex((c: GameCard) => c.id === attackerCardId);
      if (attackerIndex === -1) return;

      const attacker = { ...field[attackerIndex] };
      if (attacker.hasAttacked || !attacker.attack) return;

      const damage = attacker.attack;
      attacker.hasAttacked = true;

      const newGameState = { ...state };

      if (target.type === "unit" && target.cardId) {
        // Attack enemy unit
        const enemyFaction = target.faction;
        const enemyField = enemyFaction === "white_guard" ? state.whiteGuardField : state.bolshevikField;
        const targetIndex = enemyField.findIndex((c: GameCard) => c.id === target.cardId);
        
        if (targetIndex !== -1) {
          const targetCard = { ...enemyField[targetIndex] };
          targetCard.currentHealth = (targetCard.currentHealth || 0) - damage;
          
          const updatedEnemyField = [...enemyField];
          if (targetCard.currentHealth <= 0) {
            updatedEnemyField.splice(targetIndex, 1);
          } else {
            updatedEnemyField[targetIndex] = targetCard;
          }
          
          if (enemyFaction === "white_guard") {
            newGameState.whiteGuardField = updatedEnemyField;
          } else {
            newGameState.bolshevikField = updatedEnemyField;
          }
        }
      } else if (target.type === "tower") {
        // Attack tower
        if (target.faction === "white_guard") {
          if (target.structure === "left_tower") {
            newGameState.whiteGuardLeftTower = Math.max(0, state.whiteGuardLeftTower - damage);
          } else {
            newGameState.whiteGuardRightTower = Math.max(0, state.whiteGuardRightTower - damage);
          }
        } else {
          if (target.structure === "left_tower") {
            newGameState.bolshevikLeftTower = Math.max(0, state.bolshevikLeftTower - damage);
          } else {
            newGameState.bolshevikRightTower = Math.max(0, state.bolshevikRightTower - damage);
          }
        }
      } else if (target.type === "caravan") {
        // Attack caravan
        if (target.faction === "white_guard") {
          newGameState.whiteGuardCaravan = Math.max(0, state.whiteGuardCaravan - damage);
          if (newGameState.whiteGuardCaravan === 0) {
            newGameState.gameOver = true;
            newGameState.winner = "bolshevik";
          }
        } else {
          newGameState.bolshevikCaravan = Math.max(0, state.bolshevikCaravan - damage);
          if (newGameState.bolshevikCaravan === 0) {
            newGameState.gameOver = true;
            newGameState.winner = "white_guard";
          }
        }
      }

      // Update attacker
      const updatedField = [...field];
      updatedField[attackerIndex] = attacker;
      if (currentFaction === "white_guard") {
        newGameState.whiteGuardField = updatedField;
      } else {
        newGameState.bolshevikField = updatedField;
      }

      set({ gameState: newGameState });
      
      // Play hit sound when attacking
      useAudio.getState().playHit();
    },

    drawCard: (faction: "white_guard" | "bolshevik") => {
      const state = get().gameState;
      if (!state) return;

      const deck = faction === "white_guard" ? state.whiteGuardDeck : state.bolshevikDeck;
      const hand = faction === "white_guard" ? state.whiteGuardHand : state.bolshevikHand;
      
      if (deck.length === 0 || hand.length >= 10) return;

      const newCard = deck[0];
      const newDeck = deck.slice(1);
      const newHand = [...hand, newCard];

      const newGameState = { ...state };
      if (faction === "white_guard") {
        newGameState.whiteGuardDeck = newDeck;
        newGameState.whiteGuardHand = newHand;
      } else {
        newGameState.bolshevikDeck = newDeck;
        newGameState.bolshevikHand = newHand;
      }

      set({ gameState: newGameState });
    },

    endTurn: () => {
      const state = get().gameState;
      if (!state) return;

      const nextPlayer = state.currentPlayer === "white_guard" ? "bolshevik" : "white_guard";
      
      // Reset attack status for current player's units
      const field = state.currentPlayer === "white_guard" ? state.whiteGuardField : state.bolshevikField;
      const resetField = field.map((card: GameCard) => ({ ...card, hasAttacked: false }));

      // Add supply
      const newSupply = (state.currentPlayer === "white_guard" ? state.whiteGuardSupply : state.bolshevikSupply) + 3;

      const newGameState = { ...state };
      newGameState.currentPlayer = nextPlayer;
      newGameState.turn = nextPlayer === "white_guard" ? state.turn + 1 : state.turn;

      if (state.currentPlayer === "white_guard") {
        newGameState.whiteGuardField = resetField;
        newGameState.whiteGuardSupply = newSupply;
      } else {
        newGameState.bolshevikField = resetField;
        newGameState.bolshevikSupply = newSupply;
      }

      set({ gameState: newGameState });

      // Draw card for next player
      get().drawCard(nextPlayer);
    }
  }))
);
