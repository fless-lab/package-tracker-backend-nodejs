const createError = require('http-errors');

const authorizeUser = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.role || !allowedRoles.includes(user.role)) {
        throw createError.Forbidden('Permission denied');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorizeUser;
