const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/users");

const router = express.Router();
const { authenticateMultiRequired } = require("../middleware/multiAuth");

// POST /api/auth/login
// No bcrypt for now to keep dummy users usable
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ message: "username or email and password are required" });
    }

    const query = username ? { username } : { email };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Plain text compare (no bcrypt as requested)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('🔍 User data for JWT:', {
      _id: user._id.toString(),
      user_uuid: user.user_uuid,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

    const jwtSecret = process.env.JWT_SECRET || "dev-secret";
    const token = jwt.sign(
      {
        sub: user._id.toString(),
        user_uuid: user.user_uuid,
        username: user.username,
        role: user.role,
        email: user.email,
        display_name: `${user.firstName} ${user.lastName}`.trim(),
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ token, user: userObj });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
  try {
    // Clear the auth cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/"
    });
    
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me - Get current user from token
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const jwtSecret = process.env.JWT_SECRET || "dev-secret";
    const decoded = jwt.verify(token, jwtSecret);
    
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const userObj = user.toObject();
    delete userObj.password;
    
    return res.json({ user: userObj });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});



router.post("/devrev-token", authenticateMultiRequired, async (req, res) => {
  try {
    console.log('🔍 Auth data received:', req.auth);
    const { user_uuid, email, display_name, username } = req.auth || {};
    const userUuid = user_uuid;
    const finalEmail = email;
    const finalDisplayName = display_name || username;

    console.log('🔍 Extracted fields:', { userUuid, finalEmail, finalDisplayName });

    if (!userUuid || !finalEmail || !finalDisplayName) {
      return res.status(400).json({ 
        message: "Required user fields missing in token",
        received: { user_uuid, email, display_name, username },
        extracted: { userUuid, finalEmail, finalDisplayName }
      });
    }

    const devrevPat = process.env.DEVREV_PAT;
    if (!devrevPat) {
      return res.status(500).json({ message: "DEVREV_PAT is not configured" });
    }

    const requestBody = {
      rev_info: {
        user_ref: userUuid,
        user_traits: {
          email: finalEmail,
          display_name: finalDisplayName,
        },
      },
    };

    const response = await axios.post(
      "https://api.devrev.ai/auth-tokens.create",
      requestBody,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          authorization: `Bearer ${devrevPat}`,
          "content-type": "application/json",
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: error.message };
    return res.status(status).json(data);
  }
});

module.exports = router;


