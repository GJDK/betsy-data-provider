// server.js
const express = require('express');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Basic test route to verify server is running
app.get('/test', (req, res) => {
  res.send('✅ Server is working!');
});

// Use the data routes with base path /data
app.use('/data', dataRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Betsy Data Provider running at http://localhost:${PORT}`);
});
