import { useState } from "react";
import { Card as GameCard } from "../types/cards";
import { CARDS, getCardsByFaction } from "../data/cards";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
    <div className="flex flex-col h-screen p-4 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Сборка колод</h1>
        <Button onClick={onBack} variant="outline">
          Назад
        </Button>
      </div>

      <div className="flex gap-4 h-full">
        {/* Available Cards */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <CardTitle>Доступные карты</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedFaction("white_guard")}
                  variant={selectedFaction === "white_guard" ? "default" : "outline"}
                  size="sm"
                >
                  🔥 Белая Гвардия
                </Button>
                <Button
                  onClick={() => setSelectedFaction("bolshevik")}
                  variant={selectedFaction === "bolshevik" ? "default" : "outline"}
                  size="sm"
                >
                  ⚔️ Большевики
                </Button>
              </div>
              <Button onClick={autoFill} size="sm" variant="outline">
                Авто-заполнение
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
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
        <Card className="w-80">
          <CardHeader>
            <CardTitle>
              {selectedFaction === "white_guard" ? "🔥 Колода Белой Гвардии" : "⚔️ Колода Большевиков"}
              <Badge variant="outline" className="ml-2">
                {currentDeck.length}/8
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto">
            {currentDeck.map((cardId, index) => {
              const card = CARDS.find(c => c.id === cardId);
              if (!card) return null;
              
              return (
                <div
                  key={`${cardId}-${index}`}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => removeFromDeck(cardId)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{card.emoji}</span>
                    <span className="font-medium">{card.name}</span>
                  </div>
                  <Badge variant="secondary">{card.cost}</Badge>
                </div>
              );
            })}
            {currentDeck.length === 0 && (
              <p className="text-gray-500 text-center py-8">
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
          className="bg-green-600 hover:bg-green-700"
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
      className={`bg-white border-2 rounded-lg p-3 cursor-pointer transition-all ${
        disabled 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:border-blue-500 hover:scale-105"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{card.emoji}</span>
        <div className="flex-1">
          <h3 className="font-bold text-sm">{card.name}</h3>
          <Badge variant="outline">{card.cost}</Badge>
        </div>
      </div>
      
      {card.type === "unit" && (
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div>⚔️ {card.attack}</div>
          <div>🔨 {card.construction}</div>
          <div>🛡️ {card.defense}</div>
          <div>❤️ {card.health}</div>
        </div>
      )}
      
      {card.type === "bonus" && (
        <p className="text-xs text-gray-600">{card.description}</p>
      )}
    </div>
  );
}
