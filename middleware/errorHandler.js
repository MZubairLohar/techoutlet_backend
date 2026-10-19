export const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'SyntaxError') {
    statusCode = 400;
  } else if (err.code === 11000) {
    statusCode = 409;
  } else if (err.name === 'MulterError') {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected server error occurred'
      : err.message,
    ...(process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};
