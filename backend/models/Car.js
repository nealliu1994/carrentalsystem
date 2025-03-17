// car model
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    available: { type: Boolean, default: true }
});


module.exports = mongoose.model('Car', carSchema);
