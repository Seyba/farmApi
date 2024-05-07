const BlogCategory = require('../models/blogCategoryModel')
const asyncHandler = require('express-async-handler')
const {validateMongoDbId} = require('../utils/validateMongodbId')

const createCategory = asyncHandler(
    async(req, res) => {
        try {
            const newCat = await BlogCategory.create(req.body)
            res.json(newCat)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateCategory = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const category = await BlogCategory.findByIdAndUpdate(id, req.body, {new: true})
            res.json(category)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const deleteCategory = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const category = await BlogCategory.findByIdAndDelete(id)
            res.json({msg: "Category deleted!"})
        } catch (error) {
            throw new Error(error)
        }
    }
)
const getCategories = asyncHandler(
    async(req, res) => {
        try {
            const categories = await BlogCategory.find({})
            res.json(categories)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getCategory = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const category = await BlogCategory.findById(id)
            res.json(category)
        } catch (error) {
            throw new Error(error)
        }
    }
)


module.exports = {createCategory, deleteCategory, getCategories,getCategory, updateCategory}