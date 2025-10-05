import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function SoundToggle() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <Button
      onClick={toggleMute}
      variant="outline"
      className="hover-elevate active-elevate-2"
      data-testid="button-sound-toggle"
    >
      {isMuted ? (
        <>
          <VolumeX className="w-4 h-4 mr-2" />
          Звук выкл
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 mr-2" />
          Звук вкл
        </>
      )}
    </Button>
  );
}
