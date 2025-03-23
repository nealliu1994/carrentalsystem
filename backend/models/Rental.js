// rental model, for renting
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' }
});

delete mongoose.models['Rental']; // Remove cached model
const Rental = mongoose.model('Rental', rentalSchema);
module.exports = mongoose.model('Rental', rentalSchema);
