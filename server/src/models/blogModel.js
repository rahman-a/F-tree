import  mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title :{
        type:String,
        required:true
    },
    body :{
        type:String,
        required:true
    },
    image: {
        type:String,
    },
    members:[
        {
           name:mongoose.Schema.Types.ObjectId
           
        }
    ]
}, {
    timestamps:true
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog