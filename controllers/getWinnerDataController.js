const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('../config');

// Load mock data
const eaglesChiefsFilePath = path.join(__dirname, '../mock_data/eagles_chiefs_game_stats.json');
const cardinalsBillsFilePath = path.join(__dirname, '../mock_data/cardinals_bills_game_stats.json');
const steelersBengalsFilePath = path.join(__dirname, '../mock_data/steelers_bengals_game_stats.json');

const eaglesChiefsData = JSON.parse(fs.readFileSync(eaglesChiefsFilePath, 'utf-8'));
const cardinalsBillsData = JSON.parse(fs.readFileSync(cardinalsBillsFilePath, 'utf-8'));
const steelersBengalsData = JSON.parse(fs.readFileSync(steelersBengalsFilePath, 'utf-8'));

// Function to determine win probability based on match history
const analyzeMatchup = (matchData) => {
    const matchups = matchData.matchups;
    let teamWinCount = {};

    // Count wins for each team
    matchups.forEach(({ winner }) => {
        teamWinCount[winner] = (teamWinCount[winner] || 0) + 1;
    });

    // Get latest match
    const latestMatch = matchups[matchups.length - 1];

    // Determine probabilities
    const totalGames = matchups.length;
    const teamNames = Object.keys(teamWinCount);
    const probabilities = teamNames.map(team => ({
        team,
        winPercentage: ((teamWinCount[team] || 0) / totalGames) * 100
    }));

    // Sort by win percentage (descending order)
    probabilities.sort((a, b) => b.winPercentage - a.winPercentage);

    // Select the team with the highest probability
    const likelyWinner = probabilities[0].team;
    const reasoning = `${likelyWinner} has a higher probability of winning, having won ${teamWinCount[likelyWinner]} out of ${totalGames} matchups (${probabilities[0].winPercentage.toFixed(2)}% win rate).`;

    return { likelyWinner, reasoning, latestMatch };
};

// Handle GET /getWinner request
exports.getWinner = async (req, res) => {
    const { match } = req.query;

    let mockData;

    if (match === 'PhiladelphiaEaglesVsKansasCityChiefs') {
        mockData = eaglesChiefsData;
    } else if (match === 'ArizonaCardinalsVsBuffaloBills') {
        mockData = cardinalsBillsData;
    } else if (match === 'PittsburghSteelersVsCincinnatiBengals') {
        mockData = steelersBengalsData;
    } else {
        return res.status(400).json({ error: 'Match not found or invalid match parameter.' });
    }

    const latestMatch = mockData.matchups[mockData.matchups.length - 1];

    try {
        const prompt = `
      Based on the provided match history, which team has a higher probability of winning? Provide the answer in this exact format:
      "Winner: <TEAM_NAME> has a higher probability of winning, having won <X> out of <Y> matchups (<WIN_PERCENTAGE>% win rate). This is based on the past 20 years data."
      ${JSON.stringify(mockData.matchups, null, 2)}
    `;

        console.log('🧠 Prompt:', prompt);

        console.log('📡 Calling Ollama API...', config.OLLAMA_URL);
        const response = await axios.post(config.OLLAMA_URL, {
            model: config.MODEL_NAME,
            prompt: prompt,
            stream: false,
        });

        console.log('🧠 Raw Ollama Response:', response.data);

        let ollamaResponse = response.data.response?.trim();

        if (!ollamaResponse || !ollamaResponse.includes('Winner:')) {
            console.warn('⚠️ Unexpected response from Ollama:', ollamaResponse);
            ollamaResponse = 'Winner: Unknown team due to insufficient data.';
        }

        // Extract only the part after "Winner:"
        const formattedResponse = ollamaResponse.replace('Winner: ', '').trim();

        console.log('✅ Processed Ollama Response:', formattedResponse);

        res.status(200).json({
            winner: formattedResponse,
        });

    } catch (error) {
        console.error('❌ Error calling Ollama:', error.message);
        res.status(500).json({ error: 'Error processing the request with Ollama.' });
    }
};
;
