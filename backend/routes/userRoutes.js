import express from 'express'
const router = express.Router()

//User Routes
import { 
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers) //resiter route
router.post('/login', authUser) //login
router
.route('/profile') //profile view
.get(protect, getUserProfile) //get user profile
.put(protect, updateUserProfile) //update profile
router
.route('/:id')
.delete(protect, admin, deleteUser)//admin user delete
.get(protect, admin, getUserById)// admin get users
.put(protect, admin, updateUser)// admin update user

export default router
