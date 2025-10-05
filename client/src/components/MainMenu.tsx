import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Swords, Bot, Users } from "lucide-react";

interface MainMenuProps {
  onStartGame: (mode: "bot" | "multiplayer") => void;
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-card to-background p-4">
      <Card className="w-full max-w-md border-2" data-testid="card-main-menu">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Swords className="w-16 h-16 text-primary" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold mb-2">
              Гражданская война
            </CardTitle>
            <CardDescription className="text-lg">
              Карточная игра
            </CardDescription>
          </div>
          <div className="flex justify-center items-center gap-3 pt-2">
            <Badge variant="outline" className="text-base px-3 py-1 bg-white-guard/10 text-white-guard border-white-guard/30">
              Белая Гвардия
            </Badge>
            <span className="text-muted-foreground font-medium">vs</span>
            <Badge variant="outline" className="text-base px-3 py-1 bg-bolshevik/10 text-bolshevik border-bolshevik/30">
              Большевики
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            onClick={() => onStartGame("bot")}
            className="w-full text-lg h-12 hover-elevate active-elevate-2"
            variant="default"
            data-testid="button-start-bot"
          >
            <Bot className="w-5 h-5 mr-2" />
            Игра против бота
          </Button>
          
          <Button
            onClick={() => onStartGame("multiplayer")}
            className="w-full text-lg h-12 bg-success hover:bg-success/90 hover-elevate active-elevate-2"
            data-testid="button-start-multiplayer"
          >
            <Users className="w-5 h-5 mr-2" />
            Локальный мультиплеер
          </Button>
          
          <div className="mt-6 pt-6 border-t border-border space-y-2 text-center text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Цель:</span> Уничтожить караван противника (15 HP)
            </p>
            <p>Защищайте свои башни (по 10 HP) и караван</p>
          </div>
          
          <div className="text-center mt-4 space-y-1">
            <p className="text-xs text-muted-foreground/70">
              v1.0.29
            </p>
            <p className="text-2xs text-muted-foreground/50">
              © Студия Марка Минченко
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
