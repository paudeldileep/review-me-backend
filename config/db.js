const mongoose = require('mongoose');
require('dotenv').config();

const db = process.env.MONGO_URI

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false, // Don't build indexes
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 60000 // Close sockets after 45 seconds of inactivity
    
  };
const connectDB = async () => {
    try {
        await mongoose.connect(db,options);

        console.log('DB Connected');
    } catch (err) {
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;