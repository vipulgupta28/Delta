import express from 'express';
import nodemailer from "nodemailer";
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
});

const upload = multer({ storage: multer.memoryStorage() });
const otpStorage: Record<string, number> = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_PASS!,
    }
});

const sendOtpToEmail = async (userEmail: string, otp: number) => {
    const mailOption = {
        from: process.env.GMAIL_USER!,
        to: userEmail,
        subject: "Delta OTP Code",
        text: `Your OTP is : ${otp}`,
    };

    try {
        let info = await transporter.sendMail(mailOption);
        console.log("Email Sent to", info.response);
    } catch (error) {
        console.log("Error sending mail", error);
    }
};

app.post("/api/v1/get-otp", async (req, res) => {
    const email = req.body.data;
    const otp = Math.floor(1000 + Math.random() * 9000);

    console.log(`Generating OTP for ${email}: ${otp}`);

    otpStorage[email] = otp;
    try {
        await sendOtpToEmail(email, otp);
        res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

app.post("/api/v1/verify-otp", (req, res) => {
    const { otp, userEmail } = req.body;

    const storedOTP = otpStorage[userEmail];

    console.log(`Stored: ${storedOTP}, Received: ${otp}`);

    if (storedOTP && storedOTP.toString() === otp) {
        res.status(200).json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
});

app.post("/api/v1/insert-into-users-table", async (req, res) => {
    const { enteredUsername, enteredPassword, enteredEmail } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(enteredPassword, saltRounds);

        const { data, error } = await supabase
            .from("users")
            .insert([{ username: enteredUsername, email: enteredEmail, password: hashedPassword }])
            .select('user_id')
            .single()
        if (error) throw error;

        res.status(201).json({user_id: data.user_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error inserting user" });
    }
});

//@ts-ignore
app.post("/api/v1/login-into", async (req, res) => {
    const { enteredUsername, enteredPassword } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('password')
            .eq('username', enteredUsername)
            .single();

        if (error || !user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(enteredPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@ts-ignore
app.post("/api/v1/store-content", upload.single("video"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const { title, description } = req.body;  
        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;

        const { data, error } = await supabase
            .storage
            .from("videos")  
            .upload(`public/${fileName}`, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from("videos")
            .getPublicUrl(`public/${fileName}`);

        console.log("Uploaded File Public URL:", publicUrlData.publicUrl);

        await supabase
            .from("videos_metadata") 
            .insert([
                {
                    file_name: fileName,
                    file_url: publicUrlData.publicUrl, 
                    title: title, 
                    description: description, 
                    uploaded_at: new Date(),
                },
            ]);

        res.status(200).json({ publicUrl: publicUrlData.publicUrl });

    } catch (error) {
        console.error("Upload Failed:", error);
        res.status(500).json({ error: "File upload failed." });
    }
});



app.get("/api/v1/get-videos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("videos_metadata")
            .select("file_url, file_name, title, description, uploaded_at");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});


//@ts-ignore
app.get("/api/v1/get-users", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username");
  
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
  
      return res.status(200).json({ success: true, users: data });
    } catch (err) {
      return res.status(500).json({ success: false });
    }
  });
  

  app.post("/api/v1/update-username", async (req, res) => {
    const { email, newUsername } = req.body;
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ username: newUsername })
        .eq("email", email);
      
      if (error) throw error;
      res.status(200).json({ message: "Username updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error updating username" });
    }
  });
  
  app.post("/api/v1/update-password", async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      const { data, error } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("email", email);
  
      if (error) throw error;
      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error updating password" });
    }
  });
  
  app.post("/api/v1/update-email", async (req, res) => {
    const { oldEmail, newEmail } = req.body;
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ email: newEmail })
        .eq("email", oldEmail);
  
      if (error) throw error;
      res.status(200).json({ message: "Email updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error updating email" });
    }
  });

//@ts-ignore
  app.post("/api/v1/store-posts", async (req, res) => {
  const { headline, content, user_id } = req.body;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title: headline, content: content, user_id: user_id }]);

  if (error)console.log(error)

  res.status(200).json({ data });
});

// Node.js Express route to get posts
app.get("/api/v1/get-posts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


  

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
