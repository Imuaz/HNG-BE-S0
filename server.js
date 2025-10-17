import 'dotenv/config';
import express from "express";
import cors from "cors";

import profileRoutes from "./src/routes/profile.js"

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

//Basic logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/', profileRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Global error handler: return a minimal, consistent error response to clients
app.use((err, req, res, next) => {
    // Log detailed error server-side
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: err.code || null,
        httpStatus: err.httpStatus || null,
        causeMessage: err.causeMessage || null
    });

    const statusCode = err.httpStatus || err.status || 500;

    const body = {
        status: 'error',
        message: err.message || 'Internal server error'
    };

    // Include machine-readable code only in non-production environments
    if (err.code && process.env.NODE_ENV !== 'production') {
        body.code = err.code;
    }

    // Include the upstream cause message only in non-production for debugging
    if (err.causeMessage && process.env.NODE_ENV !== 'production') {
        body.error = err.causeMessage;
    }

    res.status(statusCode).json(body);
});


//start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;