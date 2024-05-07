const Color = require('../models/colorModel')
const asyncHandler = require('express-async-handler')
const {validateMongoDbId} = require('../utils/validateMongodbId')

const createColor = asyncHandler(
    async(req, res) => {
        try {
            const newColor = await Color.create(req.body)
            res.json(newColor)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateColor = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const color = await Color.findByIdAndUpdate(id, req.body, {new: true})
            res.json(color)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const deleteColor = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const color = await color.findByIdAndDelete(id)
            res.json({msg: "Color deleted!"})
        } catch (error) {
            throw new Error(error)
        }
    }
)
const getColors = asyncHandler(
    async(req, res) => {
        try {
            const colors = await Color.find({})
            res.json(colors)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getColor = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const color = await Color.findById(id)
            res.json(color)
        } catch (error) {
            throw new Error(error)
        }
    }
)


module.exports = {createColor, deleteColor, getColors, getColor, updateColor}