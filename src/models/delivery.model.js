const mongoose = require('mongoose');
const { DELIVERY_STATUS } = require('../../constants');

const deliverySchema = new mongoose.Schema(
  {
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickup_time: { type: Date },
    start_time: { type: Date },
    end_time: { type: Date },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: { type: String, enum: Object.values(DELIVERY_STATUS),default:DELIVERY_STATUS.OPEN, required: true },
  },
  { timestamps: true }
);

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
