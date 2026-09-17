require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/DB")
const authRoutes = require("./routes/authRoutes");
const detectionRoutes = require("./routes/detectionRoutes");

const app = express();
const port = process.env.PORT || 5001;

// ----------------------------------------
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
// ----------------------------------------

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
].filter(Boolean);

// connecting DB
connectDB();

// cors is allowing frontend to request backend
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/auth", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
}));

app.use("/api/auth", authRoutes);
app.use("/api/detection", detectionRoutes);

app.get("/api/health", (req, res) => {
    // api handle karega ai ko or jo data milega use res se send karega
    // (dummy data)
    res.json({
        crop: "Tomato",
        disease: "Early Blight",
        confidence: "92%",
        severity: "Moderate",
        recommendation: "Remove infected leaves and apply suitable fungicide.",
    });
});

app.listen(port, () => {
    console.log(`Backend running `);
});

app.use((error, req, res, next) => {
    console.error("Unhandled API error:", error.message);
    res.status(error.status || 400).json({ message: error.message || "Something went wrong. Please try again." });
});