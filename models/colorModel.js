const mongoose = require('mongoose')
const { Schema, model } = mongoose

const colorSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, {timestamps: true})

const Color = model('Color', colorSchema)
module.exports = Color