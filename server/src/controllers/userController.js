import User from '../models/usersModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import randomstring from 'randomstring'
import sendEmail from '../sendMail.js'


export const createNewUser = async (req, res, next) => {
    const {email} = req.body 
    const newUser = new User(req.body)

    try {
        const isUserFound = await User.findOne({email})
        if(isUserFound) {
            res.status(400)
            throw new Error('هذا الحساب موجود بالفعل من فضلك اختر بريد الكترونى آخر أو سجل دخول')
        }

        await newUser.save()
        res.status(201).send()
    } catch (error) {
        next(error)
    }
}

export const userLogin = async (req, res, next) => {
    const {email, password} = req.body
    try {
        const data = await User.findByCredential(email, password, res)
       const token = await data.generateToken()
       res.status(200).send({data, token})
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res ,next) => {
    const data = req.user
    try {
        for(let key in req.body) {
            if(req.body[key] ){
                data[key] = req.body[key] 
            }
        }
        data.tokens = await data.tokens.filter(token => token.token !== req.token)
        const token = await data.generateToken()
        await data.save()
        res.status(200).send({data, token})
    } catch (error) {
        next(error)
    }
}

export const userLogout = async(req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        next(error)
    }
}

export const removeUser = async (req, res, next) => {
    try {
        await req.user.remove()
        res.status(200).send()
    } catch (error) {
        next(error)
    }
}

export const removeUserById = async(req, res, next) => {
    const {id} = req.params
    try {
        const user = await User.findById(id)
        if(!user) {
            res.status(404)
            throw new Error('هذا المستخدم غير موجود')
        }
        await user.remove()
        res.status(200).send()
    } catch (error) {
        next(error)
    }
}

export const toggleUserActivation = async (req, res, next) => {
    const {id} = req.params
    try {
        const user = await User.findById(id)
        if(!user){
            res.status(404)
            throw new Error('هذا المستخدم غير موجود')
        }
        user.isActive = !user.isActive
        await user.save()
        res.status(200).send()
    } catch (error) {
        next(error)
    }
}

export const toggleUserAsCoAdmin = async (req, res, next) => {
    const {id} = req.params
    try {
        const user = await User.findById(id)
        if(!user){
            res.status(404)
            throw new Error('هذا المستخدم غير موجود')
        }
        user.isCoAdmin = !user.isCoAdmin
        await user.save()
        res.status(200).send()
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async(req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = 10
    const keyword = req.query.keyword ? {
        firstName:{
            $regex:req.query.keyword,
            $options:'i'
        }
    } : {}
    const match = {}
    if(req.query.isActive){
        match.isActive = req.query.isActive === 'true' ? true : false
    }
    if(req.query.isCoAdmin){
        match.isCoAdmin = req.query.isCoAdmin === 'true' ? true : false
    }
    try {
        const usersCounts = await User.countDocuments({...keyword, ...match})
        const users = await User.find({...match, ...keyword}).limit(pageSize).skip(pageSize * (page - 1))
        if(!users || users.length === 0){
            res.status(404)
            throw new Error('لم يتم العثور على اى مستخدمين')
        }
        res.status(200).send({users, pageSize, page, usersCounts})   
    } catch (error) {
        next(error)
    }
}

export const resetPassLink = async(req, res, next) => {
    // destructure email from req.body
    const {email} = req.body
    
    try {
        
        // check if email exist or not
        const user = await User.findOne({email})
        
        // if not send error
        if(!user) throw new Error('هذا البريد غير مرتبط بحساب من فضلك اختر بريد آخر')
        
        // create randomstring
        const resetCode = randomstring.generate()
        
        // create token
        const token = jwt.sign({id:user._id.toString(), code:resetCode}, process.env.RESET_TOKEN, {expiresIn:'1 day'})
        
        // crypt this random string
        const cryptResetCode = await bcrypt.hash(resetCode, 10)
        
        // store in db
        user.resetCode = cryptResetCode
        await user.save()
        
        // compose the url
        const resetUrl = `${req.protocol}://${req.hostname}/reset?TOKEN=${token}`
        const info = {
            link:resetUrl,
            name:user.firstName,
            email:email
        }
        await sendEmail(info)
        return res.status(200).send({message:'لقد تم إرسال الرابط بنجاح وبرجاء العلم انه سيصل اليك الرابط فى غضون ساعة أو اقل'})
    } catch (error) {
        next(error)
    }

    
}

export const resetPassword = async(req, res, next) => {
    const {token, password} = req.body
    try {
        // decode the token to extract user id
        const decode = jwt.verify(token, process.env.RESET_TOKEN, (err, decode) => {
            if(err){
                throw new Error('هذا الرابط غير صحيح')
            }
            return decode
        })
        // find the user using id from token
        const user = await User.findOne({_id:decode.id})
        
        // if not user send error
        if(!user) throw new Error('تم حذف الحساب المرتبط بهذا الرابط')
        // throw new Error('هذا الرابط غير صالح من فضلك أعد ضبط كلمة المرور')
        // check if reset code == the user reset code
        const isResetCodeMatch = await bcrypt.compare(decode.code, user.resetCode)
        
        // if not send error
        if(!isResetCodeMatch) throw new Error('هذا الرابط غير صحيح')
        
        user.password = password
        await user.save()
        // send success from server
        res.status(200).send({message:'تم إعادة ضبط كلمة المرور بنجاح'})
    } catch (error) {
        next(error)
    }
}
