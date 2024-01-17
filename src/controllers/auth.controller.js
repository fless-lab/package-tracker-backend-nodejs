const AuthService = require("../services/auth.service");

class AuthController {
  static async register(req, res) {
    try {
      const body = {
        username: req.body.username,
        password: req.body.password,
      };
      const { success, error } = await AuthService.register(body);
      if (success) {
        return res.status(201).json({ success });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const body = { username: req.body.username, password: req.body.password };
      const { success, user, token, error } = await AuthService.login(body);
      if (success) {
        return res.status(200).json({ success, token });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      const { success, token, error } = await AuthService.refresh(refreshToken);

      if (success) {
        return res.status(200).json({ success, token });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const { success, error } = await AuthService.logout(refreshToken);

      if (success) {
        return res.status(200).json({ success });
      } else {
        throw error;
      }
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

module.exports = AuthController;
