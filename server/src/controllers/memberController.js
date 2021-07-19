import Member from '../models/membersModel.js'
import Blog from '../models/blogModel.js'
import XLSX from 'xlsx'
import path from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs'
import csvParser from 'csv-parser'
import ObjectId from 'bson-objectid'
import objectToCSV from 'objects-to-csv'
import sharp from 'sharp'
// import pdf from 'html-pdf'
import pkg from 'convert-svg-to-png'
const {convert} = pkg
const __dirname = path.dirname(fileURLToPath(import.meta.url))


 const memberFullName = async id => {
     const member = await Member.findById(id)
     const counts = await Member.countDocuments({})
        const names = []
        let current = member
        for(let i = 0; i <= counts; i++){
            if(current.parentId) {
                current = await Member.findById(current.parentId)
                names.push(current.firstName)
            }
        }
        return names.join(' ')
 }
export const createNewMember = async(req, res, next) => {
    const member = new Member({
        _id:ObjectId().toHexString(),
        author: req.user._id,
        ...req.body
    })
    try {
        await member.save()
        res.send({message:'تم تسجيل العضو بنجاح'})
    } catch (error) {
        next(error)
    }
}

export const uploadCSV = async(req, res, next) => {
    try {
        if(req.file === undefined) throw new Error('من فضلك إرفع ملف الـ Excel')
        if(path.extname(req.fileName) === '.xlsx'){
            const workBook = XLSX.readFile(path.resolve(__dirname, `../uploads/${req.fileName}`));
            workBook.SheetNames.forEach((sheet) => {
                XLSX.writeFile(workBook, path.resolve(__dirname, `../uploads/${req.fileName.split('.')[0]}.csv`), {sheet: sheet, bookType: "csv"});
                req.fileName = `${req.fileName.split('.')[0]}.csv`
            });
            
        }
        const result = []
        fs.createReadStream(path.resolve(__dirname, `../uploads/${req.fileName}`))
        .pipe(
            csvParser({
            delimiter:','
        })).on('data', (csvData) => {
        
        for(let key in csvData) {
            if(!csvData[key]) delete csvData[key]
            if(key === '﻿_id'){
                const id = csvData[key]
                delete csvData[key]
                csvData._id = id
            }
            if(csvData[key] === 'null') csvData[key] = null
            if(csvData[key] === 'TRUE') csvData[key] = true
            if(csvData[key] === 'FALSE') csvData[key] = false
            csvData.author = req.user._id
        }
        result.push(csvData)
        }).on('end', async () => {
            const filteredResult = result.filter(data => data.firstName !== undefined && data.parentId !== undefined)
            await Member.deleteMany()
            await Member.insertMany(filteredResult)
            fs.unlinkSync(path.resolve(__dirname, `../uploads/${req.fileName}`))
            fs.unlinkSync(path.resolve(__dirname, `../uploads/${req.fileName.split('.')[0]}.xlsx`))
            res.status(200).send({message:'تم رفع الملف بنجاح'})     
        })
        
    } catch (error) {
        next(error)
    }
}

export const addSpouseAndChildren = async(req, res, next) => {
    const {_id, data} = req.body
    try {
        const member = await Member.findById(_id)
        if(!member) {
            res.status(404)
            throw new Error('هذا العضو غير موجود')
        }
        if(member.gender){
            if(member.gender === 'ذكر'){
                member.wivesAndChildren =  member.wivesAndChildren.concat(data)
            }else {
                member.husbandAndChildren = data
            }
        }
        await member.save()
        res.send({message:'تمت الإضافة بنجاح'})
    } catch (error) {
        next(error)
    }
}

export const generateCSVTemplate = async(req, res, next) => {
    const {count} = req.params
    try {
        const list = []
        for(let i = 0; i < count; i++){
            const data = {
                _id:ObjectId().toHexString(),
                firstName:'',
                parentId:'',
                mother:'',
                maritalStatus:'',
                gender:'',
                job:'',
                age:'',
                sector:'',
                birthDate:'',
                phone:'',
                address:'',
                isAlive:''
            }
            list.push(data)
        }
        const csv = new objectToCSV(list)
        await csv.toDisk(path.resolve(__dirname, '../uploads/family-template.csv'))
        const filePath = path.resolve(__dirname, '../uploads/family-template.csv')
        const fileName = 'family_template'
        res.set('content-type', 'text/csv')
        res.attachment(fileName)
        res.download(filePath)
    } catch (error) {
        next(error)
    }  
}

