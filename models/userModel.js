const mongoose = require('mongoose')
const { Schema, model} = mongoose
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userModel = new Schema({
    firstname: {
        type: String,
        required: true,
        index: true
    },
    lastname: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String, 
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: String
    },
    wishlist: [{type: Schema.Types.ObjectId, ref: "Product"}],
    refreshToken: {
        type: String
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date

},{timestamps: true})

userModel.pre("save", async function(next){
    if(!this.isModified('password')) {
        next()
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userModel.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userModel.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.createPasswordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest("hex")
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000 //? 10 minutes
    return resetToken
}
const User = model("User", userModel)
module.exports = User