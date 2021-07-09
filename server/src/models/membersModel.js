import  mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    _id: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    firstName :{
        type:String,
        required:true
    },
    image: {
        type:String
    },
    parentId: {
        type:mongoose.Schema.Types.ObjectId,
    },
    spouseNames:[
        {
            name:String
        }
    ],
    spouseId: [
        {
            _id:mongoose.Schema.Types.ObjectId
            
        }
    ],
    childrenNames:[
        {
            name:String
        }
    ],
    childrenId: [
        {
            _id:mongoose.Schema.Types.ObjectId
            
        }
    ],
    maritalStatus:{
        type:String
    },
    gender:{
        type:String
    },
    job:{
        type:String
    },
    age:{
        type:Number
    },
    sector:{
        type:String
    },
    birthDate:{
        type:Date
    },
    phone:{
        type:Number
    },
    address:{
        type:String
    },
    isAlive:{
        type:Boolean
    }

}, {
    timestamps:true
})


const Member = mongoose.model('Member', memberSchema)

export default Member