const UserService = require("./user.service");
const AppError = require("../../utils/error.utils");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../../utils/jwt.utils");
const redis = require("../../utils/redis.utils");
const client = redis.getClient();

class AuthService {
  static async register(payload) {
    try {
      const { email, username, password } = payload;

      const { success: userExists, user: existingUser } = await UserService.getUserByUsername(username);

      if (userExists) {
        throw new AppError("Username already exists", 409);
      }

      const { success: createSuccess, user: createdUser, error: createError } = await UserService.createUser({ email, username, password });

      if (!createSuccess) {
        console.error("Error creating user:", createError);
        throw createError;
      }

      return { success: true, user: createdUser };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async login(payload) {
    try {
      const { username, password } = payload;

      const { success: userExists, user: existingUser } = await UserService.getUserByUsername(username);

      if (!userExists) {
        throw new AppError("User not found", 404);
      }

      const isMatch = await existingUser.isValidPassword(password);

      if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
      }

      const access = await signAccessToken(existingUser.id);
      const refresh = await signRefreshToken(existingUser.id);

      return { success: true, token: { access, refresh }, user: existingUser };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async refresh(refreshToken) {
    try {
      if (!refreshToken) {
        throw new AppError("You must provide a refresh token", 400);
      }

      const userId = await verifyRefreshToken(refreshToken);

      const access = await signAccessToken(userId);
      const refresh = await signRefreshToken(userId);

      return { success: true, token: { access, refresh } };
    } catch (error) {
      return { success: false, error };
    }
  }

  static async logout(refreshToken) {
    try {
      if (!refreshToken) {
        throw new AppError("You must provide a refresh token", 400);
      }

      const userId = await verifyRefreshToken(refreshToken);

      const deletePromise = new Promise((resolve, reject) => {
        client.DEL(userId, (err, val) => {
          if (err) {
            reject(new AppError("Internal Server Error", 500));
          } else {
            resolve({ success: true });
          }
        });
      });

      return await deletePromise;
    } catch (error) {
      return { success: false, error };
    }
  }
}

module.exports = AuthService;
