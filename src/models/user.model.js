const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'driver', 'admin'], required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
