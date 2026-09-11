require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/DB")
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5000;

// ----------------------------------------
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
// ----------------------------------------

// connecting DB
connectDB();

// cors is allowing frontend to request backend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
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
    res.status(error.status || 500).json({ message: "Something went wrong. Please try again." });
});