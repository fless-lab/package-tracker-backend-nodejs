const { AppError } = require("../../utils/error.utils");
const UserService = require("../services/user.service");

class UserController {
  static async createUser(req, res) {
    try {
      const body = {
        username: req.body.username,
        password: req.body.password
      };

      const { user: existingUser } = await UserService.getUserByUsername(body.username);

      if (existingUser) {
        throw new AppError("Username already taken", 409);
      }
      const { success, user, error } = await UserService.createUser(body);
      if (success) {
        return res.status(201).json({ success, user });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  
  static async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const requestingUserId = req.user.id; 
      const body = {
        role: req.body.role,
      };

      const { success, user, error } = await UserService.updateUser(requestingUserId, userId, body);

      if (success) {
        return res.status(200).json({ success, user });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const requestingUserId = req.user.id; 

      const { success, user, error } = await UserService.deleteUser(requestingUserId, userId);

      if (success) {
        return res.status(200).json({ success, user });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async getUser(req, res) {
    try {
      const userId = req.params.id;
      const requestingUserId = req.user.id;

      const { success, user, error } = await UserService.getUser(requestingUserId, userId);

      if (success) {
        return res.status(200).json({ success, user });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const requestingUserId = req.user.id;

      const { success, users, error } = await UserService.getAllUsers(requestingUserId);

      if (success) {
        return res.status(200).json({ success, users });
      } else {
        throw error;
      }
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, error: error.message });
    }
  }
}

module.exports = UserController;
