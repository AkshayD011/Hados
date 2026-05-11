/**
 * Health check controller
 * Ensures the backend is up and running.
 */

const getHealthStatus = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Backend is healthy and running smoothly.',
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    getHealthStatus
};
