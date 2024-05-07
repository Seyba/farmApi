const mongoose = require('mongoose')
const { Schema, model } = mongoose

const enquirySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Submitted",
        enum: ["Submitted","Contacted","In Progress"]
    }

}, {timestamps: true})

const Enquiry = model('Enquiry', enquirySchema)
module.exports = Enquiry