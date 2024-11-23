const ErrorHandler = async (
  err,
  request,
  response,
  //eslint-disable-next-line
  next
) => {
  return response.status(400).json({
    status: false,
    message: "Bad Request",
    data: {
      error: err.message,
      path: request.originalUrl
    }
  });
};

export default ErrorHandler;
