
const express = require('express');
const { getCars } = require('../controllers/carController');
//Create a new router
const router = express.Router();

//when "/" receive GET request, run getCars
router.route('/').get(getCars)

//allow other files to use this router
module.exports = router;

