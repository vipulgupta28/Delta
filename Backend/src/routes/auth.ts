import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { createToken, setAuthCookie } from '../utils/jwt';
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { supabase } from '../config/database';

const router = Router();






//@ts-ignore
router.post('/get-otp', async (req: Request, res: Response) => {
  try {
    const { data: email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const success = await AuthService.generateOTP(email);
    
    if (success) {
      res.status(200).json({ message: 'OTP sent to your email' });
    } else {
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

//@ts-ignore
router.post('/verify-otp', (req: Request, res: Response) => {
  try {
    const { otp, userEmail } = req.body;

    if (!otp || !userEmail) {
      return res.status(400).json({ error: 'OTP and email are required' });
    }

    const isValid = AuthService.verifyOTP(userEmail, otp);

    if (isValid) {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup
//@ts-ignore
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { enteredUsername, enteredPassword, enteredEmail } = req.body;

    if (!enteredUsername || !enteredPassword || !enteredEmail) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { user, tokenPayload } = await AuthService.signup({
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
    });

    const token = createToken(tokenPayload);
    setAuthCookie(res, token);

    res.status(201).json({ 
      message: 'Signup and login successful', 
      user_id: user.user_id 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.message.includes('exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
});


// Login
//@ts-ignore
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { enteredUsername, enteredEmail, enteredPassword } = req.body;

    if (!enteredUsername || !enteredEmail || !enteredPassword) {
      return res.status(400).json({ error: 'Username , email and password are required' });
    }

    const { user, tokenPayload } = await AuthService.login(enteredUsername, enteredEmail, enteredPassword);

    const token = createToken(tokenPayload);
    setAuthCookie(res, token);

    console.log('Login cookie set');
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Check username availability
//@ts-ignore
router.get('/check-username', async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const exists = await AuthService.checkUsername(username as string);
    res.json({ exists });
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
//@ts-ignore
router.get('/me', (req: Request, res: Response) => {
  const token = req.cookies.token;
  
  if (!token) {
    console.log('FAILURE: No token found in cookies');
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    console.log('SUCCESS: Decoded token:', data);
    return res.json({ user: data });
  } catch (err) {
    console.log('FAILURE: Token verification failed:');
    return res.status(401).json({ error: 'Invalid token' });
  }
});

//@ts-ignore
router.post("/sessionLogin", async (req: Request, res: Response) => {
  try {
    const { idToken, username } = req.body;

    const result = await AuthService.sessionLogin(idToken, username);

    if (result.status === "NEW_USER") {
      return res.status(200).json(result); // frontend will ask for username
    }

    const token = createToken(result.user);

    setAuthCookie(res, token);

    console.log("Login cookie set");
    res.status(200).json({ status: "LOGGED_IN", user: result.user });
  } catch (e: any) {
    console.error("SessionLogin error:", e);
    res.status(401).json({ error: e.message || "Auth failed" });
  }
});






export default router;
