const express = require('express')
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware')
const {deleteImages, uploadImages } = require('../controllers/uploadCtr')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages')
const router = express.Router()


router.post("/", authMiddleware, isAdmin, uploadPhoto.array("images", 10),productImgResize, uploadImages)

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages)

module.exports = router
