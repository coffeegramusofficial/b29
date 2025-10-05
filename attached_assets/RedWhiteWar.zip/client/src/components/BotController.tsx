import { useEffect, useRef } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { botAI, BotAction } from "../lib/botAI";

export function BotController() {
  const { gameState, playCard, attack, applyBonus, endTurn } = useGameState();
  const isProcessing = useRef(false);

  useEffect(() => {
    if (!gameState || gameState.gameOver || isProcessing.current) return;
    
    // Check if it's bot's turn
    const isBotTurn = gameState.gameMode === "bot" && gameState.currentPlayer === "bolshevik";
    
    if (!isBotTurn) return;

    isProcessing.current = true;

    const processBotTurn = async () => {
      console.log("🤖 Bot is thinking...");
      
      try {
        let actionCount = 0;
        const MAX_ACTIONS_PER_TURN = 20;
        
        while (actionCount < MAX_ACTIONS_PER_TURN) {
          const action: BotAction = await botAI.getNextAction(gameState);
          console.log("🤖 Bot action:", action.type, action);
          
          if (action.type === "end_turn") {
            console.log("🤖 Bot ends turn");
            endTurn();
            break;
          } else if (action.type === "play_card" && action.cardId) {
            console.log("🤖 Bot plays card:", action.cardId);
            const success = playCard(action.cardId);
            if (!success) {
              console.log("🤖 Failed to play card, ending turn");
              endTurn();
              break;
            }
          } else if (action.type === "attack" && action.cardId && action.target) {
            console.log("🤖 Bot attacks with:", action.cardId, "target:", action.target);
            attack(action.cardId, action.target);
          } else if (action.type === "apply_bonus" && action.cardId && action.targetCardId) {
            console.log("🤖 Bot applies bonus:", action.cardId, "to:", action.targetCardId);
            const success = applyBonus(action.cardId, action.targetCardId);
            if (!success) {
              console.log("🤖 Failed to apply bonus");
            }
          }
          
          actionCount++;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } finally {
        isProcessing.current = false;
      }
    };

    const timeout = setTimeout(() => {
      processBotTurn();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [gameState, playCard, attack, applyBonus, endTurn]);

  return null;
}