export const extractTreeData = async (req, res, next) => {
    try {
        const data = await Member.find({})
        if(!data){
            res.status(404)
            throw new Error('ليس هناك بيانات لعرض شجرة العائلةمن فضلك ارفع ملف البيانات لجلب المعلومات اللازمة')
        }
        const familyData = data.map(d => {
            return {
                _id:d._id, 
                firstName:d.firstName, 
                parentId:d.parentId,
                isAlive:d.isAlive === true ? true : d.isAlive === false ? false : ''
            }
        })
        res.status(200).send({familyData})
    } catch (error) {
        next(error)
    }
}

export const getMemberInfoById = async (req, res, next) => {
    const {id} = req.params
    try {
        const member = await Member.findById(id)
        if(!member) {
            res.status(404)
            throw new Error('هذا العضو غير موجود من الممكن ان يكون قد تم حذفة')
        }
        const memberData = {...member._doc}
        if(memberData.gender){
            if(memberData.gender === 'ذكر') {
                const wivesAndChildren = await Promise.all(memberData.wivesAndChildren.map(async w => {
                    const children = await Promise.all(w.children.map( async c => {
                        if(ObjectId.isValid(c)){
                            const child = await Member.findById(c)
                            const fullName = await memberFullName(c)
                            return {id:child._id, name:`${child.firstName} ${fullName}`}
                        } else {
                          return {name: c}
                        }
                    }))
                    if(ObjectId.isValid(w.name)){
                        const wife = await Member.findById(w.name)
                        const id = wife._id
                        const fullName = await memberFullName(id)
                        const name = `${wife.firstName} ${fullName}`
                        return {id, name, children}
                    }else {
                        const name = w.name
                        return {name, children}
                    }
                    
                }))
                memberData.wivesAndChildren = wivesAndChildren
            }else {
                const data = memberData.husbandAndChildren
                const children = await Promise.all(data.children.map(async c => {
                    if(ObjectId.isValid(c)){
                        const child = await Member.findById(c)
                        const fullName = await memberFullName(c)
                        return {id:child._id, name:`${child.firstName} ${fullName}`}
                    } else {
                        return {name:c}
                    }
                }))
                if(ObjectId.isValid(data.name)){
                    const husband = await Member.findById(data.name)
                    const husbandId = husband._id
                    const fullName = await memberFullName(husbandId)
                    const husbandName = `${husband.firstName} ${fullName}`                    
                    memberData.husbandAndChildren = {id:husbandId, name:husbandName, children}
                }else {
                    memberData.husbandAndChildren = {name:data.name, children}
                }
            }
        }

        // Get the Parent and the mother Name
        if(memberData.parentId){
            const parent = await Member.findById(memberData.parentId)
            const fullName = await memberFullName(memberData.parentId)
            memberData.parent = {id:memberData.parentId,name:`${parent.firstName} ${fullName}`}
        }
        if(memberData.mother){
            if(ObjectId.isValid(memberData.mother)) {
                const mother = await Member.findById(memberData.mother)
                const fullName = await memberFullName(memberData.mother)
                memberData.mother = {id:memberData.mother,name:`${mother.firstName} ${fullName}`}
            }
        }
        
        // Find The Full Name of This member
        memberData.fullName = await memberFullName(id)

        if(memberData.birthDate) {
            const dt = new Date(memberData.birthDate)
            memberData.birthDate = dt.toISOString().split('T')[0]
        }

        const news = await Blog.find({members:{_id:ObjectId(memberData._id)}})
        memberData.news = news
        
        res.status(200).send({info:memberData})
    } catch (error) {
        next(error)
    }
}

export const memberAvatarUpload = async(req, res, next) => {
    const {memberId} = req.body
    try {
        await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toFile(path.resolve(__dirname, `../uploads/avatar-${memberId}.png`))
        const member = await Member.findById(memberId)
        member.image = `avatar-${memberId}.png`
        await member.save()
        res.status(200).send({message:'تم رفع الصورة بنجاح'})
    } catch (error) {
        console.log('ERROR', error);
        next(error)
    }
}

export const getMemberAvatar = async (req, res, next) => {
    const {id} = req.params
    try {
      const member = await Member.findById(id)
      const img = member.image
      res.set('content-type', 'image/png')
      res.send({avatar:img})
    } catch (error) {
      next(error)
    }
  }


  export const getAllMembers = async(req, res, next) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = 10
    const keyword = req.query.keyword ? {
        firstName:{
            $regex:req.query.keyword,
            $options:'i'
        }
    } : {}
    const match = {}
    if(req.query.gender){
        match.gender = req.query.gender === 'm' ? 'ذكر' : 'أنثى'
    }
    try {
        const membersCounts = await Member.countDocuments({...keyword, ...match})
        const members = await Member.find({...match, ...keyword}).limit(pageSize).skip(pageSize * (page - 1))
        if(!members || members.length === 0){
            res.status(404)
            throw new Error('لم يتم العثور على اى أعضاء')
        }
        const memberData = await Promise.all(members.map(async m => {
            const fullName = await memberFullName(m._doc._id)
            return {...m._doc, fullName}
        }))
        res.status(200).send({members:memberData, pageSize, page, membersCounts})   
    } catch (error) {
        next(error)
    }
}

