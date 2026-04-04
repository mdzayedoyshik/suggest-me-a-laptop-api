const required = ['GROQ_API_KEY', 'EXA_API_KEY'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error('Missing env vars: ' + missing.join(', '));
}