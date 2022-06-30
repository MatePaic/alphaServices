const express = require('express');
const router = express.Router();
const bikesControllers = require('../controllers/bikes');

// http://localhost:3000/api/v1/features
router.get('/', bikesControllers.getBikes);


router.get('/:id', bikesControllers.getBike);


module.exports = router;