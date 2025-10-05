import { cn } from "../lib/utils";

interface TowerProps {
  health: number;
  maxHealth: number;
  faction: "white_guard" | "bolshevik";
  side: "left" | "right";
  onTargeted: () => void;
  canTarget: boolean;
}

export function Tower({ health, maxHealth, faction, side, onTargeted, canTarget }: TowerProps) {
  const healthPercent = (health / maxHealth) * 100;
  
  const getHealthColor = () => {
    if (healthPercent > 66) return "bg-green-500";
    if (healthPercent > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getFactionColor = () => {
    return faction === "white_guard" ? "border-blue-600" : "border-red-600";
  };

  const getTowerIcon = () => {
    return faction === "white_guard" ? "🏰" : "🏭";
  };

  return (
    <div
      onClick={canTarget ? onTargeted : undefined}
      className={cn(
        "relative w-20 h-24 border-4 rounded-lg bg-gray-200 flex flex-col items-center justify-between p-2 transition-all",
        getFactionColor(),
        {
          "cursor-pointer hover:scale-110 ring-4 ring-yellow-400 animate-pulse": canTarget,
          "opacity-50": health === 0
        }
      )}
    >
      {/* Tower Icon */}
      <span className="text-2xl">{getTowerIcon()}</span>
      
      {/* Health Bar */}
      <div className="w-full bg-gray-400 rounded-full h-2 mb-1">
        <div
          className={cn("h-2 rounded-full transition-all", getHealthColor())}
          style={{ width: `${healthPercent}%` }}
        />
      </div>
      
      {/* Health Text */}
      <span className="text-xs font-bold">
        {health}/{maxHealth}
      </span>

      {/* Side Indicator */}
      <div className="absolute -top-2 -left-2 bg-white border border-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
        {side === "left" ? "L" : "R"}
      </div>

      {/* Destroyed Overlay */}
      {health === 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
          <span className="text-2xl">💥</span>
        </div>
      )}
    </div>
  );
}
