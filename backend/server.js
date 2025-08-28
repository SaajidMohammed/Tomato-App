// --- AT THE VERY TOP OF server.js ---
// This is a more robust way to load environment variables that prevents pathing issues.
import 'dotenv/config';
import path from 'path'; // 1. Import the 'path' module
import { fileURLToPath } from 'url'; // 2. Import helper for ES Modules

// 3. Create an absolute path to the .env file and load it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --- All other imports must come AFTER dotenv has been configured ---
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


// --- App Configuration ---
const app = express();
// Use the PORT from the .env file, with a fallback to 4000 for local development
const port = process.env.PORT || 4000;


// --- Middleware ---
// This allows the server to parse JSON data in request bodies
app.use(express.json());
// This enables Cross-Origin Resource Sharing, allowing your frontend to communicate with this backend

const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174'
    'https://tomato-app-frontend-b6oa.onrender.com',
    'https://tomato-app-admin-laf1.onrender.com'    
];

app.use(cors({ origin: allowedOrigins }));


// --- Database Connection ---
connectDB();


// --- API Endpoints ---
// This sets up the main routes for your application
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads')); // Serves static image files
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


// A simple root route to confirm the API is running
app.get("/", (req, res) => {
    res.send("API is Working");
});


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
