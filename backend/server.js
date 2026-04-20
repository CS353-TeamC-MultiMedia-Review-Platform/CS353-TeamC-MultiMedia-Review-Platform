// IMPORTS

require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const https = require("https");
const authMiddleware = require("./middleware/auth");

// FIREBASE SETUP

let serviceAccount;

// Try to load from environment variable first (for Railway/production)
if (process.env.FIREBASE_CREDENTIALS) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  } catch (error) {
    console.error("Failed to parse FIREBASE_CREDENTIALS:", error);
    process.exit(1);
  }
} else {
  // Fallback to file (for local development)
  try {
    serviceAccount = require("./serviceAccountKey.json");
  } catch (error) {
    console.error(
      "serviceAccountKey.json not found and FIREBASE_CREDENTIALS not set",
    );
    process.exit(1);
  }
}

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

// UTILITY FUNCTIONS

// Convert Firestore Timestamp to ISO string for JSON serialization
function convertTimestamp(obj) {
  if (!obj) return obj;

  const converted = { ...obj };
  if (
    converted.createdAt &&
    typeof converted.createdAt === "object" &&
    converted.createdAt.toDate
  ) {
    converted.createdAt = converted.createdAt.toDate().toISOString();
  }
  return converted;
}

// REVIEW VALIDATION FUNCTIONS

function validateReviewData(data) {
  const errors = [];

  // Validate required fields
  if (!data.userId || typeof data.userId !== "string") {
    errors.push("userId is required and must be a string");
  }
  if (!data.userName || typeof data.userName !== "string") {
    errors.push("userName is required and must be a string");
  }
  if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
    errors.push("rating must be a number between 1 and 5");
  }
  if (!data.reviewText || typeof data.reviewText !== "string") {
    errors.push("reviewText is required and must be a string");
  }
  if (data.reviewText.length < 10) {
    errors.push("reviewText must be at least 10 characters");
  }
  if (data.reviewText.length > 2000) {
    errors.push("reviewText cannot exceed 2000 characters");
  }
  if (!data.mediaTitle || typeof data.mediaTitle !== "string") {
    errors.push("mediaTitle is required and must be a string");
  }
  if (!["movie", "music", "book"].includes(data.mediaType)) {
    errors.push("mediaType must be one of: movie, music, book");
  }

  // Validate optional fields
  if (data.mediaId && typeof data.mediaId !== "string") {
    errors.push("mediaId must be a string");
  }
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push("tags must be an array");
  }
  if (data.tags && data.tags.length > 10) {
    errors.push("tags cannot have more than 10 items");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// REVIEW DATABASE FUNCTIONS

async function createReview(reviewData) {
  const validation = validateReviewData(reviewData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  const sanitizedData = {
    userId: reviewData.userId.trim(),
    userName: reviewData.userName.trim(),
    rating: parseInt(reviewData.rating),
    reviewText: reviewData.reviewText.trim(),
    mediaTitle: reviewData.mediaTitle.trim(),
    mediaType: reviewData.mediaType,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    helpful: 0,
    unhelpful: 0,
  };

  // Add optional fields if provided
  if (reviewData.mediaId) {
    sanitizedData.mediaId = reviewData.mediaId.trim();
  }
  if (reviewData.tags && Array.isArray(reviewData.tags)) {
    sanitizedData.tags = reviewData.tags
      .filter((tag) => typeof tag === "string")
      .slice(0, 10);
  }

  const docRef = await db.collection("reviews").add(sanitizedData);
  return { id: docRef.id, ...sanitizedData };
}

async function getReview(reviewId) {
  const doc = await db.collection("reviews").doc(reviewId).get();

  if (!doc.exists) {
    return null;
  }

  return convertTimestamp({ id: doc.id, ...doc.data() });
}

async function getUserReviews(userId, limit = 20) {
  const snapshot = await db
    .collection("reviews")
    .where("userId", "==", userId)
    .limit(limit * 2) // Get more to account for sorting
    .get();

  // Sort in application layer since Firestore composite index isn't available
  const reviews = snapshot.docs.map((doc) =>
    convertTimestamp({
      id: doc.id,
      ...doc.data(),
    }),
  );

  // Sort by createdAt descending
  reviews.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return reviews.slice(0, limit);
}

async function getAllReviews(limit = 50) {
  const snapshot = await db
    .collection("reviews")
    .limit(limit * 2)
    .get();

  const reviews = snapshot.docs.map((doc) =>
    convertTimestamp({
      id: doc.id,
      ...doc.data(),
    }),
  );

  // Shuffle randomly using sort with Math.random()
  reviews.sort(() => Math.random() - 0.5);

  return reviews.slice(0, limit);
}

async function getReviewsByMedia(mediaTitle, limit = 20) {
  const snapshot = await db
    .collection("reviews")
    .where("mediaTitle", "==", mediaTitle)
    .limit(limit * 2) // Get more to account for sorting
    .get();

  // Sort in application layer
  const reviews = snapshot.docs.map((doc) =>
    convertTimestamp({
      id: doc.id,
      ...doc.data(),
    }),
  );

  // Sort by createdAt descending
  reviews.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return reviews.slice(0, limit);
}

async function updateReview(reviewId, updatedData) {
  const doc = await db.collection("reviews").doc(reviewId).get();

  if (!doc.exists) {
    throw new Error("Review not found");
  }

  const currentData = doc.data();

  // Only allow updating certain fields
  const allowedUpdates = {
    rating: updatedData.rating,
    reviewText: updatedData.reviewText,
    tags: updatedData.tags,
  };

  // Remove undefined values
  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });

  // Validate the updated data
  const validation = validateReviewData({
    ...currentData,
    ...allowedUpdates,
  });

  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  allowedUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  await db.collection("reviews").doc(reviewId).update(allowedUpdates);
  const updatedDoc = await db.collection("reviews").doc(reviewId).get();

  return { id: reviewId, ...updatedDoc.data() };
}

