import axios from 'axios';

// Use 'phi' as the model name when using Phi-2 on Ollama
const model = process.env.OLLAMA_MODEL || 'phi';

// Detect environment and set AI base URL
const AI_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:11434'
    : 'https://shiny-space-succotash-v66j55qqrpqq34g7-11434.app.github.dev/'; 
    
export const queryAI = async (prompt) => {
  try {
    const response = await axios.post(`${AI_BASE_URL}/api/generate`, {
      model,
      prompt,
      stream: false,
    });

    return response.data.response;
  } catch (err) {
    console.error('Phi-2 AI error:', err.message);
    return '⚠️ AI service is currently unavailable.';
  }
};
