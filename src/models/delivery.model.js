const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    pickup_time: { type: Date },
    start_time: { type: Date },
    end_time: { type: Date },
    location: {
        lat: { type: Number },
        lng: { type: Number },
    },
    status: {
        type: String,
        enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'],
        required: true,
    },
}, { timestamps: true });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
