const mongoose = require('mongoose');
(require('dotenv')).config();

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI is not configured. Continuing in demo mode without MongoDB.');
        return false;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB connected');
        return true;
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        console.warn('Continuing in demo mode without MongoDB.');
        return false;
    }
};

module.exports = connectDB;