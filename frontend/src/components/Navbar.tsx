import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from 'axios'
import { config } from '../config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleDot, LogOut, User } from "lucide-react";

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


interface UserSession {
  username: string;
  email: string;
  imgurl:string;
  // avatar?: string;
}



export const Navbar = () => {
  const [session, setSession] = useState<UserSession | null>(null);

  // for firebase
  const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

  useEffect(() => {
    // Check for session in localStorage
    const storedSession = localStorage.getItem("userSession");
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
  }, []);

  const handleGoogleLogin = () => {
   
    signInWithPopup(auth, provider)
        .then( async (result) => {
          
          const user = result.user;
          console.log( result);
          console.log( user.displayName);
          console.log(user.email)
          console.log(user.photoURL)
           console.log(user.uid)
          //setUrl(user.photoURL)       
          
          const demoUser = {
      username: user.displayName,
      email:user.email,
      imgurl: user.photoURL,
    };       
    localStorage.setItem("userSession", JSON.stringify(demoUser));
    setSession(demoUser); 
    
    const res =  await axios.post(`${config.url}/insertplayer`,{
            username:user.displayName,
            email:user.email,
            id:user.uid
           })
           console.log(res.data)
        })
        .catch((error) => {
          console.error("Error during login", error);
         // alert("Login failed");
        });
  };

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setSession(null);
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <CircleDot className="h-10 w-10 text-player-red drop-shadow-[0_0_8px_hsl(var(--player-red))]" />
            <CircleDot className="absolute top-0 left-0 h-10 w-10 text-player-yellow opacity-50 animate-pulse" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-player-red via-player-yellow to-player-blue bg-clip-text text-transparent drop-shadow-lg">
            Connect 4
          </span>
        </div>

        {/* Right: Auth Section */}
        <div>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.imgurl} alt={session.username} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getUserInitials(session.username)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleGoogleLogin} variant="outline" className="gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in/Sign Up with Google
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
