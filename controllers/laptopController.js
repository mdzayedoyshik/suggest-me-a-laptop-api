import Exa from 'exa-js';
import { OpenAI } from 'openai';
import { laptopSuggestionSchema } from '../utils/laptopSuggestionSchema.js';

const exa = new Exa(process.env.EXA_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const matchLaptop = async (req, res, next) => {
  try {
    const { intent, budget, portability, priority } = req.body;
    if (!intent || !budget || !portability || !priority) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    // Build Exa.ai query
    const query = `best ${intent} laptops in Bangladesh price under ${budget} BDT 2026`;
    const searchResults = await exa.search({
      query,
      numResults: 10,
      domains: ['startech.com.bd', 'ryanscomputers.com', 'techlandbd.com'],
    });
    const content = searchResults.results.map(r => r.text).join('\n---\n');
    // System prompt for Groq
    const systemPrompt = `You are a tech expert. Analyze the provided search results from the BD market. Suggest exactly 3 laptops. Calculate a 'Match Score' (0-100%) based on how well they fit the user's intent and priority. Respond in the following JSON schema: ${laptopSuggestionSchema.toString()}`;
    const completion = await openai.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content },
      ],
      max_tokens: 1200,
      temperature: 0.2,
    });
    let suggestions;
    try {
      suggestions = laptopSuggestionSchema.parse(JSON.parse(completion.choices[0].message.content));
    } catch (e) {
      return res.status(500).json({ error: 'AI response format invalid', details: e.message });
    }
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
};
