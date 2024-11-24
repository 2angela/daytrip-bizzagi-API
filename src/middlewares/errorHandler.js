const ErrorHandler = async (
  err,
  request,
  response,
  //eslint-disable-next-line
  next
) => {
  const statusCode = typeof err.code == "number" ? err.code : 400;
  return response.status(statusCode).json({
    status: false,
    message: "Bad Request",
    data: {
      error: err.message,
      path: request.originalUrl
    }
  });
};

export default ErrorHandler;
