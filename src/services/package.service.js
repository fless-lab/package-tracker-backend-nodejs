const { AppError } = require('../../utils/error.utils');
const Package = require('../models/package.model');
const UserService = require('../services/user.service');
const createError = require('http-errors');

class PackageService {
  static async createPackage(userId, packageData) {
    try {
      const {user} = await UserService.getUserById(userId);
      if (!user) {
        throw new AppError('User not found',404);
      }

      const pack = new Package({ customer: user._id, ...packageData });
      await pack.save();
      return { success: true, package:pack };
    } catch (error) {
      throw new AppError(`Error creating package: ${error.message}`,error.statusCode);
    }
  }


  static async getPackageById(userId, packageId) {
    try {
      const {user} = await UserService.getUserById(userId);
      if (!user) {
        throw new AppError('User not found',404);
      }

      if (user.role === 'admin') {
        const _package = await Package.findById(packageId).populate('active_delivery');
        if (!_package) {
          throw new AppError('Package not found',404);
        }
        return { success: true, _package };
      } else {
        const _package = await Package.findOne({ _id: packageId, customer: user._id.toString() }).populate('active_delivery');
        if (!_package) {
          throw new AppError('Package not found',404);
        }
        return { success: true, package:_package };
      }
    } catch (error) {
      throw new AppError(`Error getting package: ${error.message}`,error.statusCode)
    }
  }


  static async getAllPackages(userId) {
    try {
      const {user} = await UserService.getUserById(userId);
      if (!user) {
        throw createError.NotFound('User not found');
      }

      if (user.role === 'admin') {
        const packages = await Package.find().populate('active_delivery');
        return { success: true, packages };
      } else {
        const packages = await Package.find({ customer: user._id }).populate('active_delivery');
        return { success: true, packages };
      }
    } catch (error) {
      throw createError.InternalServerError(`Error getting packages: ${error.message}`);
    }
  }


  static async updatePackage(userId, packageId, updateData) {
    try {
      const {user} = await UserService.getUserById(userId);
      if (!user) {
        throw createError.NotFound('User not found');
      }

      if (user.role === 'admin') {
        const _package = await Package.findByIdAndUpdate(packageId, updateData, { new: true });
        if (!_package) {
          throw createError.NotFound('Package not found');
        }
        return { success: true, package:_package };
      } else {
        const _package = await Package.findOneAndUpdate({ _id: packageId, customer: user._id }, updateData, { new: true });
        if (!_package) {
          throw createError.NotFound('Package not found');
        }
        return { success: true, package: _package };
      }
    } catch (error) {
      throw createError.InternalServerError(`Error updating package: ${error.message}`);
    }
  }

  static async deletePackage(userId, packageId) {
    try {
      const {user} = await UserService.getUserById(userId);
      if (!user) {
        throw createError.NotFound('User not found');
      }

      if (user.role === 'admin') {
        const result = await Package.findByIdAndDelete(packageId);
        if (!result) {
          throw createError.NotFound('Package not found');
        }
        return { success: true };
      } else {
        const result = await Package.findOneAndDelete({ _id: packageId, customer: user._id });
        if (!result) {
          throw createError.NotFound('Package not found');
        }
        return { success: true };
      }
    } catch (error) {
      throw createError.InternalServerError(`Error deleting package: ${error.message}`);
    }
  }

}

module.exports = PackageService;