export const editMemberById = async (req, res, next) => {
    const {id} = req.body
    delete req.body.id
    try {
       const member = await Member.findById(id)
       if(!member) throw new Error('هذا العضو غير موجود')
       for(let key in req.body) {
        if(req.body[key] || key === 'isAlive'){
            member[key] = req.body[key] 
        }
    }
    await member.save()
     res.send({message:'تم تحديث بيانات العضو بنجاح'})
    } catch (error) {
        next(error)
    }
}
export const SvgToPng = async(req, res, next) => {
    try {
        if(!req.body.svg){
            res.status(400)
            throw new Error('من فضلك ارفع البيانات حتى يتم انشاء الصورة')
        }
        const png = await convert(req.body.svg,{
            puppeteer:{args: ['--no-sandbox'] }
        });
        res.set('Accept-Charset', 'utf-8');
        res.set('Content-Type', 'image/png');
        res.send({png});
    } catch (error) {
        next(error)
    }
}

// export const SvgToPdf = async(req, res, next) => {
//     console.log(path.resolve(__dirname, '../uploads'))
//     try { 
//         await pdf.create(req.body.svg, {})
//         .toFile(path.resolve(__dirname, `../uploads/result.pdf`), (err) =>{
//             if(err) throw new Error(err)
//         });
//         res.status(201).send();
//     } catch (error) {
//         next(error)
//     }
// }

// export const getPDFFile = async(req, res, next) => {
//     try {
//         res.set('content-type', 'application/pdf')
//         res.attachment('result.pdf')
//         res.download(path.resolve(__dirname, '../uploads/result.pdf'))
//     } catch (error) {
//         next(error)
//     }
// }

export const exportDataAsCSV = async(req, res, next) => {
    try {
        const members = await Member.find({})
        const list = members.map(member => {
            let date = null
            if(member.birthDate){
                const dt = new Date(member.birthDate)
                date = dt.toISOString().split('T')[0]
            }
            return{
                _id: member._id.toString(),
                firstName:member.firstName,
                parentId:member.parentId && member.parentId.toString(),
                mother:member.mother ? member.mother:'',
                maritalStatus:member.maritalStatus,
                gender:member.gender,
                job:member.job,
                age:member.age,
                sector:member.sector,
                birthDate:member.birthDate ? date : '',
                phone:member.phone,
                address:member.address,
                isAlive:member.isAlive === true ? 'TRUE': member.isAlive === false ? 'FALSE' : ''
            }
        })
        const csv = new objectToCSV(list)
        await csv.toDisk(path.resolve(__dirname, '../uploads/family-data.csv'))
        const filePath = path.resolve(__dirname, '../uploads/family-data.csv')
        const fileName = 'family_data'
        res.set('content-type', 'text/csv')
        res.attachment(fileName)
        res.download(filePath)
    } catch (error) {
        next(error)
    }  
}

export const searchByName = async(req, res, next) => {
    const keyword = req.query.keyword ? {
        firstName:{
            $regex:req.query.keyword,
            $options:'i'
        }
    } : {}
    try {
        const members = await Member.find({...keyword})
        if(!members || members.length === 0){
            res.status(404)
            throw new Error('لم يتم العثور على اى أعضاء....')
        }
        const membersData = await Promise.all(members.map(async m => {
            const name = await memberFullName(m._doc._id)
            return {_id:m._id, id:`${m.firstName} ${name}`, name:`${m.firstName} ${name}`}
        }))
        res.status(200).send({members:membersData})
    } catch (error) {
        next(error)
    }
}


export const removeSpouseById = async(req, res, next) => {
    const {_id, spouseId} = req.body
    try {
        const member = await Member.findById(_id)
        if(member.gender && member.gender === 'ذكر'){
            member.wivesAndChildren = member.wivesAndChildren.filter(n => n.name !== spouseId)
            await member.save()
            res.send({message:'تم حذف الزوجة بنجاح'})
        }else{
          res.status(400)
          throw new Error('جدث خطأ ما من فضلك حاول مرة أخرى')
        }
        
    } catch (error) {
        next(error)
    }
}