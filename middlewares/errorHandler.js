const errorHandler = (err, req, res, next) => {
  if (err.status === 429) {
    return res.status(429).json({ error: 'Rate limit exceeded.' });
  }
  res.status(500).json({ error: 'Internal server error', details: err.message });
};

export default errorHandler;
