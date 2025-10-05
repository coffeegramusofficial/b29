import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";

export function SoundToggle() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <Button
      onClick={toggleMute}
      variant="outline"
      size="sm"
      className="bg-white/90"
    >
      {isMuted ? "🔇 Звук выкл" : "🔊 Звук вкл"}
    </Button>
  );
}
