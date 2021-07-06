import multer from 'multer'
import {fileURLToPath} from 'url'
import path from 'path'
const __dirname = path.dirname(fileURLToPath(import.meta.url))


const storage = multer.diskStorage({
  destination(req, file, cb){
    cb(null, path.resolve(__dirname, '../uploads'))
  },
  filename(req, file,cb){
    const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    req.fileName = fileName
    cb(null, fileName)
  }
})

export const CSVUpload = multer({
  storage,
  limits:{
    fileSize:5000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(csv|xlsx|xls)$/)) {
      return cb(new Error('من فضلك إرفع ملف بامتداد csv أو xlsx فقط'))
    }
    cb(undefined, true)
  }
})

export const avatarUpload = multer({
  limits:{
    fileSize:10000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(png|jpeg|jpg|JPG|JPEG)$/)) {
      return cb(new Error('من فضلك إرفع صورة بامتداد png أو jpeg او jpg'))
    }
    cb(undefined, true)
  }
})

export const imageUpload = multer({
  limits:{
    fileSize:10000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(png|jpeg|jpg|JPG|JPEG)$/)) {
      return cb(new Error('من فضلك إرفع صورة بامتداد png أو jpeg او jpg'))
    }
    cb(undefined, true)
  }
})