async function deleteReview(reviewId) {
  const doc = await db.collection("reviews").doc(reviewId).get();

  if (!doc.exists) {
    throw new Error("Review not found");
  }

  await db.collection("reviews").doc(reviewId).delete();
  return { id: reviewId, message: "Review deleted successfully" };
}

async function incrementHelpful(reviewId) {
  const doc = await db.collection("reviews").doc(reviewId).get();

  if (!doc.exists) {
    throw new Error("Review not found");
  }

  await db
    .collection("reviews")
    .doc(reviewId)
    .update({
      helpful: admin.firestore.FieldValue.increment(1),
    });

  const updatedDoc = await db.collection("reviews").doc(reviewId).get();
  return { id: reviewId, ...updatedDoc.data() };
}

async function incrementUnhelpful(reviewId) {
  const doc = await db.collection("reviews").doc(reviewId).get();

  if (!doc.exists) {
    throw new Error("Review not found");
  }

  await db
    .collection("reviews")
    .doc(reviewId)
    .update({
      unhelpful: admin.firestore.FieldValue.increment(1),
    });

  const updatedDoc = await db.collection("reviews").doc(reviewId).get();
  return { id: reviewId, ...updatedDoc.data() };
}

async function decrementHelpful(reviewId) {
  const doc = await db.collection("reviews").doc(reviewId).get();

  if (!doc.exists) {
    throw new Error("Review not found");
  }

  const currentHelpful = doc.data().helpful || 0;
  await db
    .collection("reviews")
    .doc(reviewId)
    .update({
      helpful: Math.max(0, currentHelpful - 1),
    });

  const updatedDoc = await db.collection("reviews").doc(reviewId).get();
  return { id: reviewId, ...updatedDoc.data() };
}

