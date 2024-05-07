const { generateToken } = require('../config/jwttoken')
const {generateNewToken} = require('../config/refreshToken')
const uniqid = require('uniqid')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/OrderModel')
const Cart = require('../models/cartModel')
const {validateMongoDbId} = require('../utils/validateMongodbId')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const sendEmail = require('../controllers/emailCtr')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { log } = require('console')

const createUser = asyncHandler(
    async (req, res) => {
    
        const email = req.body.email
        const user = await User.find({email})
    
        if(!user.length){
            //* Create one
            const newUser = User.create(req.body)
            res.json(newUser)
        } else {
            //* User already exist
            throw new Error(
                "An Account is Associated With this Email!!"
            )
            // res.json({
            //     msg: "An Account is Associated With this Email!!",
            //     success: false
            // })
        }
    
    }
)

//* Log In the user
const loginUserCtr = asyncHandler(
    async(req, res)=> {
        const { email, password} = req.body

        //* check for user
        const user = await User.findOne({email})
        const match = await bcrypt.compare(password, user.password)

        if(!user) throw new Error("No User Found!")

        if(user && match){
            const refreshToken = await generateNewToken(user?._id)
            const updateUser = await User.findByIdAndUpdate(
                user._id, 
                {refreshToken: refreshToken}, 
                {new: true}
            )

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000
            })
            res.json({
                _id: user?._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                mobile: user.mobile,
                token: generateToken(user?._id)
            })
        } else {
            throw new Error('Invalid Credentials')
        }
    }
)

//* Admin Login
const adminLogin = asyncHandler(
    async(req, res)=> {
        const { email, password} = req.body

        //* check for user
        const admin = await User.findOne({email})
        const match = await bcrypt.compare(password, admin.password)

        if(admin.role !== 'admin') throw new Error('Not Authorized!')

        if(admin && match){
            const refreshToken = await generateNewToken(admin?._id)
            const updateUser = await User.findByIdAndUpdate(
                admin._id, 
                {refreshToken: refreshToken}, 
                {new: true}
            )

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000
            })
            res.json({
                _id: admin?._id,
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
                mobile: admin.mobile,
                token: generateToken(admin?._id)
            })
        } else {
            throw new Error('Invalid Credentials')
        }
    }
)


//* Log Out the User
const logOut = asyncHandler(
    async(req, res) => {
        const cookie = req.cookies
        if(!cookie?.refreshToken) throw new Error('No new Token in Cookies!')

        const refreshToken = cookie.refreshToken
        const user = await User.findOne({refreshToken})
        
        if(!user) {
            res.clearCookie("resfreshToken", {
                httpOnly: true,
                secure: true
            })
            return res.sendStatus(204)//* Forbidden
        }
        
        await User.findOneAndUpdate({refreshToken}, {
            refreshToken: ""
        })

        res.clearCookie("resfreshToken", {
            httpOnly: true,
            secure: true
        })

        return res.sendStatus(204)//* Forbidden
    }
)

//* Read all the users
const getUsers = asyncHandler(
    async (req, res) => {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {
            throw new Error(error)
        }
    }
)

//* Read a single user
const getUser = asyncHandler(
    async (req, res) => {
        const { id } = req.params
        try {
            const user = await User.findById(id)
            res.json(user)
        }catch(e){
            throw new Error(error)
        }
    }
)

//* Update user
const updateUser = asyncHandler(
    async(req, res) => {
        const {_id} = req.user
        validateMongoDbId(_id)
        try{
            const findUser = await User.findByIdAndUpdate(_id, req.body, {new: true})
            res.json(findUser)
        }catch(e){
            throw new Error(error)
        }
    }
)

//* Delete user
const deleteUser = asyncHandler(
    async(req, res) => {
        const {id} = req.params
        validateMongoDbId(id)
        try{
            const user = await User.findByIdAndDelete(id)
            res.json(user)
        }catch(e){
            throw new Error(error)
        }
    }
)

