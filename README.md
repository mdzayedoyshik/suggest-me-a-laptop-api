# Suggest Me a Laptop (API)

You ask for something like *"a laptop for programming under 90,000 BDT"* and this small Express service answers with two or three current options from Bangladeshi computer shops, with price, specs, warranty and a link.

It is a small side project to try out a pattern I wanted for in-app assistants: fetch fresh data first, then let the model only pick and summarise, with its output forced into a schema the client can rely on.

## How it works

```
POST /api/match-laptop { "query": "..." }
        │
        ├─ 1. Exa search, limited to startech.com.bd, ryanscomputers.com and techlandbd.com
        │
        ├─ 2. Search results (title, URL, image, page text) passed to gpt-oss-120b on Groq
        │      through the OpenAI SDK, with response_format generated from a Zod schema
        │
        └─ 3. Parsed JSON returned to the client
```

The system prompt tells the model to copy prices, image URLs and links from the search results instead of recalling them. That way the numbers come from the shops' current pages, not from whatever the model saw in training.

## Response shape

Defined in `utils/laptopSuggestionSchema.js`:

```jsonc
{
  "last_updated": "string",
  "suggestions": [
    {
      "brand": "string",
      "model": "string",
      "price_bdt": "string",
      "specs": { "processor": "string", "ram": "string", "storage": "string", "display": "string" },
      "warranty": "string",
      "best_for": "Programming | Gaming | Student | Business | General Use | Content Creation",
      "image_url": "string",
      "link": "string",
      "reason": "string"
    }
  ]
}
```

## Running it

Requires Node 20.6 or newer (it uses `--env-file`).

```bash
npm install
cp .env.example .env   # set GROQ_API_KEY and EXA_API_KEY
npm run dev            # http://localhost:5000
```

```bash
curl -X POST localhost:5000/api/match-laptop \
  -H 'Content-Type: application/json' \
  -d '{"query":"Laptop for Flutter development under 100000 BDT"}'
```

The server refuses to start when either key is missing (`utils/validateEnv.js`).

## Limitations

- Exa returns only two pages per query to keep latency and cost down. That is enough for a suggestion, but it is not a price comparison.
- CORS is open (`*`) because the only client so far is a local prototype.
- No caching. The same query searches and calls the model again every time.
