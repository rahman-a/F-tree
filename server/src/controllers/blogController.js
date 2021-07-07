import Blog from '../models/blogModel.js'

export const createNewBlog = async(req, res ,next) => {
    try {
        const blog = new Blog({
            author:req.user._id,
            ...req.body
        })
        blog.image = req.file.buffer
        blog.members = JSON.parse(req.body.members)
        await blog.save()
        res.status(201).send({message:'تم إنشاء الخبر بنجاح'})
    } catch (error) {
        next(error)
    }
}

export const getAllPosts = async (req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = 10
    const keyword = req.query.keyword ? {
        title:{
            $regex:req.query.keyword,
            $options:'i'
        }
    } : {}
    try {
        const postsCounts = await Blog.countDocuments({})
        const posts = await Blog.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))
        if(!posts || posts.length === 0){
            res.status(404)
            throw new Error('لم يتم العثور على اى اخبار')
        }
        res.status(200).send({posts, postsCounts, page})
    } catch (error) {
        next(error)
    }
}

export const getPostById = async(req, res, next) => {
    const {id} = req.params
    try {
        const post = await Blog.findById(id)
        if(!post){
            res.status(404)
            throw new Error('لم يتم العثور على اى خبر')
        }
        res.status(200).send({post})
    } catch (error) {
        next(error)
    }
}
/**
 * title:
 * body:
 * image:
 * members:[name:objectId]
 */