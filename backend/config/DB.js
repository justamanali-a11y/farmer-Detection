const mongoose = require('mongoose');
(require('dotenv')).config();

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected")
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;