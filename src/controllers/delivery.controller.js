const DeliveryService = require('../services/delivery.service');

class DeliveryController {
  static async createDelivery(req, res) {
    try {
      const adminId = req.user.id;
      const deliveryData = req.body;

      const { success, delivery, error } = await DeliveryService.createDelivery(adminId, deliveryData);

      if (success) {
        return res.status(201).json({ success, delivery });
      } else {
        throw error;
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }

  static async getDelivery(req, res) {
    try {
      const requestingUserId = req.user.id;
      const deliveryId = req.params.id;

      const { success, delivery, error } = await DeliveryService.getDelivery(requestingUserId, deliveryId);

      if (success) {
        return res.status(200).json({ success, delivery });
      } else {
        throw error;
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }

  static async getAllDeliveries(req, res) {
    try {
      const requestingUserId = req.user.id;

      const { success, deliveries, error } = await DeliveryService.getAllDeliveries(requestingUserId);

      if (success) {
        return res.status(200).json({ success, deliveries });
      } else {
        throw error;
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }

  static async updateDelivery(req, res) {
    try {
      const requestingUserId = req.user.id;
      const deliveryId = req.params.id;
      const updateData = req.body;

      const { success, delivery, error } = await DeliveryService.updateDelivery(requestingUserId, deliveryId, updateData);

      if (success) {
        return res.status(200).json({ success, delivery });
      } else {
        throw error;
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }

  static async deleteDelivery(req, res) {
    try {
      const adminId = req.user.id;
      const deliveryId = req.params.id;

      const { success, error } = await DeliveryService.deleteDelivery(adminId, deliveryId);

      if (success) {
        return res.status(200).json({ success });
      } else {
        throw error;
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({ success: false, error: error.message });
    }
  }
}

module.exports = DeliveryController;
