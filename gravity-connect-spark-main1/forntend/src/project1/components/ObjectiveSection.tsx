import { Box, Typography, Container, Card, CardContent, Button } from '@mui/material';
import { PlayArrow, Bolt } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react'

const ObjectiveSection = ({setOpen}) => {

  // for websocket
 const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleStartGame = () => {

    setOpen(1)
    console.log('Starting game... Initializing WebSocket connection');
    // TODO: Implement WebSocket connection logic
  
    if (ws) {
      console.log("Already connected");
      return;
    }
const userData = JSON.parse(localStorage.getItem('connect4User'));  
    const socket = new WebSocket(`ws://localhost:8081/ws?email=${encodeURIComponent(userData.email)}`);
    console.log("before socket open")
    socket.onopen = () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
    };
 console.log("after socket open")
    socket.onmessage = (event) => {
      console.log("📩 Message:", event.data);
      // setMessages((prev) => [...prev, event.data]);
    };
console.log("after onmessage")
    socket.onclose = () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
      setWs(null);
    };
console.log("after onclose")
    setWs(socket);
  };

   const sendMessage = () => {
    if (ws) {
      ws.send("client ready to connect");
    }
  };
  const disconnect = () => {
    if (ws) {
     ws.close()
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'hsl(var(--muted))' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              background: 'hsl(var(--card))',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-game)',
              border: '2px solid hsl(var(--border))',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 5, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: 'hsl(var(--foreground))',
                }}
              >
                🎯 Project Objective
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'hsl(var(--muted-foreground))',
                  mb: 2,
                  lineHeight: 1.8,
                }}
              >
                Create a real-time multiplayer game server using <strong>Node.js</strong> or <strong>GoLang</strong>.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'hsl(var(--muted-foreground))',
                  mb: 4,
                  lineHeight: 1.8,
                }}
              >
                Allow users to play <strong>1v1</strong> (vs Player or Bot).
              </Typography>

              <Box
                sx={{
                  bgcolor: 'hsl(var(--muted))',
                  p: 3,
                  borderRadius: 'calc(var(--radius) - 4px)',
                  mb: 4,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'hsl(var(--foreground))',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                  }}
                >
                  <Bolt sx={{ verticalAlign: 'middle', mr: 1, color: 'hsl(var(--secondary))' }} />
                  "To start playing, sign in and hit Start Game! You'll be matched with another player or a smart bot within seconds."
                </Typography>
              </Box>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow sx={{ fontSize: '1.5rem !important' }} />}
                  onClick={handleStartGame}
                  className="pulse-glow"
                  sx={{
                    bgcolor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius)',
                    textTransform: 'none',
                    transition: 'var(--transition-smooth)',
                    '&:hover': {
                      bgcolor: 'hsl(var(--primary))',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  Start Game
                </Button>                
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ObjectiveSection;
