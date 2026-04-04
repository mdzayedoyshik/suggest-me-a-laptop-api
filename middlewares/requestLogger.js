import { logger } from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  logger.info(`Request: ${req.method} ${req.originalUrl}`, 'Body:', req.body);
  next();
};

export default requestLogger;
