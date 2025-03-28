const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Load mock data
const filePath = path.join(__dirname, '../mock_data/eagles_touchdowns_last_five_games_stats.json');
const mockData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Ollama API settings
const OLLAMA_URL = 'http://localhost:11434/api/generate'; // Ollama API endpoint
const MODEL_NAME = 'qwen2.5:3b'; // Model name

// Handle GET /getTouchDowns request
exports.getTouchDowns = async (req, res) => {
    console.log('getTouchDowns request received');
    const { team } = req.query;

    console.log('🧠 Team:', team);
  
    // Validate the query parameter
    if (team !== 'PhiladelphiaEagles') {
      return res.status(400).json({ error: 'Team not found or invalid team parameter.' });
    }
  
    // Get the team's data
    const teamData = mockData.PhiladelphiaEagles;
  
    // Prepare the updated prompt for Ollama
    const prompt = `
      Summarize the number of touchdowns scored by the Philadelphia Eagles in their last five games along with the key performers, based on the following data:
      ${JSON.stringify(teamData.last_five_games, null, 2)}
      
      Return only a concise summary in plain text without any additional formatting or JSON structure.
    `;

    console.log('🧠 Prompt:', prompt);
  
    console.log('📡 Calling Ollama API...', OLLAMA_URL);
    try {
      // Send the prompt to Ollama and get the response
      const ollamaResponse = await axios.post(OLLAMA_URL, {
        model: MODEL_NAME,
        prompt: prompt,
        stream: false
      });
  
      // Extract and clean the plain text summary from the response
      const summary = ollamaResponse.data.response.trim();
  
      // Prepare the final response with only the summary
      res.status(200).json({
        summary: summary
      });
    } catch (error) {
      console.error('Error communicating with Ollama:', error.message);
      res.status(500).json({ error: 'Failed to communicate with Ollama model.' });
    }
  };