import  mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from "validator";

const UserSchema = new mongoose.Schema({
    firstName :{
        type:String,
        required:true
    },
    lastName :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error('من فضلك اكتب البريد الإلكترونى بشكل صحيح')
        }
    },
    phone: {
        type:Number,
        required:true,
    },
    password:{
        type:String,
        trim:true,
        required:true,
    },
    isAdmin: {
        type:Boolean,
        default:false,
    },
    isCoAdmin: {
        type:Boolean,
        default:false,
    },
    isActive: {
        type:Boolean,
        default:false,
    },
    resetCode:{
        type:String
    },
    tokens: [
        {
            token:{
                type:String
            }
        }
    ]
}, {
    timestamps:true
})

UserSchema.methods.toJSON = function() {
    const obj = this.toObject()
    delete obj.password
    delete obj.tokens
    delete obj.resetCode
    if(!this.isAdmin) delete obj.isAdmin
    if(!this.isCoAdmin) delete obj.isCoAdmin
    return obj
}

UserSchema.statics.findByCredential = async (email, password, res) => {
    const user = await User.findOne({email})
    if(!user) {
        res.status(401)
        throw new Error('البريد الإلكترونى او كلمة المرور غير صحيحة من فضلك حاول مرة أخرى')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        res.status(401)
        throw new Error('البريد الإلكترونى او كلمة المرور غير صحيحة من فضلك حاول مرة أخرى')
    }
    if(!user.isActive) {
        res.status(403)
        throw new Error('هذا الحساب لم يفعل بعد من فضلك انتظر حتى يتم التفعيل')
    }
    return user
}

UserSchema.methods.generateToken = async function() {
    const token = jwt.sign({id:this._id.toString()}, process.env.JWT_TOEKN, {expiresIn:'7 days'})
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

UserSchema.pre('save', async function(next){
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = mongoose.model('User', UserSchema)

export default User