const Product = require('../models/productModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinary')
const {validateMongoDbId} = require('../utils/validateMongodbId.js')
const fs = require('fs')

const createProduct = asyncHandler(
    async(req, res) => {
        try {
            if(req.body.title){
                req.body.slug = slugify(req.body.title)
            }
            const newProduct = await Product.create(req.body)

            res.json(newProduct)
        } catch (error) {
            throw new Error(error)
        }
        
    }
)

const getProducts = asyncHandler(
    async(req, res) => {
        try {
            //* filtering
            const queryObj = {...req.query}
            const excludeFields = ['page', 'sort', 'limit','fields']
            excludeFields.map(el => delete queryObj[el])

            let queryStr = JSON.stringify(queryObj)
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

            let query = Product.find(JSON.parse(queryStr))
            
            //* sorting
            if(req.query.sort){
                const sortBy = req.query.sort.split(",").join(" ")
                query = query.sort(sortBy)
            } else {
                query = query.sort('-createdAt')
            }

            //* Limiting the fields
            if(req.query.fields) {
                const fields = req.query.fields.split(",").join(" ")
                query = query.select(fields)
            } else {
                query = query.select("-v__")
            }

            //* Pagination
            const page = req.query.page
            const limit = req.query.limit
            const skip = (page - 1) * limit
            console.log(page, limit, skip)
            query = query.skip(skip).limit(limit)
            if(req.query.page) {
                const prodCount = await Product.countDocuments()
                if(skip >= prodCount) throw new Error("This page does not exist!")
            }
            const prods = await query
            res.json(prods)
        } catch (error) {
            throw new Error(error)
        }
        
    }
)

const getProduct = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const prod = await Product.findById(id)
            res.json(prod)
        } catch (error) {
            throw new Error(error)
        }
        
    }
)

const updateProduct = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            if(req.body.title) {
                req.body.slug = slugify(req.body.title)
            }
            const updateProd = await Product.findByIdAndUpdate(id, req.body, {new: true})
            res.json(updateProd)
        } catch (error) {
            throw new Error(error)
        }
        
    }
)


const deleteProduct = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const updateProd = await Product.findByIdAndDelete(id)
            res.json({msg: 'Product Deleted'})
        } catch (error) {
            throw new Error(error)
        }
        
    }
)

const addToWishList = asyncHandler(
    async(req, res) => {
        const { _id } = req.user
        const { prodId } = req.body
        try {
            const loggedUser = await User.findById(_id)
            const prodAlreadyAdded = loggedUser.wishlist.find((id) => id.toString() === prodId)

            if(prodAlreadyAdded){
                let user = await User.findByIdAndUpdate(_id, {$pull: {wishlist: prodId}}, {new: true})
                res.json(user)
            } else {
                let user = await User.findByIdAndUpdate(_id, {$push: {wishlist: prodId}}, {new: true})
                res.json(user)
            }
        } catch (error) {
            throw new Error(error)
        }
    }
)

const rating = asyncHandler(
    async(req, res) => {
        const { _id } = req.user
        const { star, prodId, comment} = req.body 
        try {
            const product = await Product.findById(prodId)
            let prodAlreadRated = product.ratings.find((userId) => userId.postedby.toString())
            
            if(prodAlreadRated) {

                const updateRating = await Product.updateOne(
                    {ratings: {$elemMatch: prodAlreadRated }}, 
                    {$set: {"ratings.$.star": star, "ratings.$.comment": comment}},
                    {new: true}
                )

                //res.json(updateRating)

            } else {
                const rateProd = await Product.findByIdAndUpdate(prodId, 
                    {$push: {ratings: {star: star, comment: comment, postedby: _id}}}, {new: true}
                )
                //res.json(rateProd)
            }
            
            const getAllRatings = await Product.findById(prodId)

            let totalRating = getAllRatings.ratings.length
            let ratingSum = getAllRatings.ratings.map((item) => (item.star)).reduce((prev, curr) => prev + curr, 0)
            let actualRating = Math.round(ratingSum / totalRating)
            let finalRating = await Product.findByIdAndUpdate(prodId, {totalRating: actualRating}, {new: true})

            res.json(finalRating)
        } catch (error) {
            throw new Error(error)
        }
    }
)

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
    addToWishList,
    createProduct,
    deleteImages,
    deleteProduct, 
    getProduct, 
    getProducts, 
    rating,
    uploadImages,
    updateProduct
}