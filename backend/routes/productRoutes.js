import express from 'express'
const router = express.Router()

//Product Routes
import {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


router.route('/').get(getProducts).post(protect, admin, createProduct) //get products
router.route('/:id/reviews').post(protect, createProductReview)// type reviews
router.get('/top', getTopProducts) // get top products
router.route('/:id')
.get(getProductById) // get product by id
.delete(protect, admin, deleteProduct) // admin delete product
.put(protect, admin, updateProduct) // admin product update

export default router