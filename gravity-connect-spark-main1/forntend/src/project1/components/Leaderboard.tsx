import { Box, Typography, Card, CardContent, Avatar } from '@mui/material';
import { EmojiEvents, TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const topPlayers = [
    { username: 'ProGamer42', wins: 127, avatar: '' },
    { username: 'Connect4King', wins: 115, avatar: '' },
    { username: 'DiscMaster', wins: 98, avatar: '' },
  ];

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card
        sx={{
          background: 'var(--gradient-card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid hsl(var(--border))',
          height: '100%',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <TrendingUp sx={{ color: 'hsl(var(--primary))' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'hsl(var(--foreground))',
              }}
            >
              Top Players
            </Typography>
          </Box>

          {topPlayers.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 'calc(var(--radius) - 4px)',
                  bgcolor: index === 0 ? 'hsl(var(--primary) / 0.05)' : 'transparent',
                  border: index === 0 ? '1px solid hsl(var(--primary) / 0.2)' : 'none',
                  transition: 'var(--transition-smooth)',
                  '&:hover': {
                    bgcolor: 'hsl(var(--muted))',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                  }}
                >
                  <EmojiEvents sx={{ color: getMedalColor(index), fontSize: 24 }} />
                </Box>

                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                    color: index % 2 === 0 ? 'white' : 'hsl(var(--secondary-foreground))',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {player.username.substring(0, 2).toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    {player.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {player.wins} wins
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: getMedalColor(index),
                  }}
                >
                  #{index + 1}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Leaderboard;
