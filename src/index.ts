import app from "./app";
import { PORT } from "./config/env.config";
import connectToDatabase from "./database/mongodb";

// PORT is already a number from env.config.ts
const port = PORT;

/**
 * Starts the server.
 * Connects to the database first, then starts listening.
 */
const startServer = async () => {
    try {
        // 1. Connect to database
        await connectToDatabase();
        
        // 2. Start listening
        app.listen(port, () => {
            console.log(`API running on port ${port}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); 
    }
};

startServer();