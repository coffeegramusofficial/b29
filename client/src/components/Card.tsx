import { GameCard } from "../types/cards";
import { cn } from "../lib/utils";
import { Sword, Hammer, Shield, Heart, Plane, UserSearch, Users, Syringe, GraduationCap, Wrench } from "lucide-react";
import { Badge } from "./ui/badge";

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
      case "assault": return <Sword className="w-3 h-3" />;
      case "flying": return <Plane className="w-3 h-3" />;
      case "spy": return <UserSearch className="w-3 h-3" />;
      case "support": return <Users className="w-3 h-3" />;
      case "medic": return <Syringe className="w-3 h-3" />;
      case "instructor": return <GraduationCap className="w-3 h-3" />;
      case "engineer": return <Wrench className="w-3 h-3" />;
      default: return null;
    }
  };

  const getFactionColor = () => {
    if (card.faction === "white_guard") return "border-white-guard bg-white-guard/5";
    if (card.faction === "bolshevik") return "border-bolshevik bg-bolshevik/5";
    return "border-border bg-card";
  };

  const getHealthColor = () => {
    if (!card.health || !card.currentHealth) return "text-success";
    const healthPercent = card.currentHealth / card.health;
    if (healthPercent > 0.66) return "text-success";
    if (healthPercent > 0.33) return "text-warning";
    return "text-destructive";
  };

  const getRarityColor = () => {
    // Based on cost - simple rarity system
    if (card.cost >= 7) return "text-legendary"; // Legendary
    if (card.cost >= 5) return "text-epic"; // Epic
    if (card.cost >= 3) return "text-rare"; // Rare
    return "text-common"; // Common
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative w-32 h-44 border-2 rounded-lg p-2 cursor-pointer transition-all",
        "bg-card backdrop-blur-sm",
        getFactionColor(),
        {
          "ring-4 ring-warning scale-105 shadow-xl": isSelected,
          "hover:scale-105 hover-elevate": !isSelected && isOwned,
          "ring-2 ring-destructive animate-pulse": canTarget,
          "opacity-50": card.hasAttacked,
          "ring-2 ring-success shadow-success/50 shadow-lg": canAttack && !card.hasAttacked
        },
        className
      )}
      data-testid={`card-${card.id}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-1">
        <span className={cn("text-2xl", getRarityColor())}>{card.emoji}</span>
        <Badge variant="outline" className="text-xs font-bold">
          {card.cost}
        </Badge>
      </div>

      {/* Card Name */}
      <h3 className="text-xs font-bold text-center mb-2 leading-tight text-foreground">
        {card.name}
      </h3>

      {/* Unit Type */}
      {card.unitType && (
        <div className="flex items-center justify-center gap-1 mb-2 text-muted-foreground">
          {getUnitTypeIcon()}
          <span className="text-xs capitalize">{card.unitType}</span>
        </div>
      )}

      {/* Stats */}
      {card.type === "unit" && (
        <div className="grid grid-cols-2 gap-1 text-xs mb-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Sword className="w-3 h-3" />
            <span className="font-medium text-foreground">{card.attack}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Hammer className="w-3 h-3" />
            <span className="font-medium text-foreground">{card.construction}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span className="font-medium text-foreground">{card.defense}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="w-3 h-3" />
            <span className={cn("font-bold", getHealthColor())}>
              {card.currentHealth || card.health}/{card.health}
            </span>
          </div>
        </div>
      )}

      {/* Bonus Description */}
      {card.type === "bonus" && card.description && (
        <p className="text-xs text-muted-foreground text-center leading-tight">
          {card.description}
        </p>
      )}

      {/* Status Indicators */}
      {card.hasAttacked && (
        <div className="absolute top-1 right-1 w-3 h-3 bg-destructive rounded-full border border-background"></div>
      )}

      {canAttack && !card.hasAttacked && (
        <div className="absolute -top-1 -right-1">
          <div className="w-4 h-4 bg-success rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-4 h-4 bg-success rounded-full"></div>
        </div>
      )}
    </div>
  );
}
