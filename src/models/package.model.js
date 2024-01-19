const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    active_delivery: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
    description: { type: String, required: true },
    weight: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true },
    from_name: { type: String, required: true },
    from_address: { type: String, required: true },
    from_location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    to_name: { type: String, required: true },
    to_address: { type: String, required: true },
    to_location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
