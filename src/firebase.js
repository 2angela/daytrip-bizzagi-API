import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "c242-dt01",
      private_key_id: process.env.STORAGE_PRIVATE_KEY_ID,
      private_key: process.env.STORAGE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url:
        "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    }),
    storageBucket: "c242-dt01.appspot.com",
  });
}

const db = admin.firestore();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "c242-dt01.firebaseapp.com",
  projectId: "c242-dt01",
  storageBucket: "c242-dt01.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: "G-CGZHCM5BYL",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
// const db = getFirestore(firebaseApp);

// Google Cloud Storage
const storage = new Storage({
    projectId: "c242-dt01",
    credentials: {
      type: "service_account",
      project_id: "c242-dt01",
      private_key_id: process.env.STORAGE_PRIVATE_KEY_ID,
      private_key: process.env.STORAGE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
    },
});
const gcs = storage.bucket("c242-dt01.appspot.com");

export { admin, firebaseApp, firebaseAuth, db, gcs };
