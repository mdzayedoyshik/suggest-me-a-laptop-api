import Exa from "exa-js";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { LaptopsResponseSchema } from "../utils/laptopSuggestionSchema.js";

const exa = new Exa(process.env.EXA_API_KEY);
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export const matchLaptop = async (req, res, next) => {
    try {
        const userQuery = req.body.query || "Suggest me best laptops for gaming under 100000 BDT.";

        // Search for laptops using Exa
        const searchResults = await exa.search(
            userQuery,
            {
                numResults: 2,
                includeDomains: ['startech.com.bd', 'ryanscomputers.com', 'techlandbd.com'],
            }
        );

        console.log("Raw search results from Exa:", searchResults);

        // print all the keys in the search results
        // console.log("Search result keys:", searchResults.results.map(r => Object.keys(r)));

        // Extract search results content
        const searchContent = searchResults.results
            .map(r => `Title: ${r.title}\nURL: ${r.url}\nImage_URL: ${r.image || 'N/A'}\nContent: ${r.text || 'N/A'}`)
            .join('\n---\n');

        // console.log("Formatted search content for AI:", searchContent);

        const format = zodResponseFormat(LaptopsResponseSchema, "laptop_suggestions");
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: `You are a Bangladeshi Tech expert. Provide the best laptop suggestions based on search results. 
                    CRITICAL INSTRUCTIONS: 
                    1. You MUST extract and return AT LEAST 2 to 3 laptops from the search results in the suggestions array.
                    2. You MUST include every single key defined in the JSON schema. If you absolutely do not have data, output "N/A". 
                    3. For the 'image_url' field, you MUST strictly copy the exact link provided next to 'Image_URL:' in the results. Do not write "N/A" if a valid link is present.`
                }, 
                {
                    role: "user",
                    content: `Request: ${userQuery}\n\nResults:\n${searchContent}`
                }
            ],
            response_format: format,
        });
        const data = JSON.parse(completion.choices[0].message.content);
        res.json(data);
    } catch (error) {
        console.error("Error fetching laptop suggestions:", error);
        res.status(500).json({ error: "AI response format invalid", details: error.message });
    }
};
