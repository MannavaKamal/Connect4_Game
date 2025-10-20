import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { GridOn, ArrowDownward, EmojiEvents, Functions } from '@mui/icons-material';
import { motion } from 'framer-motion';

const GameRules = () => {
  const rules = [
    {
      icon: <GridOn sx={{ fontSize: 40 }} />,
      title: 'The Board',
      description: 'The game is played on a 7×6 grid.',
    },
    {
      icon: <ArrowDownward sx={{ fontSize: 40 }} />,
      title: 'Drop Discs',
      description: 'Players take turns dropping discs into columns. The disc falls to the lowest available space.',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Winning',
      description: 'The first player to connect 4 discs vertically, horizontally, or diagonally wins.',
    },
    {
      icon: <Functions sx={{ fontSize: 40 }} />,
      title: 'Draw',
      description: 'If the board fills up with no winner, the game is a draw.',
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'hsl(var(--background))' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              background: 'var(--gradient-hero)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🕹 Game Rules – 4 in a Row
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mt: 4,
          }}
        >
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'var(--gradient-card)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid hsl(var(--border))',
                  transition: 'var(--transition-smooth)',
                  '&:hover': {
                    boxShadow: 'var(--shadow-game)',
                    borderColor: 'hsl(var(--primary) / 0.3)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: index % 2 === 0 ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--secondary) / 0.1)',
                      color: index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary-foreground))',
                      mb: 2,
                    }}
                  >
                    {rule.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    {rule.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'hsl(var(--muted-foreground))',
                      lineHeight: 1.7,
                    }}
                  >
                    {rule.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default GameRules;
