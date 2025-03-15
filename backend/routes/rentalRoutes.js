
const express = require('express');
const { getRentals, addRental, updateRental, deleteRental } = require('../controllers/rentalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getRentals).post(protect, addRental);
router.route('/:id').put(protect, updateRental).delete(protect, deleteRental);

module.exports = router;