const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('../config');

// Load mock data
const filePath = path.join(__dirname, '../mock_data/eagles_chiefs_game_stats.json');
const mockData = JSON.parse(fs.readFileSync(filePath, 'utf-8')); 

// Handle GET /getWinner request
exports.getWinner = async (req, res) => {
    const { match } = req.query;

    // Check for valid match parameter
    if (match !== 'PhiladelphiaEaglesVsKansasCityChiefs') {
        return res.status(400).json({ error: 'Match not found or invalid match parameter.' });
    }

    // Get the latest match data
    const latestMatch = mockData.matchups[mockData.matchups.length - 1];

    try {
        // Updated prompt to return full team name
        const prompt = `
      Based on this data, who has the higher probability to win in the match? Give me the result alone without details.
      ${JSON.stringify(latestMatch, null, 2)}
    `;

        console.log('🧠 Prompt:', prompt);

        // Call Ollama API
        console.log('📡 Calling Ollama API...', config.OLLAMA_URL);
        const response = await axios.post(config.OLLAMA_URL, {
            model: config.MODEL_NAME,
            prompt: prompt,
            stream: false, // Get a complete response
        });

        // Print the raw response from Ollama for debugging
        console.log('🧠 Raw Ollama Response:', response.data);

        // Extract and trim Ollama response
        let ollamaResponse = response.data.response?.trim();

        // Handle unexpected responses gracefully
        if (!ollamaResponse || (!ollamaResponse.includes('Eagles') && !ollamaResponse.includes('Chiefs'))) {
            console.warn('⚠️ Unexpected response from Ollama:', ollamaResponse);
            ollamaResponse = 'Unknown Winner';
        }

        // Print the processed response before sending to the client
        console.log('✅ Processed Ollama Response:', ollamaResponse);

        // Send the response as JSON
        res.status(200).json({
            winner: ollamaResponse,
        });

    } catch (error) {
        console.error('❌ Error calling Ollama:', error.message);
        res.status(500).json({ error: 'Error processing the request with Ollama.' });
    }
};
