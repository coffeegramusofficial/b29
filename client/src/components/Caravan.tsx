import { cn } from "../lib/utils";
import { Train, Truck, X, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";

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
    if (healthPercent > 66) return "bg-success";
    if (healthPercent > 33) return "bg-warning";
    return "bg-destructive";
  };

  const getFactionColor = () => {
    return faction === "white_guard" ? "border-white-guard bg-white-guard/10" : "border-bolshevik bg-bolshevik/10";
  };

  const getCaravanIcon = () => {
    return faction === "white_guard" ? <Train className="w-10 h-10" /> : <Truck className="w-10 h-10" />;
  };

  return (
    <div
      onClick={canTarget ? onTargeted : undefined}
      className={cn(
        "relative w-32 h-20 border-2 rounded-lg bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 transition-all",
        getFactionColor(),
        {
          "cursor-pointer hover:scale-110 ring-2 ring-warning animate-pulse": canTarget,
          "opacity-50 grayscale": health === 0
        }
      )}
      data-testid={`caravan-${faction}`}
    >
      {/* Caravan Icon */}
      <div className={cn("transition-all", faction === "white_guard" ? "text-white-guard" : "text-bolshevik")}>
        {getCaravanIcon()}
      </div>
      
      {/* Health Bar */}
      <div className="w-full bg-muted/30 rounded-full h-2 mt-1">
        <div
          className={cn("h-2 rounded-full transition-all", getHealthColor())}
          style={{ width: `${healthPercent}%` }}
        />
      </div>
      
      {/* Health Text */}
      <Badge variant="outline" className="text-xs mt-1">
        {health}/{maxHealth}
      </Badge>

      {/* Faction Label */}
      <div className={cn(
        "absolute -top-3 left-1/2 transform -translate-x-1/2 border-2 border-border rounded-md px-2 py-0.5 text-xs font-bold",
        faction === "white_guard" ? "bg-white-guard/20 text-white-guard" : "bg-bolshevik/20 text-bolshevik"
      )}>
        {faction === "white_guard" ? "БГ" : "БШ"}
      </div>

      {/* Critical Health Warning */}
      {healthPercent < 25 && health > 0 && (
        <div className="absolute -top-1 -right-1">
          <AlertCircle className="w-5 h-5 text-destructive animate-pulse" />
        </div>
      )}

      {/* Destroyed Overlay */}
      {health === 0 && (
        <div className="absolute inset-0 bg-black/75 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <X className="w-12 h-12 text-destructive" />
        </div>
      )}
    </div>
  );
}
