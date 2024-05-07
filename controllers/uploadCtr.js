const asyncHandler = require('express-async-handler')
const fs = require('fs')
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinary')

const deleteImages = asyncHandler(

    async(req, res) => {
        const { id } = req.params
        try {
            const deleter = cloudinaryDeleteImg(id, "images")

            res.json({msg: 'Deleted!'})
        } catch (error) {
            throw new Error(error)
        }
    }
)

const uploadImages = asyncHandler(
    
    async(req, res) => {
        // const { id } = req.params
        // validateMongoDbId(id)
        try {
            const uploader = path => cloudinaryUploadImg(path, "images")
            const urls = []
            const files = req.files

            for(const file of files ) {
                const { path } = file
                const newPath = await uploader(path)
                urls.push(newPath)
                fs.unlinkSync(path)
            }

            const images = urls.map(file => file)
            // const product = await Product.findByIdAndUpdate(
            //     id,
            //     {images: urls.map((file => file))},
            //     {new: true}
            // )
            res.json(images)
        } catch (error) {
            throw new Error(error)
        }
    }
)
module.exports = {
    uploadImages,
    deleteImages
} 