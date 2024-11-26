import express from "express";
import dotenv from "dotenv";
import { firebaseAuth, db, gcs } from "./firebase.js"; // Menggunakan Firebase dari file firebase.js
import ErrorHandler from "./middlewares/errorHandler.js";
import PathHandler from "./middlewares/pathHandler.js";
import versionRouter from "./versions/router.js";

dotenv.config();

const requiredEnv = ["PORT", "HOST"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`${key} is not defined in .env`);
});

const app = express();

app.use(express.json());

// Rute utama menggunakan versionRouter
app.use(versionRouter);

// Path Handler
app.use("*", PathHandler);

// Error Handler
app.use(ErrorHandler);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
});

export { firebaseAuth, db, gcs };
