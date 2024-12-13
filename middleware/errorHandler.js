export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).render("error", {
    title: "Error",
    message: err.message || "Internal Server Error",
  });
};
