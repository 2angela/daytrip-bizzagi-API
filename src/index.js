import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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
  "STORAGE_PRIVATE_KEY_ID",
  "STORAGE_PRIVATE_KEY",
  "STORAGE_CLIENT_EMAIL",
  "STORAGE_CLIENT_ID",
  "ADMIN_PRIVATE_KEY_ID",
  "ADMIN_PRIVATE_KEY",
  "ADMIN_CLIENT_EMAIL",
  "ADMIN_CLIENT_ID",
  "ADMIN_CLIENT_X509_CERT_URL"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`${key} is not defined in .env`);
});

// Initialize GCS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const credentialsFile = JSON.parse(
  fs.readFileSync(__dirname + "/../keys/credentials.json", "utf-8")
);
const storageCredentials = {
  ...credentialsFile,
  project_id: "c242-dt01",
  private_key_id: process.env.STORAGE_PRIVATE_KEY_ID,
  private_key: process.env.STORAGE_PRIVATE_KEY,
  client_email: process.env.STORAGE_CLIENT_EMAIL,
  client_id: process.env.STORAGE_CLIENT_ID,
  client_x509_cert_url: process.env.STORAGE_CLIENT_X509_CERT_URL
};
const storage = new Storage({
  projectId: "C242-DT01",
  credentials: storageCredentials
});
const gcs = storage.bucket("c242-dt01");

// Initialize firebase admin, firebase app, firebase auth, firestore
const adminCredentials = {
  ...credentialsFile,
  project_id: "c242-dt01",
  private_key_id: process.env.ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.ADMIN_PRIVATE_KEY,
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  client_x509_cert_url: process.env.ADMIN_CLIENT_X509_CERT_URL
};
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
