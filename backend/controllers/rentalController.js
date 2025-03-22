// for user to do CRUD on their rental bookings

//Get Rental Function:
const Rental = require('../models/Rental');
const getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({ userId: req.user.id }).populate("carId"); // ✅ Populate car details
        console.log("🔍 API Returning Rentals:", JSON.stringify(rentals, null, 2)); // ✅ Log formatted data
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Add Rental Function:
const addRental = async (req, res) => {
    const { carId, pickupDate, returnDate } = req.body;

    console.log("🟢 Received Rental Request in Backend:", req.body);

    if (!carId || !pickupDate || !returnDate) {
        console.error("❌ Missing required fields:", { carId, pickupDate, returnDate });
        return res.status(400).json({ message: 'Missing required fields: carId, pickupDate, returnDate' });
    }

    try {
        const rental = await Rental.create({
            userId: req.user.id,
            carId: new mongoose.Types.ObjectId(carId),
            pickupDate: new Date(pickupDate),
            returnDate: new Date(returnDate),
            status: 'confirmed'
        });

        console.log("✅ Successfully stored rental in DB:", rental);
        res.status(201).json(rental);
    } catch (error) {
        console.error("❌ Error saving rental:", error.message);
        res.status(500).json({ message: "Failed to create rental...", error: error.message });
    }
};


// Update Rental Booking:
const updateRental = async (req, res) => {
    const { carId, pickupDate, returnDate } = req.body;
    const userId = req.user.id;


    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).json({ message: 'Rental not found' });
        rental.carId = carId || rental.carId;
        rental.pickupDate = pickupDate || rental.pickupDate; rental.returnDate = returnDate || rental.returnDate;
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