import express from 'express'
const router = express.Router()
import {
    createNewBlog,
    getAllPosts,
    getPostById,
    deletePost
} from '../controllers/blogController.js'
import {userAuth, isCoAdmin} from '../middleware/authenticate.js'
import {imageUpload} from '../middleware/upload.js' 

router.post('/', userAuth, isCoAdmin, imageUpload.array('image'), createNewBlog)
router.get('/posts', userAuth, getAllPosts)
router.get('/:id', userAuth, getPostById)
router.delete('/:id', userAuth,isCoAdmin, deletePost)


export default router