const Enquiry = require('../models/enquiryModel')
const asyncHandler = require('express-async-handler')
const {validateMongoDbId} = require('../utils/validateMongodbId')

const createEnquiry = asyncHandler(
    async(req, res) => {
        try {
            const newEnquiry = await Enquiry.create(req.body)
            res.json(newEnquiry)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateEnquiry = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        validateMongoDbId(id)
        try {
            const enquiry = await Enquiry.findByIdAndUpdate(id, req.body, {new: true})
            res.json(enquiry)
        } catch (error) {
            throw new Error(error)
        }
    }
)


const deleteEnquiry = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const enquiry = await Enquiry.findByIdAndDelete(id)
            res.json({msg: "Enquiry deleted!"})
        } catch (error) {
            throw new Error(error)
        }
    }
)
const getEnquiries = asyncHandler(
    async(req, res) => {
        try {
            const enquiry = await Enquiry.find({})
            res.json(enquiry)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getEnquiry = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        try {
            const enquiry = await Enquiry.findById(id)
            res.json(enquiry)
        } catch (error) {
            throw new Error(error)
        }
    }
)


module.exports = {createEnquiry, deleteEnquiry, getEnquiries, getEnquiry, updateEnquiry}