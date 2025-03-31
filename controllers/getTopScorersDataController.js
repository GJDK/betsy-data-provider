const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('../config');

// Define available teams and their corresponding JSON file names
const teamFileMap = {
    'PhiladelphiaEagles': 'PhiladelphiaEagles_TopScorers.json',
    'KansasCityChiefs': 'KansasCityChiefs_TopScorers.json'
};

// Handle GET /getTopScorers request
exports.getTopScorers = async (req, res) => {
    const { teams } = req.query;

    // Check if the teams parameter is provided
    if (!teams) {
        return res.status(400).json({ error: 'No teams provided. Please provide teams as comma-separated values.' });
    }

    // Split teams by comma and trim any extra spaces
    const teamList = teams.split(',').map((team) => team.trim());

    // Prepare the response object
    const results = {};

    // Iterate through each team and fetch data
    for (const team of teamList) {
        if (teamFileMap[team]) {
            const filePath = path.join(__dirname, `../mock_data/${teamFileMap[team]}`);
            
            try {
                // Load the corresponding team's JSON file
                const teamData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                results[team] = teamData.top_scorers;
            } catch (error) {
                console.error(`❌ Error loading data for ${team}:`, error.message);
                results[team] = 'Error loading team data.';
            }
        } else {
            results[team] = 'Team data not found.';
        }
    }

    try {
        // Constructing a prompt for Ollama with multiple teams data
        const prompt = `
        Provide a brief summary of the top scorers for the following teams:
        ${JSON.stringify(results, null, 2)}
      `;

        console.log('🧠 Prompt:', prompt);

        // Call Ollama API
        console.log('📡 Calling Ollama API...', config.OLLAMA_URL);
        const response = await axios.post(config.OLLAMA_URL, {
            model: config.MODEL_NAME,
            prompt: prompt,
            stream: false // Get a complete response
        });

        // Print the raw response from Ollama for debugging
        console.log('🧠 Raw Ollama Response:', response.data);

        // Extract and trim Ollama response
        let ollamaResponse = response.data.response?.trim();

        // Handle unexpected responses gracefully
        if (!ollamaResponse) {
            console.warn('⚠️ Unexpected response from Ollama:', ollamaResponse);
            ollamaResponse = 'No valid data available.';
        }

        // Print the processed response before sending to the client
        console.log('✅ Processed Ollama Response:', ollamaResponse);

        // Send the response as JSON
        res.status(200).json({
            summary: ollamaResponse,
            top_scorers: results
        });

    } catch (error) {
        console.error('❌ Error calling Ollama:', error.message);
        res.status(500).json({ error: 'Error processing the request with Ollama.' });
    }
};
