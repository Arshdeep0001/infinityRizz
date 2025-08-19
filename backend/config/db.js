const mongoose = require('mongoose'); // Import Mongoose

// Function to connect to the database
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`); // Log successful connection
    } catch (error) {
        // Log any connection errors
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;