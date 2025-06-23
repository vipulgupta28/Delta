import express from 'express';
import nodemailer from "nodemailer";
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { createServer } from "http";
import { Server } from "socket.io";
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

        await supabase
        .from("profiles")
        .insert([{user_id:data.user_id}]);


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






//@ts-ignore
app.post("/api/v1/store-short-content", upload.single("video"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const { title, description } = req.body;  
        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;

        const { data, error } = await supabase
            .storage
            .from("shortvideos")  
            .upload(`${fileName}`, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from("shortvideos")
            .getPublicUrl(`${fileName}`);

        console.log("Uploaded File Public URL:", publicUrlData.publicUrl);

        const {error: insertError} = await supabase
            .from("short_videos_metadata") 
            .insert([
                {
                    file_name: fileName,
                    file_url: publicUrlData.publicUrl,
                    uploaded_at: new Date(), 
                    title: title, 
                    description: description, 
                    
                },
            ]);
            if (insertError) {
  console.error("Database Insert Error:", insertError);
  return res.status(500).json({ error: "DB insert failed", detail: insertError });
}

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



app.get("/api/v1/get-short-videos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("short_videos_metadata")
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
  const { headline, content, user_id, selectedCategory, username } = req.body;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title: headline, content: content, user_id: user_id, username:username, category:selectedCategory }])
    .select()
    ;

  if (error)console.log("username ka chakkar")

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



app.get("/api/v1/get-userposts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId) // assuming the column name is user_id
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});




app.post("/api/v1/likes", async (req, res) => {
  const { user_id, post_id } = req.body;

  try {
    // 1. Insert into likes table
    const { error: insertError } = await supabase
      .from("likes")
      .insert([{ user_id, post_id }]);

    if (insertError) throw insertError;

    // 2. Increment likes_count in posts table
    const { error: updateError } = await supabase.rpc("increment_likes_count", {
      post_id_input: post_id,
    });

    if (updateError) throw updateError;

    res.status(200).json({ message: "Liked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like post" });
  }
});


//@ts-ignore
app.post("/api/v1/handleProfileChanges", upload.fields([
  { name: "banner", maxCount: 1 },
  { name: "profile", maxCount: 1 }
  //@ts-ignore
]), async (req, res) => {
  const { userId, bio, location } = req.body;

  if (!userId || !bio) {
    return res.status(400).json({ error: "User ID and bio are required." });
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const bannerFile = files?.banner?.[0];
  const profileFile = files?.profile?.[0];
  let bannerUrl = null;
  let profileUrl = null;

  try {
    // Handle Banner Upload
    
    if (bannerFile) {
      const bannerFileName = `${userId}/banner-${Date.now()}-${bannerFile.originalname}`;
      const { error: bannerError } = await supabase.storage
        .from("user-assets") // your Supabase storage bucket
        .upload(bannerFileName, bannerFile.buffer, {
          contentType: bannerFile.mimetype,
          upsert: true,
        });

      if (bannerError) throw bannerError;

      const { data: bannerPublicUrl } = supabase
        .storage
        .from("user-assets")
        .getPublicUrl(bannerFileName);
      bannerUrl = bannerPublicUrl.publicUrl;
    }

    if (profileFile) {
      const profileFileName = `${userId}/profile-${Date.now()}-${profileFile.originalname}`;
      const { error: profileError } = await supabase.storage
        .from("user-assets")
        .upload(profileFileName, profileFile.buffer, {
          contentType: profileFile.mimetype,
          upsert: true,
        });

      if (profileError) throw profileError;

      const { data: profilePublicUrl } = supabase
        .storage
        .from("user-assets")
        .getPublicUrl(profileFileName);
      profileUrl = profilePublicUrl.publicUrl;
    }

    // Now update Supabase DB
    const { data, error } = await supabase
      .from("profiles")
      .upsert([{
        user_id: userId,
        bio,
        location,
        banner_img: bannerUrl,
        profile_img: profileUrl,
      }], { onConflict: 'user_id' })
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to update profile." });
    }

    res.status(200).json({ message: "Profile updated successfully", data });

  } catch (err) {
    console.error("Server Error:");
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});


//@ts-ignore
app.get("/api/v1/getProfileChanges/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, bio, location, banner_img, profile_img")
      .eq("user_id", userId)
      .single(); // Ensures only one record is fetched

    if (error || !data) {
      console.error("Error fetching profile:", error || "No data found");
      return res.status(404).json({ error: "Profile not found." });
    }

    res.status(200).json({ profile: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error." });
  }
});



//@ts-ignore
app.post("/api/v1/handleFollow", async (req, res) => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ error: "Missing followerId or followingId" });
  }

  try {
    // Step 1: Get current follower count of the target user
    const { data: targetUserData, error: targetUserError } = await supabase
      .from("profiles")
      .select("followers")
      .eq("id", followingId)
      .single();

    // Step 2: Get current following count of the logged-in user
    const { data: currentUserData, error: currentUserError } = await supabase
      .from("profiles")
      .select("following")
      .eq("id", followerId)
      .single();

    if (targetUserError || currentUserError) {
      return res.status(500).json({ error: "Failed to fetch profile counts." });
    }

    const newFollowers = (targetUserData?.followers || 0) + 1;
    const newFollowing = (currentUserData?.following || 0) + 1;

    // Step 3: Update both users
    const [{ error: updateTargetError }, { error: updateCurrentError }] = await Promise.all([
      supabase.from("profiles").update({ followers: newFollowers }).eq("id", followingId),
      supabase.from("profiles").update({ following: newFollowing }).eq("id", followerId),
    ]);

    if (updateTargetError || updateCurrentError) {
      return res.status(500).json({ error: "Failed to update counts." });
    }

    return res.status(200).json({ message: "Follow updated successfully" });

  } catch (err) {
    return res.status(500).json({ error: "Unexpected server error" });
  }
});





const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

let rooms: Record<string, { name: string; description: string }> = {};

app.post("/api/v1/create-room", (req, res) => {
  const { name, description } = req.body;
  const roomId = Math.random().toString(36).substr(2, 9);
  rooms[roomId] = { name, description };
  res.json({ roomId, name, description });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send-message", ({ roomId, message, sender }) => {
    io.to(roomId).emit("receive-message", { message, sender });
  });
});




  

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
