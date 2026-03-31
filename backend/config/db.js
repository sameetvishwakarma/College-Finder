const mongoose = require('mongoose');
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongo DB is Connected ${mongoose.connection.host}`);
    } catch (error) {
        console.log("Connection Error", error);
    }
}

module.exports = connectDb;