import axios from 'axios';

/**
 * Sends a prompt to the Phi-2 model via Ollama and returns a response.
 * You can modify this to support streaming or switch to another model.
 */
export const queryAI = async (prompt) => {
  try {
    const res = await axios.post('http://localhost:11434/api/generate', {
      model: 'phi',
      prompt,
      stream: false,
    });

    if (!res.data || !res.data.response) {
      throw new Error('Invalid response from AI model');
    }

    return res.data.response.trim();
  } catch (error) {
    console.error('Phi-2 API error:', error.message);
    throw error;
  }
};
