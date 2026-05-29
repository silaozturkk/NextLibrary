const notFound = (req, res, next) => {
  const error = new Error(`Bulunamadı: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, _next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Sunucu hatası';

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Geçersiz ID';
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'alan';
    message = `Bu ${field} zaten kayıtlı`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
