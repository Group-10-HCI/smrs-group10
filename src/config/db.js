const mongoose = require('mongoose');
const env = require('./env');

module.exports = async function connectDB() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};