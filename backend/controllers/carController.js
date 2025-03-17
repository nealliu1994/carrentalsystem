//Get Car Function:
//Only allow user to view cars

const Car = require('../models/Car');
const getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCars };

