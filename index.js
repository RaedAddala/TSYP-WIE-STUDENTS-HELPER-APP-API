import express from "express";
import { connect as mongooseConnect } from "mongoose";
import { config as dotenvConfig } from "dotenv";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

// Import Routes
import  authRouter  from "./routes/auth.js";

// Compression Filter callback function
const shouldCompress = (req, res) => {
  if (req.headers["x-no-compression"]) {
    // don't compress responses if this request header is present
    return false;
  }
  // fallback to standard compression
  return compression.filter(req, res);
};

// Load .env Files
const app = express();
dotenvConfig();

// Need to URI Encode the auth values else they will result in a wrong URL if some special characters are used
const uri =
  process.env.CONNECTION_STRING_URN +
  encodeURIComponent(process.env.DBUSERNAME) +
  ":" +
  encodeURIComponent(process.env.PASSWORD) +
  process.env.CONNECTION_STRING_OPTIONS;

// Connect to DB
console.log(uri);
mongooseConnect(uri);
console.log("[CONNECTED TO DB SUCCESSFULY]!");

// Use Middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("common"));
app.use(
  compression({ filter: shouldCompress, threshold: 0, level: 9, memLevel: 9 })
);
// Reduce Fingerprinting
app.disable("x-powered-by");

// Route Middlewares
app.use("/api/user", authRouter);

app.listen(3000);