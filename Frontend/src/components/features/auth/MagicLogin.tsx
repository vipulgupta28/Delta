// src/pages/auth/MagicLogin.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import toast from "react-hot-toast";

const MagicLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyMagicLink = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        toast.error("Invalid login link.");
        navigate("/");
        return;
      }

      try {
        const res = await api.post(
          "/magic-login",
          { token },
          { withCredentials: true }
        );

        toast.success("Login successful!");
        localStorage.setItem("authToken", res.data.token); // if JWT
        navigate("/homepage");
      } catch (err: any) {
        console.error("Verification failed", err);
        toast.error("Invalid or expired link.");
        navigate("/");
      }
    };

    verifyMagicLink();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold">Verifying your magic link...</h1>
    </div>
  );
};

export default MagicLogin;
