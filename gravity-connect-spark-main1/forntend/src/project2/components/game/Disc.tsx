import { motion } from "framer-motion";

interface DiscProps {
  color: string;
  isWinning?: boolean;
}

const Disc = ({ color, isWinning = false }: DiscProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "red":
        return "bg-player-red shadow-[0_0_20px_hsl(var(--glow-red))]";
      case "yellow":
        return "bg-player-yellow shadow-[0_0_20px_hsl(var(--glow-yellow))]";
      case "blue":
        return "bg-player-blue shadow-[0_0_20px_hsl(var(--glow-blue))]";
      case "green":
        return "bg-player-green shadow-[0_0_20px_hsl(var(--glow-green))]";
      default:
        return "bg-game-empty";
    }
  };

  return (
    <motion.div
      className={`w-full h-full rounded-full ${getColorClasses()} ${
        isWinning ? "animate-pulse-glow" : ""
      }`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    />
  );
};

export default Disc;
