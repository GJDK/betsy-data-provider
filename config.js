// Global configuration for Ollama settings
// const config = {
//     OLLAMA_URL: 'http://localhost:11434/api/generate', // Change if required
//     MODEL_NAME: 'qwen2.5:3b' // Change the model name if needed
//   };

// const config = {
//     OLLAMA_URL: 'http://10.2.76.24:11434/api/generate', // Change if required
//     MODEL_NAME: 'qwen2.5:3b-instruct-q4_K_M' // Change the model name if needed
//   };

const config = {
  OLLAMA_URL: 'https://l3alw4jfcnbz4br7qio6g3oei40lvwyc.lambda-url.us-west-2.on.aws/sysrupt5/zeefireai/api/generate', // Change if required
  MODEL_NAME: 'qwen2.5:3b-instruct-q4_K_M' // Change the model name if needed
};
  
  module.exports = config;
  