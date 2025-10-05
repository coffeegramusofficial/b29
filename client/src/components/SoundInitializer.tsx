import { useEffect } from "react";
import { useAudio } from "../lib/stores/useAudio";

export function SoundInitializer() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Initialize sounds
    // Background music should be calm Serbian folk music
    // Recommended sources:
    // - Pixabay: https://pixabay.com/music/search/serbia/ or /balkan/
    // - Free Music Archive: https://freemusicarchive.org/genre/Balkan/
    // Replace /sounds/background.mp3 with appropriate Serbian folk soundtrack
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.15; // Quiet volume for calm background music
    
    const hit = new Audio("/sounds/hit.mp3");
    const success = new Audio("/sounds/success.mp3");
    
    setBackgroundMusic(bgMusic);
    setHitSound(hit);
    setSuccessSound(success);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return null;
}
