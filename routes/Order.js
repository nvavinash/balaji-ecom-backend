const express = require('express');
const { fetchOrdersByUser, createOrder, deleteOrder, updateOrder } = require('../controller/Order');
const router = express.Router();
router
.get('/',fetchOrdersByUser)
.post('/',createOrder)
.delete('/:id',deleteOrder)
.patch('/:id',updateOrder)
exports.router = router;