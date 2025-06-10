import axios from 'axios';

const model = process.env.OLLAMA_MODEL || 'tinyllama'; // default to smaller model
const AI_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export const queryAI = async (prompt) => {
  try {
    const response = await axios.post(`${AI_BASE_URL}/api/generate`, {
      model,
      prompt,
      stream: false,
    });

    if (!response.data?.response) {
      throw new Error('Invalid AI response');
    }

    return response.data.response.trim();
  } catch (err) {
    console.error('AI error:', err.message);
    return '⚠️ AI service is currently unavailable.';
  }
};
