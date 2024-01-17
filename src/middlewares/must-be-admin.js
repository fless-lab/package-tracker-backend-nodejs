const { AppError } = require("../../utils/error.utils");

const checkAdminRole = (req, res, next) => {
  try {
    const requestingUserRole = req?.user?.role;

    if (requestingUserRole !== "admin") {
      throw new AppError("Access denied.", 403);
    }
    next();
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

module.exports = checkAdminRole;
