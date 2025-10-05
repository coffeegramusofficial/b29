import { GameCard } from "../types/cards";
import { cn } from "../lib/utils";

interface CardProps {
  card: GameCard;
  isOwned: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
  canTarget?: boolean;
  canAttack?: boolean;
  className?: string;
}

export function Card({ 
  card, 
  isOwned, 
  onSelect, 
  isSelected, 
  canTarget, 
  canAttack,
  className 
}: CardProps) {
  const getUnitTypeIcon = () => {
    switch (card.unitType) {
      case "assault": return "⚔️";
      case "flying": return "🪽";
      case "spy": return "🕵️";
      case "support": return "🛡️";
      case "medic": return "💉";
      case "instructor": return "🗡️";
      case "engineer": return "🔨";
      default: return "";
    }
  };

  const getFactionColor = () => {
    if (card.faction === "white_guard") return "border-blue-500 bg-blue-50";
    if (card.faction === "bolshevik") return "border-red-500 bg-red-50";
    return "border-gray-500 bg-gray-50";
  };

  const getHealthColor = () => {
    if (!card.health || !card.currentHealth) return "text-green-600";
    const healthPercent = card.currentHealth / card.health;
    if (healthPercent > 0.66) return "text-green-600";
    if (healthPercent > 0.33) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative w-32 h-44 border-2 rounded-lg p-2 cursor-pointer transition-all transform",
        getFactionColor(),
        {
          "ring-4 ring-yellow-400 scale-110": isSelected,
          "hover:scale-105": !isSelected && isOwned,
          "ring-2 ring-red-400 animate-pulse": canTarget,
          "opacity-50": card.hasAttacked,
          "border-green-400 shadow-green-200 shadow-lg": canAttack && !card.hasAttacked
        },
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xl">{card.emoji}</span>
        <div className="text-xs font-bold bg-yellow-400 text-black rounded-full px-1">
          {card.cost}
        </div>
      </div>

      {/* Card Name */}
      <h3 className="text-xs font-bold text-center mb-2 leading-tight">
        {card.name}
      </h3>

      {/* Unit Type */}
      {card.unitType && (
        <div className="flex items-center justify-center mb-2">
          <span className="text-sm">{getUnitTypeIcon()}</span>
          <span className="text-xs ml-1 capitalize">{card.unitType}</span>
        </div>
      )}

      {/* Stats */}
      {card.type === "unit" && (
        <div className="grid grid-cols-2 gap-1 text-xs mb-2">
          <div className="flex items-center">
            <span>⚔️</span>
            <span className="ml-1">{card.attack}</span>
          </div>
          <div className="flex items-center">
            <span>🔨</span>
            <span className="ml-1">{card.construction}</span>
          </div>
          <div className="flex items-center">
            <span>🛡️</span>
            <span className="ml-1">{card.defense}</span>
          </div>
          <div className="flex items-center">
            <span>❤️</span>
            <span className={cn("ml-1 font-bold", getHealthColor())}>
              {card.currentHealth || card.health}/{card.health}
            </span>
          </div>
        </div>
      )}

      {/* Bonus Description */}
      {card.type === "bonus" && card.description && (
        <p className="text-xs text-gray-700 text-center">
          {card.description}
        </p>
      )}

      {/* Status Indicators */}
      {card.hasAttacked && (
        <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></div>
      )}

      {canAttack && !card.hasAttacked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
}
