// controllers/dataController.js
const path = require('path');
const fs = require('fs');

// Handle GET requests
exports.handleGetRequest = (req, res) => {
  const { type, id } = req.params;
  const filePath = path.join(__dirname, `../mock_data/${type}_${id}.json`);

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    res.status(200).json(JSON.parse(data));
  } else {
    res.status(404).json({ error: 'File not found' });
  }
};

// Handle POST requests
exports.handlePostRequest = (req, res) => {
  const { type } = req.params;
  const filePath = path.join(__dirname, `../mock_data/${type}_response.json`);

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    res.status(200).json(JSON.parse(data));
  } else {
    res.status(404).json({ error: 'Response not found' });
  }
};
