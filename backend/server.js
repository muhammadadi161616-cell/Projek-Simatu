const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Error Handling Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Simatu Backend server running on port ${PORT}`);
});
