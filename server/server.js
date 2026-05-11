require('dotenv').config();
const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Hados Backend API is running' });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
