import useSound from 'use-sound';

// 🔊 SOUND ASSETS (Hosted URLs to avoid downloads)
const SOUNDS = {
  // Subtle glass click for typing/focus
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', 
  // Ethereal whoosh for success
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', 
  // Heavy bass thud for error
  ERROR: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', 
  // Digital heavy static for the glitch
  GLITCH: 'https://assets.mixkit.co/active_storage/sfx/2771/2771-preview.mp3', 
  // Red Alert Siren
  SIREN: 'https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3', 
};

export const useSoundEffects = () => {
  const [playClick] = useSound(SOUNDS.CLICK, { volume: 0.5 });
  const [playSuccess] = useSound(SOUNDS.SUCCESS, { volume: 0.6 });
  const [playError] = useSound(SOUNDS.ERROR, { volume: 0.7 });
  const [playGlitch] = useSound(SOUNDS.GLITCH, { volume: 0.5, playbackRate: 0.8 }); // Slowed down for creepiness
  const [playSiren, { stop: stopSiren }] = useSound(SOUNDS.SIREN, { volume: 0.4, loop: true });

  return { playClick, playSuccess, playError, playGlitch, playSiren, stopSiren };
};