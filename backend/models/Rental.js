// rental model, for renting
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' }
});
/*
//fix issue, to avoid conflict
delete mongoose.models['Rental'];
// creat a model (new collection)
const Rental = mongoose.model('Rental', rentalSchema);
// log the schema to confirm
console.log("Rental Schema Paths (models/Rental.js):", Object.keys(Rental.schema.paths));
*/

module.exports = mongoose.model('Rental', rentalSchema);


