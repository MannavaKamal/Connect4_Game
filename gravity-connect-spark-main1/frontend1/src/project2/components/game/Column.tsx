import { motion } from "framer-motion";

interface ColumnProps {
  children: React.ReactNode;
  onClick: () => void;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  isFull: boolean;
  currentPlayerColor: string;
}

const Column = ({
  children,
  onClick,
  isHovered,
  onHoverChange,
  isFull,
  currentPlayerColor,
}: ColumnProps) => {
  const getPreviewColorClass = () => {
    switch (currentPlayerColor) {
      case "red":
        return "bg-player-red/30";
      case "yellow":
        return "bg-player-yellow/30";
      case "blue":
        return "bg-player-blue/30";
      case "green":
        return "bg-player-green/30";
      default:
        return "bg-muted/30";
    }
  };

  return (
    <div className="relative">
      {/* Hover preview */}
      {isHovered && !isFull && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full ${getPreviewColorClass()}`}
        />
      )}

      <div
        className={`flex flex-col-reverse gap-2 ${
          !isFull ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        onClick={() => !isFull && onClick()}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        {children}
      </div>
    </div>
  );
};

export default Column;