//* Block User
const blockUser = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        validateMongoDbId(id)
        try {
            const userBlocked = await User.findByIdAndUpdate(id, {isBlocked: true}, {new: true})
            res.json({
                message: 'User is Blocked!'
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

//* Unblock User
const unBlockUser = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        validateMongoDbId(id)
        try {
            const userUnlocked = await User.findByIdAndUpdate(id, {isBlocked: false}, {new: true})
            res.json({
                message: 'User is Unblocked!'
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

//* Refresh User Token
const handleTokenRefresh = asyncHandler(
    async (req, res) => {
        const cookie = req.cookies
        if(!cookie?.refreshToken) throw new Error("No new Token in Cookies!")
        const refreshToken = cookie.refreshToken
        const user = await User.findOne({refreshToken})

        if(!user) throw new Error("No new token found in DB!")

        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if(err || user.id !== decoded.id) {
                throw new Error("Something is wrong with the new token.")
            }
            const accessToken = generateToken(user?._id)
            res.json({accessToken})
        })
    }
)

const updatePassword = asyncHandler(
    async(req, res) => {
        const { _id } = req.user
        const {password} = req.body
        validateMongoDbId(_id)

        const user = await User.findById(_id)

        if(password) {
            user.password = password
            const updatedPassword = await user.save()
            res.json(updatedPassword)
        } else {
            res.json(user)
        }
    }
)

const forgotPasswordToken = asyncHandler(
    async(req, res) => {
        const { email } = req.body
        const user = await User.findOne({email})

        if(!user) throw new Error('User not found!!')

        try {
            const token = await user.createPasswordResetToken()
            user.save()
            const resetURL = `
                Hi, Please follow this link to reset your password. 
                This link is valid for 10 minutes.
                <a href='http://localhost:4000/api/user/reset-password/${token}'>
                    Click here
                </a>`
            const data = {
                to: email,
                text: 'Hello, User!',
                subject: "Forgot Password Link",
                html: resetURL
            }
            sendEmail(data)
            res.json(token)
            
        } catch(error){
            throw new Error(error)
        }
    }
)

const resetPassword = asyncHandler(
    async(req, res) => {
        const { password } = req.body
        const { token } = req.params
        
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
        
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {$gt: Date.now()}
        })

        //console.log(user)

        if(!user){
            throw new Error("Token Expired, please try again later.")
        } 

        user.password = password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save()

        res.json(user)
    }
)

//* List All Products Added as wish list
const getWishList = asyncHandler(

    async(req, res) => {
        const { _id } = req.user
        try {
            const user = await User.findById(_id).populate("wishlist")
            res.json(user)
        } catch (error) {
            throw new Error(error)
        }
    }
)

//* Save User's Address
const saveAddress = asyncHandler(
    async(req, res, next) => {
        const {_id } = req.user
        validateMongoDbId(_id)
        try{
            const user = await User.findByIdAndUpdate(
                _id, 
                {address: req?.body?.address}, 
                {new: true}
            )
            res.json(user)
        }catch(e){
            throw new Error(error)
        }

    }
)

const userCart = asyncHandler(
    async(req, res) => {
        const { cart } = req.body
        const { _id } = req.user
        validateMongoDbId(_id)
        
        
        try {
            let products = []
            const user = await User.findById(_id)
            
            //* Check if user already has items in cart
            const alreadyExist = await Cart.findOne({orderby: user._id})
            if(alreadyExist){
                alreadyExist.remove()
            }

            for(let i = 0; i < cart.length; i++){
                let object = {}
                object.product = cart[i]._id
                object.color = cart[i].color
                object.count = cart[i].count

                let getPrice = await Product.findById(cart[i]._id).select("price").exec()
                object.price = getPrice.price
                products.push(object)
                
            }

            let cartTotal = 0

            for (let i = 0; i < products.length; i++) {
                cartTotal = cartTotal + products[i].price * products[i].count
            }

            let newCart = await new Cart({
                products,
                cartTotal,
                orderby: user?._id
            }).save()
            res.json(newCart)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getUserCart = asyncHandler(
    async(req, res) => {
        const { _id } = req.user
        validateMongoDbId(_id)
        try {
            const cart = await Cart.findOne({orderby: _id})
                .populate("products.product")
            res.json(cart)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const emptyCart = asyncHandler(
    async(req, res) => {

        const { _id } = req.user
        validateMongoDbId(_id)

        try {
            const user = await User.findOne({_id})
            const cart = await Cart.findOneAndRemove({orderby: user._id})
            res.json(cart)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const applyCoupon = asyncHandler(
    async(req, res) => {
        const { coupon } = req.body
        const { _id } = req.user
        validateMongoDbId(_id)

        const validCoupon = await Coupon.findOne({name: coupon})

        if(validCoupon === null) throw new error('Invalid Coupon!')

        const user = await User.findOne({_id})
        let { products, cartTotal} = await Cart.findOne({orderby: user._id})
            .populate("products.product")
        let totalAfterDiscount = (cartTotal -(cartTotal * validCoupon.discount) / 100).toFixed(2)

        await Cart.findOneAndUpdate({orderby:user._id}, {totalAfterDiscount}, {new: true})
        
        res.json(totalAfterDiscount)
    }
)

const createOrder = asyncHandler(
    async(req, res)=> {
        const { COD, couponApplied } = req.body 
        const { _id } = req.user
        validateMongoDbId(_id)
        
        try {
            if (!COD) throw new Error('Create cash order failed')
            const user = await User.findById(_id)
            let userCart = await Cart.findOne({orderby: user._id})
            let finalAmount = 0

            if(couponApplied && userCart.totalAfterDiscount) {
                finalAmount = userCart.totalAfterDiscount
            } else {
                finalAmount = userCart.cartTotal 
            }

            let newOrder = await new Order({
                products: userCart.products,
                paymentIntent: {
                    id: uniqid(), 
                    method: 'COD', 
                    amount: finalAmount, 
                    status: "Cash On Delivery",
                    created: Date.now(),
                    currency: "USD",
                },
                orderBy: user._id,
                orderStatus: "Cash on Delivery"
            }).save()
            let update = userCart.products.map(
                (item) => {
                    return {
                        updateOne: {
                            filter: {_id: item.product._id},
                            update: {$inc: {quantity: -item.count, sold: +item.count}}
                        }
                    }
                }
            )

            const updated = await Product.bulkWrite(update, {})
            res.json({message: 'success'})
        } catch (error) {
            throw new Error(error)
        }        
    }
)

const getOrders = asyncHandler(
    async(req, res) => {
        const { _id} = req.user
        validateMongoDbId(_id)

        try {
            const userOrders = await Order.findOne({orderBy:_id})
                .populate('products.product').populate('orderBy')
                .exec()
            res.json(userOrders)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getAllOrders = asyncHandler(
    async(req, res) => {

        try {
            const allOrders = await Order.find()
                .populate('products.product').populate('orderBy')
                .exec()
            res.json(allOrders)
        } catch (error) {
            throw new Error(error)
        }
    }
)


const updateOrderStatus = asyncHandler(
    async(req, res) => {
        const { status } = req.body
        const { id } = req.params
        validateMongoDbId(id)

        try {
            const updatedOrderStatus = await Order.findByIdAndUpdate(
                id, 
                {orderStatus: status, paymentIntent:{status: status}}, 
                {new: true}
            )
            res.json(updatedOrderStatus)
        } catch (error) {
            throw new Error(error)
        }
    }
)

module.exports = {
    adminLogin,
    applyCoupon,
    blockUser,
    createOrder,
    createUser, 
    deleteUser,
    emptyCart,
    forgotPasswordToken,
    getAllOrders,
    getOrders,
    getUser,
    getUserCart, 
    getUsers, 
    getWishList,
    handleTokenRefresh,
    loginUserCtr, 
    logOut,
    resetPassword,
    saveAddress,
    unBlockUser,
    updateOrderStatus,
    updateUser,
    updatePassword,
    userCart
}