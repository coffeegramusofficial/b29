import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface MainMenuProps {
  onStartGame: (mode: "bot" | "multiplayer") => void;
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96 bg-white/90 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ⚔️ Гражданская война
            </h1>
            <p className="text-lg text-gray-600">
              Карточная игра
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-semibold text-blue-600">Белая Гвардия</span>
              <span className="text-gray-400">vs</span>
              <span className="text-xl font-semibold text-red-600">Большевики</span>
              <span className="text-2xl">⚔️</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={() => onStartGame("bot")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
            >
              🤖 Игра против бота
            </Button>
            
            <Button
              onClick={() => onStartGame("multiplayer")}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
            >
              👥 Локальный мультиплеер
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Цель: Уничтожить караван противника (15 HP)</p>
            <p>Защищайте свои башни (по 10 HP) и караван</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
