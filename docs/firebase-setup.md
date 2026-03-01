# Firebase Setup – Multi Media Review Platform

## Firebase Project Information

**Project Name:** multi-media-review-platform  
**Region:** (e.g. europe-west1)  
**Services Enabled:**
- Authentication (Email/Password)
- Cloud Firestore

---

## Authentication

Email/Password authentication has been enabled in the Firebase Console.

Users can register and log in using email and password.

---

## Firestore Database

Firestore has been created in test mode for development.

⚠ Before production, security rules must be updated.

---

## Team Access

All team members have been added to the Firebase project as **Editor**.

If access is needed:
1. Contact the project Owner.
2. Provide your Google account email.
3. Accept the invite from Firebase.

---

## Environment Variables

When the frontend is initialized, create a `.env` file using the following variables:
(I have the following variables with the real data inputed to .gitignore)

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

These values can be found in:

Firebase Console → Project Settings → General → Your Apps

---

## Installing Firebase (When Frontend Is Ready)

Inside the frontend folder:

```
npm install firebase
```

Create:

```
frontend/src/firebase.js
```

Add Firebase initialization and export:

- initializeApp
- getAuth
- getFirestore

---

## Sprint Completion

✔ Firebase project created  
✔ Authentication enabled  
✔ Firestore created  
✔ Team members added  
✔ Documentation added  