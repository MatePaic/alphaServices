const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/orders');

// http://localhost:3000/api/v1/orders
router.get('/', ordersControllers.getOrders);

router.get('/:id', ordersControllers.getOrder);

router.post('/', ordersControllers.createOrder);

router.put('/:id', ordersControllers.updateOrder);

router.delete('/:id', ordersControllers.deleteOrder);

router.get('/download-order-summary/:id', ordersControllers.downloadOrderSummary);

module.exports = router;