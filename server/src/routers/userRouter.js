import express from 'express'
const router = express.Router()
import {userAuth, isCoAdmin, isAdmin} from '../middleware/authenticate.js'
import {
    createNewUser, 
    userLogin, 
    userLogout,
    updateUser,
    removeUser,
    toggleUserActivation,
    toggleUserAsCoAdmin,
    getAllUsers,
    removeUserById,
    resetPassLink,
    resetPassword,
    getUserData //test
} from '../controllers/userController.js'


router.post('/', createNewUser)
router.post('/login', userLogin)
router.post('/reset-passLink', resetPassLink)
router.post('/reset-password',resetPassword)
router.post('/logout', userAuth, userLogout)
router.patch('/edit', userAuth, updateUser)
router.delete('/delete', userAuth, removeUser)
router.delete('/remove/:id', userAuth, isCoAdmin, removeUserById)
router.patch('/activate/:id', userAuth, isCoAdmin, toggleUserActivation)
router.get('/all', userAuth,isCoAdmin, getAllUsers)
router.patch('/promote/:id', userAuth, isAdmin, toggleUserAsCoAdmin)

router.get('/data', userAuth, getUserData) //test




export default router