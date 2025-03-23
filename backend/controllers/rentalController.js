// for user to do CRUD on their rental bookings

//Get Rental Function:
const Rental = require('../models/Rental');
console.log("Rental Schema Paths:", Object.keys(Rental.schema.paths));
const getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({ userId: req.user.id }).populate("carId"); //  Populate car details
        console.log("API Returning Rentals:", JSON.stringify(rentals, null, 2)); //  Log formatted data
        res.json(rentals);
    } catch (error) {
        console.error("Error fetching rentals:", error.message);
        res.status(500).json({ message: error.message });
    }
};


// Add Rental Function:
const addRental = async (req, res) => {
    const { brand, model, pickupDate, returnDate } = req.body;

    console.log("Backend Received Rental:", req.body);

    if (!brand || !model || !pickupDate || !returnDate) {
        console.error("Missing required fields:", { brand, model, pickupDate, returnDate });
        return res.status(400).json({ message: 'Missing required fields: brand, model, pickupDate, returnDate' });
    }

    try {
        const rental = await Rental.create({
            userId: req.user.id,
            brand,
            model,
            pickupDate: new Date(pickupDate),
            returnDate: new Date(returnDate),
            status: 'confirmed'
        });

        console.log("✅ Successfully stored rental in DB:", rental);
        res.status(201).json(rental);
    } catch (error) {
        console.error("Error saving rental:", error.message);
        res.status(500).json({ message: "Failed to create rental...", error: error.message });
    }
};


// Update Rental Booking:
const updateRental = async (req, res) => {
    const { brand, model, pickupDate, returnDate } = req.body;
    const userId = req.user.id;

    try {
        const rental = await Rental.findOne({ _id: req.params.id, userId });
        if (!rental) return res.status(404).json({ message: 'Rental not found or not authorized' });

        rental.brand = brand || rental.brand;
        rental.model = model || rental.model;
        rental.pickupDate = pickupDate ? new Date(pickupDate) : rental.pickupDate;
        rental.returnDate = returnDate ? new Date(returnDate) : rental.returnDate;

        const updatedRental = await rental.save();
        res.json(updatedRental);
    } catch (error) {
        console.error("Error updating rental:", error.message);
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