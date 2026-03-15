const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();


/*
REGISTER USER
POST /auth/register
*/
router.post("/register", async (req, res) => {
  try {
    const db = admin.firestore();
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // Create Firebase user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Save user data to Firestore
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    // Generate token
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.json({
      token,
      uid: userRecord.uid,
      name,
      email,
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(400).json({
      error: error.message || "Registration failed",
    });
  }
});

/*
LOGIN USER
POST /auth/login
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const firebaseRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const firebaseData = await firebaseRes.json();

    if (!firebaseRes.ok) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = await admin.auth().createCustomToken(firebaseData.localId);

    res.json({
      token,
      uid: firebaseData.localId,
      email: firebaseData.email,
      name: firebaseData.displayName,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      error: error.message || "Login failed",
    });
  }
});

module.exports = router;