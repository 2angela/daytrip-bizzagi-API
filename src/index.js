import express from "express";
import dotenv from "dotenv";
import { initializeApp as initializeAppAdmin, cert } from "firebase-admin/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Storage } from "@google-cloud/storage";
import ErrorHandler from "./middlewares/errorHandler.js";
import PathHandler from "./middlewares/pathHandler.js";
import versionRouter from "./versions/router.js";

dotenv.config();

const requiredEnv = [
  "PORT",
  "FIREBASE_API_KEY",
  "MESSAGING_SENDER_ID",
  "APP_ID",
  "BASE64_STORAGE_SERVICE_ACCOUNT",
  "BASE64_FIREBASE_ADMIN_SERVICE_ACCOUNT"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`${key} is not defined in .env`);
});

// Initialize GCS
const decodedStorageSA = Buffer.from(
  process.env.BASE64_STORAGE_SERVICE_ACCOUNT,
  "base64"
).toString("utf-8");
const storageCredentials = JSON.parse(decodedStorageSA);
const storage = new Storage({
  projectId: "C242-DT01",
  credentials: storageCredentials
});
const gcs = storage.bucket("c242-dt01");

// Initialize firebase admin, firebase app, firebase auth, firestore
const decodedFirebaseAdminSA = Buffer.from(
  process.env.BASE64_FIREBASE_ADMIN_SERVICE_ACCOUNT,
  "base64"
).toString("utf-8");
const adminCredentials = JSON.parse(decodedFirebaseAdminSA);
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "c242-dt01.firebaseapp.com",
  projectId: "c242-dt01",
  storageBucket: "c242-dt01.firebasestorage.app",
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: "G-CGZHCM5BYL"
};

const firebaseAdmin = initializeAppAdmin({
  credential: cert(adminCredentials)
});
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Initialize Express app and set middlewares
// order: route -> path error -> error
const app = express();
app.use(express.json());
app.use(versionRouter);
app.use("*", PathHandler);
app.use(ErrorHandler);

const PORT = process.env.PORT;
const HOST = process.env.HOST;
app.listen(PORT, HOST, () => {
  console.log("Server is running on port", PORT);
});

export { firebaseAdmin, firebaseApp, firebaseAuth, db, gcs };
