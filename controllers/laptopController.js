import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { LaptopsResponseSchema } from "../utils/laptopSuggestionSchema.js";

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export const matchLaptop = async (req, res, next) => {
    try {
        const format = zodResponseFormat(LaptopsResponseSchema, "laptop_suggestions");
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [{
                role: "system",
                content: "You are a Bangladeshi Tech expert, working closely with local vendors to provide the best laptop suggestions."
            }, {
                role: "user",
                content: req.body.prompt || "I am new to CSE. I need a budget firendly laptop that will run all my necessary softwares and programs needed for my studies, and sometimes for browsing and entertainment. My budget is around 50,000 BDT."
            }],
            response_format: format,
        });
        const data = JSON.parse(completion.choices[0].message.content);
        res.json(data);
    } catch (error) {
        console.error("Error fetching laptop suggestions:", error);
        res.status(500).json({ error: "AI response format invalid", details: error.message });
    }
};
