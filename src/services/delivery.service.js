const Delivery = require('../models/delivery.model');
const UserService = require('../services/user.service');
const { AppError } = require('../../utils/error.utils');
const createError = require('http-errors');
const PackageService = require('./package.service');
const socketService = require('./socket.service');

class DeliveryService {
  static async createDelivery(adminId, deliveryData) {
    try {
      const { user } = await UserService.getUserById(adminId);
      if (!user || user.role !== 'admin') {
        throw new AppError('Permission denied',403);
      }

      // L'admin peut créer une livraison et choisir le conducteur
      const delivery = new Delivery(deliveryData);
      await delivery.save();

      return { success: true, delivery };
    } catch (error) {
      throw new AppError(`Error creating delivery: ${error.message}`,error.statusCode);
    }
  }

  static async getDelivery(requestingUserId, deliveryId) {
    try {
      const { user } = await UserService.getUserById(requestingUserId);
      if (!user) {
        throw new AppError('User not found',404);
      }

      const delivery = await Delivery.findById(deliveryId).populate('package driver');

      // Seuls l'admin, le conducteur associé à la livraison et le client associé au colis peuvent accéder à la livraison
      if (!user.role === 'admin' && !delivery.driver.equals(user._id) && !delivery.package.customer.equals(user._id)) {
        throw new AppError('Permission denied',403);
      }

      if (!delivery) {
        throw new AppError('Delivery not found',404);
      }

      return { success: true, delivery };
    } catch (error) {
      throw new AppError(`Error getting delivery: ${error.message}`,error.statusCode);
    }
  }

  static async getAllDeliveries(requestingUserId) {
    try {
      const { user } = await UserService.getUserById(requestingUserId);
      if (!user) {
        throw new AppError('User not found',404);
      }

      if (user.role === 'customer') {
        // Le client peut voir toutes les livraisons associées à ses colis
        // Use Promise.all here 
        const {packages:userPackages} = await PackageService.getAllPackages(requestingUserId);
        console.log(userPackages)
        const packageIds = userPackages.map(pkg => pkg._id);
        const deliveries = await Delivery.find({ 'package': { $in: packageIds } }).populate('package driver');
        return { success: true, deliveries };
      }

      // Le conducteur peut récupérer ses propres livraisons
      if (user.role === 'driver') {
        const deliveries = await Delivery.find({ driver: user._id }).populate('package driver');
        return { success: true, deliveries };
      }

      // L'admin peut accéder à toutes les livraisons
      const deliveries = await Delivery.find().populate('package driver');
      return { success: true, deliveries };
    } catch (error) {
      throw new AppError(`Error getting deliveries: ${error.message}`,error.statusCode);
    }
  }

  // static async updateDelivery(requestingUserId, deliveryId, updateData) {
  //   try {
  //     const { user } = await UserService.getUserById(requestingUserId);
  //     if (!user) {
  //       throw new AppError('User not found',404);
  //     }

  //     const delivery = await Delivery.findById(deliveryId);

  //     if (!delivery) {
  //       throw new AppError('Delivery not found',404);
  //     }
      
  //     // L'admin peut mettre à jour toutes les propriétés, le conducteur peut mettre à jour l'état uniquement
  //     if (user.role === 'admin' || (user.role === 'driver' && updateData.status)) {
  //       const updatedDelivery = await Delivery.findByIdAndUpdate(deliveryId, updateData, { new: true }).populate('package driver');
  //       return { success: true, delivery: updatedDelivery };
  //     } else {
  //       throw new AppError('Permission denied',403);
  //     }
  //   } catch (error) {
  //     throw new AppError(`Error updating delivery: ${error.message}`,error.statusCode);
  //   }
  // }

  static async updateDelivery(requestingUserId, deliveryId, updateData) {
    try {
      // Vérifier si l'utilisateur existe
      const { user } = await UserService.getUserById(requestingUserId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
  
      // Récupérer la livraison à mettre à jour
      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        throw new AppError('Delivery not found', 404);
      }
  
      // Vérifier si le statut est fourni et est valide
      if (updateData.status && !Object.values(STATUS_ENUM).includes(updateData.status)) {
        throw new AppError('Invalid status provided', 400);
      }
  
      // Vérifier les autorisations du conducteur
      const canUpdateDriverInfo = this.canUpdateDriverInfo(user, updateData);
      if (!canUpdateDriverInfo) {
        throw new AppError('Permission denied', 403);
      }
  
      // Appliquer les logiques spécifiques aux transitions de statut
      if (updateData.status === STATUS_ENUM.PICKED_UP) {
        updateData.pickup_time = new Date();
      } else if (updateData.status === STATUS_ENUM.IN_TRANSIT) {
        updateData.start_time = new Date();
      } else if (updateData.status === STATUS_ENUM.DELIVERED || updateData.status === STATUS_ENUM.FAILED) {
        updateData.end_time = new Date();
      }
  
      // Mettre à jour la livraison
      const updatedDelivery = await Delivery.findByIdAndUpdate(deliveryId, updateData, { new: true }).populate('package driver');
  
      // Émettre les événements appropriés
      if (updateData.status) {
        socketService.notifyDeliveryStatusChanged(deliveryId, updateData.status);
      }
  
      if (updateData.location) {
        socketService.notifyDeliveryLocationChanged(deliveryId, updateData.location);
      }

      // Broadcast
      socketService.notifyDeliveryUpdated(updatedDelivery)
  
      // Retourner la livraison mise à jour
      return { success: true, delivery: updatedDelivery };
    } catch (error) {
      throw new AppError(`Error updating delivery: ${error.message}`, error.statusCode);
    }
  }

  static canUpdateDriverInfo(user, updateData) {
    const allowedFields = ['status', 'pickup_time', 'start_time', 'end_time'];
    return user.role === 'driver' && Object.keys(updateData).every(field => allowedFields.includes(field));
  }

  static async deleteDelivery(adminId, deliveryId) {
    try {
      const { user } = await UserService.getUserById(adminId);
      if (!user || user.role !== 'admin') {
        throw new AppError('Permission denied',403);
      }

      const result = await Delivery.findByIdAndDelete(deliveryId);
      if (!result) {
        throw new AppError('Delivery not found',404);
      }

      return { success: true };
    } catch (error) {
      throw new AppError(`Error deleting delivery: ${error.message}`,error.statusCode);
    }
  }


}

module.exports = DeliveryService;
