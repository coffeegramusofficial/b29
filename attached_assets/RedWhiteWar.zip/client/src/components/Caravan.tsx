import { cn } from "../lib/utils";

interface CaravanProps {
  health: number;
  maxHealth: number;
  faction: "white_guard" | "bolshevik";
  onTargeted: () => void;
  canTarget: boolean;
}

export function Caravan({ health, maxHealth, faction, onTargeted, canTarget }: CaravanProps) {
  const healthPercent = (health / maxHealth) * 100;
  
  const getHealthColor = () => {
    if (healthPercent > 66) return "bg-green-500";
    if (healthPercent > 33) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getFactionColor = () => {
    return faction === "white_guard" ? "border-blue-600 bg-blue-100" : "border-red-600 bg-red-100";
  };

  const getCaravanIcon = () => {
    return faction === "white_guard" ? "🚂" : "🚛";
  };

  return (
    <div
      onClick={canTarget ? onTargeted : undefined}
      className={cn(
        "relative w-32 h-20 border-4 rounded-lg flex flex-col items-center justify-center p-2 transition-all",
        getFactionColor(),
        {
          "cursor-pointer hover:scale-110 ring-4 ring-yellow-400 animate-pulse": canTarget,
          "opacity-50": health === 0
        }
      )}
    >
      {/* Caravan Icon */}
      <span className="text-3xl">{getCaravanIcon()}</span>
      
      {/* Health Bar */}
      <div className="w-full bg-gray-400 rounded-full h-3 mt-1">
        <div
          className={cn("h-3 rounded-full transition-all", getHealthColor())}
          style={{ width: `${healthPercent}%` }}
        />
      </div>
      
      {/* Health Text */}
      <span className="text-sm font-bold mt-1">
        {health}/{maxHealth}
      </span>

      {/* Faction Label */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white border border-gray-400 rounded px-2 py-1 text-xs font-bold">
        {faction === "white_guard" ? "🔥 БГ" : "⚔️ БШ"}
      </div>

      {/* Critical Health Warning */}
      {healthPercent < 25 && health > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
      )}

      {/* Destroyed Overlay */}
      {health === 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center">
          <span className="text-3xl">💥</span>
        </div>
      )}
    </div>
  );
}
