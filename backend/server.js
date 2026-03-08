// IMPORTS

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// FIREBASE SETUP

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// EXPRESS SETUP

const app = express();

app.use(cors());
app.use(express.json());

// FIREBASE FUNCTIONS

async function saveUserData(uid, data) {
  await db.collection("users").doc(uid).set(data);
}

async function getUserData(uid) {
  const doc = await db.collection("users").doc(uid).get();

  if (!doc.exists) return null;

  return doc.data();
}

// ROUTES

// Root route
app.get("/", (req, res) => {
  res.send("Backend baby!");
});

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// Save user data
app.post("/save", async (req, res) => {
  try {
    const { uid, data } = req.body;

    if (!uid || !data) {
      return res.status(400).send("Missing uid or data");
    }

    await saveUserData(uid, data);

    res.send("Saved successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get user data
app.get("/data/:uid", async (req, res) => {
  try {
    const data = await getUserData(req.params.uid);

    if (!data) {
      return res.status(404).send("User not found");
    }

    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// AUTH ROUTES

// Register
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;

  // Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await saveUserData(userRecord.uid, {
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.json({ token, uid: userRecord.uid, name, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.json({
      token,
      uid: userRecord.uid,
      email,
      name: userRecord.displayName,
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

// TEST SAVE TO FIREBASE
app.get("/test-save", async (req, res) => {
  try {
    const docRef = await db.collection("testCollection").add({
      name: "Eoghan",
      score: 42,
      createdAt: new Date(),
    });

    res.send(`Saved test document with ID: ${docRef.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving to Firebase");
  }
});

// TEST GET FROM FIREBASE
app.get("/test-get", async (req, res) => {
  try {
    const snapshot = await db.collection("testCollection").get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving from Firebase");
  }
});

// START SERVER

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
