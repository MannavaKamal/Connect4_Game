import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Users, Bot, Trophy } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Classic Gameplay",
      description: "Experience the timeless Connect 4 with smooth animations",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multiplayer Mode",
      description: "Challenge friends in real-time multiplayer matches",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Opponent",
      description: "Practice against our intelligent bot when no one's around",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Track Scores",
      description: "Keep track of wins and improve your strategy",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-24 relative overflow-hidden">
      <Navbar />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-player-red/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-player-yellow/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-player-blue/10 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="w-full max-w-6xl z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-player-red via-player-yellow to-player-blue bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            Connect 4
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
          >
            Four in a row wins! Challenge friends or test your skills against AI
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <Button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('userSession'));               
                  if (user) {
                  navigate("/game")
                  }
                  else{
                alert("please login to beforestart game")}
              }}
              size="lg"
              className="bg-gradient-to-r from-player-red to-player-yellow hover:opacity-90 text-white font-bold text-lg px-8 py-6 shadow-2xl shadow-player-red/50"
            >
              <Gamepad2 className="mr-2 w-6 h-6" />
              Start Playing
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-card rounded-2xl p-6 shadow-xl border border-border hover:border-primary/50 transition-all"
            >
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Game Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="bg-card rounded-3xl p-8 shadow-2xl border border-border"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-foreground">
            How to Play
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="bg-player-red/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-3xl font-bold text-player-red">
                1
              </div>
              <h4 className="font-semibold text-foreground">Choose Colors</h4>
              <p className="text-sm text-muted-foreground">
                Pick your favorite disc color and your opponent's color
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-player-yellow/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-3xl font-bold text-player-yellow">
                2
              </div>
              <h4 className="font-semibold text-foreground">Find Opponent</h4>
              <p className="text-sm text-muted-foreground">
                Wait for a player to join or play against the bot
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-player-blue/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-3xl font-bold text-player-blue">
                3
              </div>
              <h4 className="font-semibold text-foreground">Connect Four</h4>
              <p className="text-sm text-muted-foreground">
                Drop discs and be the first to connect four in a row!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
