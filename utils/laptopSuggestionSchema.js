import { z } from 'zod';

export const LaptopsResponseSchema = z.object({ 
    last_updated: z.string(), 
    suggestions: z.array(
        z.object({
            brand: z.string(), 
            model: z.string(), 
            price_bdt: z.string().describe("Price in Taka, e.g., 85,000 TK"), 
            specs: z.object({ 
                processor: z.string(), 
                ram: z.string(), 
                storage: z.string(), 
                display: z.string() 
            }), 
            warranty: z.string().describe("Standard warranty in BD, e.g., 2 Years"), 
            best_for: z.enum(["Programming", "Gaming", "Student", "Business", "General Use", "Content Creation"]), 
            link: z.string().describe("URL to the product page on a local computer store site like Ryan's Computer, Star Tech, TechLand BD, Apple Gadgets BD, etc."), 
            reason: z.string().describe("Brief reason why this laptop is recommended for the user's needs and budget.") 
        })) 
}); 