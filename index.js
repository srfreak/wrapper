require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
// We will set this token securely in Railway later
const VALID_TOKEN = process.env.API_TOKEN || '^IkVM%VK1;Yb2&b0bYIiqAt9kKhBSnKa'; 

// Middleware to check the Bearer token
const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extracts token from "Bearer <token>"

    if (!token || token !== VALID_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API token.' });
    }
    next();
};

// Route to fetch vehicle details (protected by token)
app.get('/api/vehicle', checkToken, async (req, res) => {
    const rc = req.query.rc;
    
    if (!rc) {
        return res.status(400).json({ error: 'Registration Certificate (rc) parameter is required.' });
    }

    try {
        const targetUrl = `https://vapi-lime-ten.vercel.app/vehicle/full-details?rc=${rc}`;
        const response = await axios.get(targetUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: 'Failed to fetch vehicle data from upstream API.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});