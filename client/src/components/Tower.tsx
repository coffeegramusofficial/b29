import { cn } from "../lib/utils";
import { Castle, Factory, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

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
    if (healthPercent > 66) return "bg-success";
    if (healthPercent > 33) return "bg-warning";
    return "bg-destructive";
  };

  const getFactionColor = () => {
    return faction === "white_guard" ? "border-white-guard bg-white-guard/10" : "border-bolshevik bg-bolshevik/10";
  };

  const getTowerIcon = () => {
    return faction === "white_guard" ? <Castle className="w-8 h-8" /> : <Factory className="w-8 h-8" />;
  };

  return (
    <div
      onClick={canTarget ? onTargeted : undefined}
      className={cn(
        "relative w-20 h-24 border-2 rounded-lg bg-card/80 backdrop-blur-sm flex flex-col items-center justify-between p-2 transition-all",
        getFactionColor(),
        {
          "cursor-pointer hover:scale-110 ring-2 ring-warning animate-pulse": canTarget,
          "opacity-50 grayscale": health === 0
        }
      )}
      data-testid={`tower-${faction}-${side}`}
    >
      {/* Tower Icon */}
      <div className={cn("transition-all", faction === "white_guard" ? "text-white-guard" : "text-bolshevik")}>
        {getTowerIcon()}
      </div>
      
      {/* Health Bar */}
      <div className="w-full bg-muted/30 rounded-full h-2">
        <div
          className={cn("h-2 rounded-full transition-all", getHealthColor())}
          style={{ width: `${healthPercent}%` }}
        />
      </div>
      
      {/* Health Text */}
      <Badge variant="outline" className="text-xs">
        {health}/{maxHealth}
      </Badge>

      {/* Side Indicator */}
      <div className="absolute -top-2 -left-2 bg-card border-2 border-border rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {side === "left" ? "L" : "R"}
      </div>

      {/* Destroyed Overlay */}
      {health === 0 && (
        <div className="absolute inset-0 bg-black/75 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <X className="w-10 h-10 text-destructive" />
        </div>
      )}
    </div>
  );
}
