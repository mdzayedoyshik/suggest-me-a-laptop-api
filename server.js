import './utils/validateEnv.js';
import express from 'express';
import corsMiddleware from './middlewares/cors.js';
import errorHandler from './middlewares/errorHandler.js';
import requestLogger from './middlewares/requestLogger.js';
import laptopRouter from './routes/laptopRoutes.js';

// dotenv removed; use process.env directly
const app = express();
app.use(express.json());
app.use(corsMiddleware);
app.use(requestLogger);

app.use('/api', laptopRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
