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
import pdf from 'html-pdf'
import pkg from 'convert-svg-to-png'
const {convert} = pkg
const __dirname = path.dirname(fileURLToPath(import.meta.url))


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
        if(req.file === undefined) throw new Error('من فضلك إرفع ملف الـ csv')
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
            if(csvData[key] && csvData[key].includes(',')){
                csvData[key] = csvData[key].split(',')
            }
            if(key === '﻿_id'){
                const id = csvData[key]
                delete csvData[key]
                csvData._id = id
            }
            if(csvData[key] === 'null') csvData[key] = null
            if(csvData[key] === 'TRUE') csvData[key] = true
            if(csvData[key] === 'FALSE') csvData[key] = false
            if(key === 'spouseNames' && Array.isArray(csvData[key])) {
                const spouse_id = []
                const spouse_names = []
                csvData[key].forEach(d => {
                    if(ObjectId.isValid(d)) spouse_id.push({_id:ObjectId(d)})
                    if(!ObjectId.isValid(d)) spouse_names.push({name:d})
                })
                csvData.spouseNames = spouse_names
                csvData.spouseId = spouse_id
            } 
            if(key === 'childrenNames' && Array.isArray(csvData[key])) {
                const children_id = []
                const children_names = []
                csvData[key].forEach(d => {
                    if(ObjectId.isValid(d)) children_id.push({_id:ObjectId(d)})
                    if(!ObjectId.isValid(d)) children_names.push({name:d})
                })
                csvData.childrenNames = children_names
                csvData.childrenId = children_id
            } 
            csvData.author = req.user._id
        }
        result.push(csvData)
        }).on('end', async () => {
            await Member.deleteMany()
            await Member.insertMany(result)
            fs.unlinkSync(path.resolve(__dirname, `../uploads/${req.fileName}`))
            fs.unlinkSync(path.resolve(__dirname, `../uploads/${req.fileName.split('.')[0]}.xlsx`))
            res.status(200).send({message:'تم رفع الملف بنجاح'})     
        })
        
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
                parentName:'',
                parentId:'',
                fullName:'',
                spouseNames:'',
                childrenNames:'',
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
        const childrenNames = await Promise.all(member.childrenId.map(async cd => {
            const child = await Member.findById(cd._id)
            return {_id:child._id, name:child.firstName, parent:child.parentName}
        }))
        const spouseNames = await Promise.all(member.spouseId.map(async cd => {
            const spouse = await Member.findById(cd._id)
            return {_id:spouse._id, name:spouse.firstName, parent:spouse.parentName}
        }))
        memberData.childrenNames = [...memberData.childrenNames, ...childrenNames]
        memberData.spouseNames = [...memberData.spouseNames, ...spouseNames]
        
        // Find The Full Name of This member
        const counts = await Member.countDocuments({})
        const names = []
        let current = member
        for(let i = 0; i <= counts; i++){
            if(current.parentId) {
                current = await Member.findById(current.parentId)
                names.push(current.firstName)
            }
        }
        const fullName = names.join(' ')
        memberData.fullName = fullName

        if(memberData.birthDate) {
            const dt = new Date(memberData.birthDate)
            memberData.birthDate = dt.toISOString().split('T')[0]
        }

        const news = await Blog.find({members:{_id:ObjectId(memberData._id)}})
        memberData.news = news
        
        delete memberData.childrenId
        delete memberData.spouseId
        res.status(200).send({info:memberData})
    } catch (error) {
        next(error)
    }
}

export const memberAvatarUpload = async(req, res, next) => {
    const {memberId} = req.body
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        const member = await Member.findById(memberId)
        member.image = buffer
        await member.save()
        res.status(200).send({message:'تم رفع الصورة بنجاح'})
    } catch (error) {
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
        res.status(200).send({members, pageSize, page, membersCounts})   
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
        const png = await convert(req.body.svg,{
            puppeteer:{args: ['--no-sandbox'] }
        });
        res.set('Content-Type', 'image/png');
        res.send({png});
    } catch (error) {
        next(error)
    }
}

export const SvgToPdf = async(req, res, next) => {
    console.log(path.resolve(__dirname, '../uploads'))
    try { 
        await pdf.create(req.body.svg, {})
        .toFile(path.resolve(__dirname, `../uploads/result.pdf`), (err) =>{
            if(err) throw new Error(err)
        });
        res.status(201).send();
    } catch (error) {
        next(error)
    }
}

export const getPDFFile = async(req, res, next) => {
    try {
        res.set('content-type', 'application/pdf')
        res.attachment('result.pdf')
        res.download(path.resolve(__dirname, '../uploads/result.pdf'))
    } catch (error) {
        next(error)
    }
}

export const exportDataAsCSV = async(req, res, next) => {
    try {
        const members = await Member.find({})
        const list = members.map(member => {
            const spouseNames = []
            const childrenNames = []
            const dt = new Date(member.birthDate)
            const day = dt.getDay().length > 1 ? dt.getDay() : '0'+dt.getDay()
            const month = dt.getDate().length > 1 ? dt.getDate() : '0'+dt.getDate()
            const date = `${dt.getFullYear()}-${month}-${day}`
            member.childrenNames.forEach(m => {
                childrenNames.push(m.name)
            })
            member.childrenId.forEach(m => {
                childrenNames.push(m._id)
            })
            member.spouseNames.forEach(m => {
                spouseNames.push(m.name)
            })
            member.spouseId.forEach(m => {
                spouseNames.push(m._id)
            })
            return{
                _id: member._id.toString(),
                firstName:member.firstName,
                parentName:member.parentName,
                parentId:member.parentId && member.parentId.toString(),
                fullName:member.fullName,
                spouseNames:spouseNames.join(),
                childrenNames:childrenNames.join(),
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