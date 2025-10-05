import { useState } from "react";
import { Card as GameCard } from "../types/cards";
import { CARDS, getCardsByFaction } from "../data/cards";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Shuffle, ArrowLeft } from "lucide-react";

interface DeckBuilderProps {
  onDeckBuilt: (whiteGuardDeck: string[], bolshevikDeck: string[]) => void;
  onBack: () => void;
}

export function DeckBuilder({ onDeckBuilt, onBack }: DeckBuilderProps) {
  const [whiteGuardDeck, setWhiteGuardDeck] = useState<string[]>([]);
  const [bolshevikDeck, setBolshevikDeck] = useState<string[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<"white_guard" | "bolshevik">("white_guard");

  const whiteGuardCards = getCardsByFaction("white_guard");
  const bolshevikCards = getCardsByFaction("bolshevik");

  const currentDeck = selectedFaction === "white_guard" ? whiteGuardDeck : bolshevikDeck;
  const availableCards = selectedFaction === "white_guard" ? whiteGuardCards : bolshevikCards;

  const addToDeck = (cardId: string) => {
    if (currentDeck.length >= 8) return;
    
    if (selectedFaction === "white_guard") {
      setWhiteGuardDeck([...whiteGuardDeck, cardId]);
    } else {
      setBolshevikDeck([...bolshevikDeck, cardId]);
    }
  };

  const removeFromDeck = (cardId: string) => {
    if (selectedFaction === "white_guard") {
      setWhiteGuardDeck(whiteGuardDeck.filter(id => id !== cardId));
    } else {
      setBolshevikDeck(bolshevikDeck.filter(id => id !== cardId));
    }
  };

  const autoFill = () => {
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 8).map(card => card.id);
    
    if (selectedFaction === "white_guard") {
      setWhiteGuardDeck(selected);
    } else {
      setBolshevikDeck(selected);
    }
  };

  const canStartGame = whiteGuardDeck.length === 8 && bolshevikDeck.length === 8;

  return (
    <div className="flex flex-col h-screen p-4 gap-4 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Сборка колод</h1>
        <Button onClick={onBack} variant="outline" className="hover-elevate active-elevate-2" data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
      </div>

      <div className="flex gap-4 h-full overflow-hidden">
        {/* Available Cards */}
        <Card className="flex-1 border-2 flex flex-col">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4">
              <CardTitle>Доступные карты</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedFaction("white_guard")}
                  variant={selectedFaction === "white_guard" ? "default" : "outline"}
                  size="sm"
                  className={selectedFaction === "white_guard" ? "bg-white-guard hover:bg-white-guard/90" : ""}
                  data-testid="button-faction-white-guard"
                >
                  Белая Гвардия
                </Button>
                <Button
                  onClick={() => setSelectedFaction("bolshevik")}
                  variant={selectedFaction === "bolshevik" ? "default" : "outline"}
                  size="sm"
                  className={selectedFaction === "bolshevik" ? "bg-bolshevik hover:bg-bolshevik/90" : ""}
                  data-testid="button-faction-bolshevik"
                >
                  Большевики
                </Button>
              </div>
              <Button onClick={autoFill} size="sm" variant="outline" className="hover-elevate active-elevate-2" data-testid="button-auto-fill">
                <Shuffle className="w-4 h-4 mr-2" />
                Авто-заполнение
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1">
            {availableCards.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                onClick={() => addToDeck(card.id)}
                disabled={currentDeck.length >= 8}
              />
            ))}
          </CardContent>
        </Card>

        {/* Selected Deck */}
        <Card className="w-80 border-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className={selectedFaction === "white_guard" ? "text-white-guard" : "text-bolshevik"}>
                {selectedFaction === "white_guard" ? "Колода Белой Гвардии" : "Колода Большевиков"}
              </span>
              <Badge variant="outline">
                {currentDeck.length}/8
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto flex-1">
            {currentDeck.map((cardId, index) => {
              const card = CARDS.find(c => c.id === cardId);
              if (!card) return null;
              
              return (
                <div
                  key={`${cardId}-${index}`}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted transition-colors hover-elevate active-elevate-2"
                  onClick={() => removeFromDeck(cardId)}
                  data-testid={`deck-card-${index}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{card.emoji}</span>
                    <span className="font-medium text-foreground">{card.name}</span>
                  </div>
                  <Badge variant="secondary">{card.cost}</Badge>
                </div>
              );
            })}
            {currentDeck.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Выберите карты из списка слева
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Start Game Button */}
      <div className="text-center">
        <Button
          onClick={() => onDeckBuilt(whiteGuardDeck, bolshevikDeck)}
          disabled={!canStartGame}
          size="lg"
          className={`min-w-[400px] ${canStartGame ? 'bg-success hover:bg-success/90 hover-elevate active-elevate-2' : ''}`}
          data-testid="button-start-game"
        >
          {canStartGame ? "Начать игру!" : `Нужно выбрать ${8 - whiteGuardDeck.length} карт для Белой Гвардии и ${8 - bolshevikDeck.length} для Большевиков`}
        </Button>
      </div>
    </div>
  );
}

interface CardComponentProps {
  card: GameCard;
  onClick: () => void;
  disabled?: boolean;
}

function CardComponent({ card, onClick, disabled }: CardComponentProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`bg-card border-2 border-border rounded-lg p-3 cursor-pointer transition-all ${
        disabled 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:border-primary hover:scale-105 hover-elevate active-elevate-2"
      }`}
      data-testid={`available-card-${card.id}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{card.emoji}</span>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-foreground">{card.name}</h3>
          <Badge variant="outline" className="mt-1">{card.cost}</Badge>
        </div>
      </div>
      
      {card.type === "unit" && (
        <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
          <div>ATK: <span className="text-foreground font-medium">{card.attack}</span></div>
          <div>CON: <span className="text-foreground font-medium">{card.construction}</span></div>
          <div>DEF: <span className="text-foreground font-medium">{card.defense}</span></div>
          <div>HP: <span className="text-foreground font-medium">{card.health}</span></div>
        </div>
      )}
      
      {card.type === "bonus" && (
        <p className="text-xs text-muted-foreground">{card.description}</p>
      )}
    </div>
  );
}
