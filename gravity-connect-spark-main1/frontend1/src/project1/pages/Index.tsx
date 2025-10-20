import { Box, Container } from '@mui/material';
import Navbar from '@project1/components/Navbar';
import HeroSection from '@project1/components/HeroSection';
import GameRules from '@project1/components/GameRules';
import ObjectiveSection from '@project1/components/ObjectiveSection';
import Leaderboard from '@project1/components/Leaderboard';
import Index2 from './index2';
import { useEffect,useState } from "react";


const Index = () => {
  const [open,setOpen] = useState(0)

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     // Chrome requires setting returnValue
  //     event.returnValue = "";
    
  //   };

  //   // Attach event listener
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // Cleanup on component unmount
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);
  return (
   

    <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))' }}>
      <Navbar />
      <HeroSection />
      
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 10 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 4,
          }}
        >
          <Box>
            <GameRules />
          </Box>
          <Box sx={{ position: { md: 'sticky' }, top: 100, height: 'fit-content' }}>
            <Leaderboard />
          </Box>
        </Box>
      </Container>

      <ObjectiveSection setOpen={setOpen} />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: 'center',
          color: 'hsl(var(--muted-foreground))',
          borderTop: '1px solid hsl(var(--border))',
        }}
      >
        <Container maxWidth="lg">
          Built with React + Vite + Material UI | Connect4 Multiplayer Game 🎮
        </Container>
      </Box>
    </Box>  
   
   
  );
};

export default Index;
