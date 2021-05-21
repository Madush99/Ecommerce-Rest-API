import express from 'express'
const router = express.Router()
import { addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getOrders } from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


//Order Routes
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders) //add order
router.route('/myorders').get(protect, getMyOrders) // get orders in profile
router.route('/:id').get(protect, getOrderById) // get order by id
router.route('/:id/pay').put(protect, updateOrderToPaid) //payment
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered) //order delivery

export default router