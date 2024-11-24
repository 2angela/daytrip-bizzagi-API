import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Storage } from "@google-cloud/storage";
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
const PRIVATE_KEY_ID = process.env.STORAGE_PRIVATE_KEY_ID;
const PRIVATE_KEY = process.env.STORAGE_PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_X509_CERT_URL = process.env.CLIENT_X509_CERT_URL;

if (!PORT) throw new Error("PORT is not defined");
if (!FIREBASE_API_KEY) throw new Error("FIREBASE_API_KEY is not provided");
if (!MESSAGING_SENDER_ID)
  throw new Error("MESSAGING_SENDER_ID is not provided");
if (!APP_ID) throw new Error("APP_ID is not provided");
if (!PLACES_API_KEY) throw new Error("PLACES_API_KEY is not provided");
if (!PRIVATE_KEY_ID) throw new Error("PRIVATE_KEY_ID is not provided");
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not provided");
if (!CLIENT_EMAIL) throw new Error("CLIENT_EMAIL is not provided");
if (!CLIENT_ID) throw new Error("CLIENT_ID is not provided");
if (!CLIENT_X509_CERT_URL)
  throw new Error("CLIENT_X509_CERT_URL is not provided");

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const credentials = JSON.parse(
  fs.readFileSync(__dirname + "/../keys/storage-credentials.json", "utf-8")
);
const storage = new Storage({
  projectId: "C242-DT01",
  credentials: {
    ...credentials,
    project_id: "C242-DT01",
    private_key_id: PRIVATE_KEY_ID,
    private_key: PRIVATE_KEY,
    client_email: CLIENT_EMAIL,
    client_id: CLIENT_ID,
    client_x509_cert_url: CLIENT_X509_CERT_URL
  }
});
const gcs = storage.bucket("c242-dt01");

app.use(express.json());
app.use(versionRouter);
app.use("*", PathHandler);
app.use(ErrorHandler);

app.listen(PORT, HOST, async () => {
  console.log("Server is running on port", PORT);
});

export { firebaseApp, firebaseAuth, db, gcs };
