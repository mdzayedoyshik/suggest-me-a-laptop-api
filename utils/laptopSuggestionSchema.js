import { z } from 'zod';

export const LaptopsResponseSchema = z.object({ 
    last_updated: z.string(),
    suggestions: z.array(
        z.object({
            brand: z.string(), 
            model: z.string(), 
            price_bdt: z.string(), 
            specs: z.object({ 
                processor: z.string(), 
                ram: z.string(), 
                storage: z.string(), 
                display: z.string() 
            }), 
            warranty: z.string(), 
            best_for: z.enum(["Programming", "Gaming", "Student", "Business", "General Use", "Content Creation"]), 
            image_url: z.string(),
            link: z.string(), 
            reason: z.string()
        })
    ) 
});