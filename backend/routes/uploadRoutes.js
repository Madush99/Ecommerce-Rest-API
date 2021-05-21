import path from 'path'
import express from 'express'
import multer from 'multer'

//file upload Routes
const router = express.Router()

const storage = multer.diskStorage({
      destination(req, file, cb) {
            cb(null, 'uploads/') // file save path
      },
      filename(req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`) 
      }
})

function checkFileType(file, cb) {
      const filetypes = /jpg|jpeg|png/
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase()) //check file type
      const mimetype = filetypes.test(file.mimetype)

      if (extname && mimetype) {
            return cb(null, true)
      } else {
            cb('Images only!')
      }
}

const upload = multer({
      storage,
      fileFilter: function (req, file, cb) {
            checkFileType(file, cb)
      }
})

router.post('/', upload.single('image'), (req, res) => { //upload files
      res.send(`/${req.file.path}`)
})



export default router