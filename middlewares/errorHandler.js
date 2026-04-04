import { logger } from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(
    `Error in ${req.method} ${req.originalUrl}:`,
    'Message:', err.message,
    'Stack:', err.stack,
    'Body:', req.body
  );
  if (err.status === 429) {
    return res.status(429).json({ error: 'Rate limit exceeded.' });
  }
  res.status(500).json({ error: 'Internal server error', details: err.message });
};

export default errorHandler;
