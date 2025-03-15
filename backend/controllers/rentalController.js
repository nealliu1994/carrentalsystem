//Get Rental Function:
const Rental = require('../models/Rental');
const getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({ userId: req.user.id });
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Add Rental Function:
const addRental = async (req, res) => {
    const { title, description, deadline } = req.body;
    try {
        const rental = await Rental.create({ userId: req.user.id, title, description, deadline });
        res.status(201).json(rental);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Rental Booking:
const updateRental = async (req, res) => {
    const { title, description, completed, deadline } = req.body;
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).json({ message: 'Rental not found' });
        rental.title = title || rental.title;
        rental.description = description || rental.description; rental.completed = completed ?? rental.completed; rental.deadline = deadline || rental.deadline;
        const updatedRental = await rental.save();
        res.json(updatedRental);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Rental Booking:
const deleteRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).json({ message: 'Rental not found' });
        await rental.remove();
        res.json({ message: 'Rental deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { getRentals, addRental, updateRental, deleteRental };