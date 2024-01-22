const UserModel = require("../models/user.model");
const {AppError} = require("../../utils/error.utils");
const bcrypt = require("bcrypt");
const { USER_TYPES } = require("../../constants");

class UserService {
    static async createUser(userData) {
        try {
            const user = new UserModel(userData);
            await user.save();
            return { success: true, user };
        } catch (error) {
            throw new AppError(`Error creating user: ${error.message}`);
        }
    }

    static async updateUser(requestingUserId, targetUserId, updateData) {
        try {
            const requestingUser = await UserModel.findById(requestingUserId);
            const targetUser = await UserModel.findById(targetUserId);

            if (!requestingUser || !targetUser) {
                throw new AppError("User not found", 404);
            }

            if (requestingUser.role === 'admin' || requestingUser._id.equals(targetUser._id)) {
                const user = await UserModel.findByIdAndUpdate(
                    targetUserId,
                    { $set: updateData },
                    { new: true }
                );
                return { success: true, user };
            } else {
                throw new AppError("Unauthorized", 403);
            }
        } catch (error) {
            throw new AppError(`Error updating user: ${error.message}`,error.statusCode);
        }
    }

    static async deleteUser(requestingUserId, targetUserId) {
        try {
            const requestingUser = await UserModel.findById(requestingUserId);
            const targetUser = await UserModel.findById(targetUserId);

            if (!requestingUser || !targetUser) {
                throw new AppError("User not found", 404);
            }

            if (requestingUser.role === 'admin' || requestingUser._id.equals(targetUser._id)) {
                const user = await UserModel.findByIdAndDelete(targetUserId);
                return { success: true, user };
            } else {
                throw new AppError("Unauthorized", 403);
            }
        } catch (error) {
            throw new AppError(`Error deleting user: ${error.message}`,error.statusCode);
        }
    }

    static async getUser(requestingUserId, targetUserId) {
        try {
            const requestingUser = await UserModel.findById(requestingUserId);
            const targetUser = await UserModel.findById(targetUserId);

            if (!requestingUser || !targetUser) {
                throw new AppError("User not found", 404);
            }
            if (requestingUser.role === 'admin' || requestingUser._id.equals(targetUser._id)) {
                return { success: true, user: targetUser };
            } else {
                throw new AppError("Unauthorized", 403);
            }
        } catch (error) {
            throw new AppError(`Error fetching user: ${error.message}`,error.statusCode);
        }
    }

    static async getUserById(userId){
        try {
            const user = await UserModel.findById(userId);
            return { success: true, user };
          } catch (error) {
            return { success: false, error };
          }
    }

    static async getUserByUsername(username) {
        try {
            const user = await UserModel.findOne({ username });
            return { success: true, user };
        } catch (error) {
            throw new AppError(`Error fetching user by username: ${error.message}`);
        }
    }

    static async getAllUsers(requestingUserId,role) {
        try {
            let filter={};
            if(role){filter.role=role};
            const requestingUser = await UserModel.findById(requestingUserId);
            if (!requestingUser) {
                throw new AppError("User not found", 404);
            }

            if(role && !Object.values(USER_TYPES).includes(role)){
                throw new AppError("Role not exist", 400);
            }

            // Vérifiez les autorisations avant de permettre la récupération de tous les utilisateurs
            if (requestingUser.role === 'admin') {
                const users = await UserModel.find(filter);
                return { success: true, users };
            } else {
                throw new AppError("Unauthorized", 403);
            }
        } catch (error) {
            throw new AppError(`Error fetching users: ${error.message}`,error.statusCode);
        }
    }
}

module.exports = UserService;
