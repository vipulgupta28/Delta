import React from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import api from "../../../api/api"; // axios instance
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"

const GoogleButton: React.FC = () => {

    const navigate = useNavigate();
    const handleGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        const idToken = await cred.user.getIdToken(true);
        const email = cred.user.email;
    
        console.log(email);
    
        // First request (just with idToken & email)
        const res = await api.post(
          "/sessionLogin",
          { idToken, email },
          { withCredentials: true }
        );
    
        if (res.data.status === "NEW_USER") {
          // 🚨 New user → ask for new username
          const username = prompt("Choose a username:");
          if (!username) return;
    
          const res2 = await api.post(
            "/sessionLogin",
            { idToken, username, email },
            { withCredentials: true }
          );
    
          console.log("New user logged in:", res2.data);
          navigate("/home");
    
        } else if (res.data.status === "LOGGED_IN") {
          // 🚨 Existing user → ask for their registered username
          const username = prompt("Enter your registered username:");
          if (!username) return;
    
          const res2 = await api.post(
            "/sessionLogin",
            { idToken, username, email },
            { withCredentials: true }
          );
    
          console.log("Existing user logged in:", res2.data);
          navigate("/home");
    
        } else {
          alert(res.data.error || "Login failed");
        }
      } catch (err: any) {
        console.error("Login error:", err);
        alert(err.response?.data?.error || "Login failed");
      }
    };
    
    

  return (
    <button onClick={handleGoogle} className="flex hover:cursor-pointer justify-center gap-5">
       <FcGoogle size={24} /> Continue with Google
    </button>
  );
};

export default GoogleButton;
