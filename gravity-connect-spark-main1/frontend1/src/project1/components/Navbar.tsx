import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Avatar, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import { Casino, Login, Logout, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';

//for firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup , applyActionCode  ,sendEmailVerification , checkActionCode, fetchSignInMethodsForEmail} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBFUZXmxCF7V4VucBoME0Klt8r4tOpkhCs",
  authDomain: "iot-project-b96d5.firebaseapp.com",
  projectId: "iot-project-b96d5",
  storageBucket: "iot-project-b96d5.firebasestorage.app",
  messagingSenderId: "442611111592",
  appId: "1:442611111592:web:75813db5dd59aafb19d49d",
  measurementId: "G-0C9HQFEC5H"
};


interface UserData {
  username: string;
  email: string;
  imgurl:string;
  // avatar?: string;
}

const Navbar = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // for firebase
  const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

  useEffect(() => {
    // Check localStorage for user data
    const userData = localStorage.getItem('connect4User');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('connect4User');
    setUser(null);
    handleMenuClose();
  };

  const handleLogin = () => {
          console.log("kamal")
     signInWithPopup(auth, provider)
        .then((result) => {
          
          const user = result.user;
          console.log( result);
          console.log( user.displayName);
          console.log(user.email)
          console.log(user.photoURL)
          //setUrl(user.photoURL)
           const sampleUser: UserData = {
      username: user.displayName,
      email:user.email,
      imgurl: user.photoURL,
    };
    localStorage.setItem('connect4User', JSON.stringify(sampleUser));
    setUser(sampleUser);
         
        })
        .catch((error) => {
          console.error("Error during login", error);
          alert("Login failed");
        });



    // Demo: Set sample user data
    // const sampleUser: UserData = {
    //   username: 'Player1',
    //   email: 15,
    //   wins: 8,
    //   avatar: '',
    // };
    // localStorage.setItem('connect4User', JSON.stringify(sampleUser));
    // setUser(sampleUser);
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
      className="glass-nav"
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Casino 
              sx={{ 
                fontSize: 40, 
                color: 'hsl(var(--primary))',
                filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.3))'
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800,
                background: 'var(--gradient-hero)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px'
              }}
            >
              Connect4
            </Typography>
          </Box>
        </motion.div>

        {/* Auth Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {!user ? (
            <Button
              variant="contained"
              startIcon={<Login />}
              onClick={handleLogin}
              sx={{
                bgcolor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                px: 3,
                py: 1,
                borderRadius: 'var(--radius)',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'var(--transition-smooth)',
                '&:hover': {
                  bgcolor: 'hsl(var(--primary))',
                  transform: 'scale(1.05)',
                  boxShadow: 'var(--shadow-glow-red)',
                },
              }}
            >
              Login / Signup
            </Button>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'hsl(var(--primary))',
                    width: 44,
                    height: 44,
                    fontWeight: 600,
                    border: '2px solid hsl(var(--secondary))',
                    transition: 'var(--transition-smooth)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: 'var(--shadow-glow-red)',
                    }
                  }}
                >
                  {user.imgurl? (
                    <img src={user.imgurl} alt={user.username} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    getInitials(user.username)
                  )}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-card)',
                    bgcolor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid hsl(var(--border))' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}>
                    {user.username}
                  </Typography>
                  {/* <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', mt: 0.5 }}>
                    Games Played: <strong>{user.gamesPlayed}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                    Wins: <strong style={{ color: 'hsl(var(--primary))' }}>{user.wins}</strong>
                  </Typography> */}
                </Box>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    color: 'hsl(var(--destructive))',
                    '&:hover': {
                      bgcolor: 'hsl(var(--destructive) / 0.1)',
                    }
                  }}
                >
                  <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