async function decrementUnhelpful(reviewId) {
  const doc = await db.collection("reviews").doc(reviewId).get();

  if (!doc.exists) {
    throw new Error("Review not found");
  }

  const currentUnhelpful = doc.data().unhelpful || 0;
  await db
    .collection("reviews")
    .doc(reviewId)
    .update({
      unhelpful: Math.max(0, currentUnhelpful - 1),
    });

  const updatedDoc = await db.collection("reviews").doc(reviewId).get();
  return { id: reviewId, ...updatedDoc.data() };
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

    // Create custom token first for authentication
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    // Exchange custom token for ID token using Firebase REST API
    const firebaseRestApiKey = process.env.FIREBASE_API_KEY;
    const idTokenResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseRestApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      },
    );

    const idTokenData = await idTokenResponse.json();
    
    if (!idTokenResponse.ok) {
      throw new Error("Failed to get ID token");
    }

    res.json({ 
      token: idTokenData.idToken, 
      uid: userRecord.uid, 
      name, 
      email 
    });
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
    // Verify password using Firebase REST API
    const firebaseRestApiKey = process.env.FIREBASE_API_KEY;

    if (!firebaseRestApiKey) {
      console.error("FIREBASE_API_KEY not set in environment variables");
      return res
        .status(500)
        .json({ error: "Server configuration error: missing API key" });
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseRestApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data.error?.message);
      return res.status(401).json({
        error:
          data.error?.message === "INVALID_LOGIN_CREDENTIALS"
            ? "Invalid email or password"
            : "Login failed",
      });
    }

    // Get user info to include display name
    const userRecord = await admin.auth().getUser(data.localId);

    // Use ID Token from Firebase (more reliable than custom token)
    const idToken = data.idToken;

    res.json({
      token: idToken,
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || "",
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// REVIEW ROUTES

// Create a new review (requires authentication)
app.post("/reviews/create", authMiddleware, async (req, res) => {
  try {
    const {
      userId,
      userName,
      rating,
      reviewText,
      mediaTitle,
      mediaType,
      mediaId,
      tags,
    } = req.body;

    // Verify user authentication via middleware
    // req.user is set by authMiddleware with decoded token
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ error: "User must be authenticated" });
    }

    // Verify userId matches authenticated user (security check)
    if (userId && userId !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Cannot create review for another user" });
    }

    const reviewData = {
      userId: req.user.uid,
      userName: userName || req.user.email || "Anonymous",
      rating,
      reviewText,
      mediaTitle,
      mediaType,
      mediaId,
      tags,
    };

    const review = await createReview(reviewData);
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get a single review by ID
app.get("/reviews/:id", async (req, res) => {
  try {
    const review = await getReview(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews (paginated)
app.get("/reviews", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const reviews = await getAllReviews(limit);
    res.json({ count: reviews.length, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get reviews by media title
app.get("/reviews/media/:title", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const reviews = await getReviewsByMedia(req.params.title, limit);
    res.json({ count: reviews.length, reviews });
  } catch (error) {
    console.error("Error fetching media reviews:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a review (requires authentication)
app.put("/reviews/:id", authMiddleware, async (req, res) => {
  try {
    const { rating, reviewText, tags } = req.body;

    // Verify user is authenticated via middleware
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ error: "User must be authenticated" });
    }

    // Get the existing review to verify ownership
    const existingReview = await getReview(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Verify the user owns this review
    if (existingReview.userId !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "You can only edit your own reviews" });
    }

    const updatedData = {
      rating,
      reviewText,
      tags,
    };

    const review = await updateReview(req.params.id, updatedData);
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a review (requires authentication)
app.delete("/reviews/:id", authMiddleware, async (req, res) => {
  try {
    // Verify user is authenticated via middleware
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ error: "User must be authenticated" });
    }

    // Get the existing review to verify ownership
    const existingReview = await getReview(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Verify the user owns this review
    if (existingReview.userId !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "You can only delete your own reviews" });
    }

    const result = await deleteReview(req.params.id);
    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(400).json({ error: error.message });
  }
});

// Mark a review as helpful
app.post("/reviews/:id/helpful", async (req, res) => {
  try {
    const review = await incrementHelpful(req.params.id);
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error incrementing helpful count:", error);
    res.status(400).json({ error: error.message });
  }
});

// Mark a review as unhelpful
app.post("/reviews/:id/unhelpful", async (req, res) => {
  try {
    const review = await incrementUnhelpful(req.params.id);
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error incrementing unhelpful count:", error);
    res.status(400).json({ error: error.message });
  }
});

// Remove helpful vote from a review
app.post("/reviews/:id/helpful/undo", async (req, res) => {
  try {
    const review = await decrementHelpful(req.params.id);
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error decrementing helpful count:", error);
    res.status(400).json({ error: error.message });
  }
});

// Remove unhelpful vote from a review
app.post("/reviews/:id/unhelpful/undo", async (req, res) => {
  try {
    const review = await decrementUnhelpful(req.params.id);
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error decrementing unhelpful count:", error);
    res.status(400).json({ error: error.message });
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

app.get("/reviews/user/:id", async (req, res) => {
  try {
    const snapshot = await db
      .collection("reviews")
      .where("userId", "==", req.params.id)
      .get();

    const reviews = snapshot.docs.map((doc) =>
      convertTimestamp({
        id: doc.id,
        ...doc.data(),
      }),
    );

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// START SERVER

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
