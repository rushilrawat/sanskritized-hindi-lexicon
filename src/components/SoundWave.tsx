interface SoundWaveProps {
  className?: string;
}

// Three animated bars to indicate audio is playing. Uses inline animation
// delays so we don't need to register new keyframes in Tailwind config.
const SoundWave = ({ className = "" }: SoundWaveProps) => {
  return (
    <span
      className={`inline-flex items-end gap-[2px] ${className}`}
      aria-hidden="true"
    >
      <span className="sound-bar" style={{ animationDelay: "0ms" }} />
      <span className="sound-bar" style={{ animationDelay: "150ms" }} />
      <span className="sound-bar" style={{ animationDelay: "300ms" }} />
    </span>
  );
};

export default SoundWave;
