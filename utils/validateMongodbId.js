const mongoose = require('mongoose')
const { Schema } = mongoose

const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isValid) throw new Error("Invalid Id Provided!")
}

module.exports = { validateMongoDbId}