import { z } from 'zod';

export const laptopSuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      model: z.string(),
      brand: z.string(),
      price: z.string(),
      match_score: z.number(),
      pros: z.array(z.string()),
      specs: z.object({
        cpu: z.string(),
        ram: z.string(),
        gpu: z.string(),
        display: z.string(),
      }),
      buy_link: z.string(),
      reasoning: z.string(),
    })
  ),
});
