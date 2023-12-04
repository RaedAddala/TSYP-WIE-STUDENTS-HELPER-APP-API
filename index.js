import express from "express";
import { connect as mongooseConnect } from "mongoose";
import { config as dotenvConfig } from "dotenv";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compressor from "./middlewares/compression.js";
import limiter from "./middlewares/rate-limiting.js";

// Import Routes
import authRouter from "./routes/auth.js";

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
app.use(compressor);
app.use(limiter);
// Reduce Fingerprinting
app.disable("x-powered-by");

// Route Middlewares
app.use("/api/user", authRouter);

app.listen(3000);
