const PathHandler = (request, response, next) => {
  try {
    return response.status(404).json({
      success: false,
      message: "Path Not Found",
      data: {
        path: request.originalUrl
      }
    });
  } catch (err) {
    return next(err);
  }
};

export default PathHandler;
