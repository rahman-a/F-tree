import express from 'express'
const router = express.Router()
import {
    createNewBlog,
    getAllPosts,
    getPostById
} from '../controllers/blogController.js'
import {userAuth, isCoAdmin} from '../middleware/authenticate.js'
import {imageUpload} from '../middleware/upload.js' 

router.post('/', userAuth, isCoAdmin, imageUpload.single('image'), createNewBlog)
router.get('/posts', userAuth, isCoAdmin, getAllPosts)
router.get('/:id', userAuth, isCoAdmin, getPostById)


export default router