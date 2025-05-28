import axios from 'axios';

// Use 'phi' as the model name when using Phi-2 on Ollama
const model = process.env.OLLAMA_MODEL || 'phi';

export const queryAI = async (prompt) => {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt,
      stream: false
    });

    return response.data.response;
  } catch (err) {
    console.error('Phi-2 AI error:', err.message);
    return 'Sorry, I could not get a response from the AI.';
  }
};
