import User from '../models/usersModel.js'
import jwt from 'jsonwebtoken'


const userAuth = async (req,res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_TOEKN, (err, decode) => {
            if(err) throw new Error('من فضلك سجل دخول اولاً')
            return decode
        })
        const user = await User.findOne({_id:decode.id, 'tokens.token':token})
        if(!user) {
            res.status(401)
             next(new Error('من فضلك سجل دخول اولاً'))
        }
        req.user = user
        req.token = token
        next()
    }else {
        res.status(401)
        next(new Error('من فضلك سجل دخول اولاً'))
    }
}

const isAdmin = (req, res ,next) => {
    if(req.user.isAdmin) next()
    else {
        res.status(400)
        next(new Error('غير مصرح لهذا الحساب بالتعامل مع هذا الأمر'))
    }
}

const isCoAdmin = (req, res ,next) => {
    if(req.user.isCoAdmin || req.user.isAdmin) next()
    else {
        res.status(400)
        next(new Error('غير مصرح لهذا الحساب بالتعامل مع هذا الأمر'))
    }
}

export { 
    userAuth,
    isAdmin,
    isCoAdmin
}