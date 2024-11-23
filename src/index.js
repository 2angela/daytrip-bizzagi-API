import express from "express";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ErrorHandler from "./middlewares/errorHandler.js";
import PathHandler from "./middlewares/pathHandler.js";
import versionRouter from "./versions/router.js";

dotenv.config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID;
const APP_ID = process.env.APP_ID;
const PLACES_API_KEY = process.env.PLACES_API_KEY;

if (!PORT) throw new Error("PORT is not defined");
if (!FIREBASE_API_KEY) throw new Error("FIREBASE_API_KEY is not provided");
if (!MESSAGING_SENDER_ID)
  throw new Error("MESSAGING_SENDER_ID is not provided");
if (!APP_ID) throw new Error("APP_ID is not provided");
if (!PLACES_API_KEY) throw new Error("PLACES_API_KEY is not provided");

const app = express();

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "c242-dt01.firebaseapp.com",
  projectId: "c242-dt01",
  storageBucket: "c242-dt01.firebasestorage.app",
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: "G-CGZHCM5BYL"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

app.use(express.json());
app.use(versionRouter);
app.use("*", PathHandler);
app.use(ErrorHandler);

app.listen(PORT, HOST, async () => {
  console.log("Server is running on port", PORT);
});

export { firebaseApp, firebaseAuth, db };
