const Coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')
const {validateMongoDbId} = require('../utils/validateMongodbId')

const createCoupon = asyncHandler(
    async(req, res) => {
        try {
            const newCoupon = await Coupon.create(req.body)
            res.json(newCoupon)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateCoupon = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        validateMongoDbId(id)
        try {
            const coupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true})
            res.json(coupon)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const deleteCoupon = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        validateMongoDbId(id)
        try {
            const coupon = await Coupon.findByIdAndDelete(id)
            res.json({msg: "Coupon deleted!"})
        } catch (error) {
            throw new Error(error)
        }
    }
)
const getCoupons = asyncHandler(
    async(req, res) => {
        try {
            const  coupons = await Coupon.find({})
            res.json(coupons)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getCoupon = asyncHandler(
    async(req, res) => {
        const { id } = req.params
        validateMongoDbId(id)
        try {
            const coupon = await Coupon.findById(id)
            res.json(coupon)
        } catch (error) {
            throw new Error(error)
        }
    }
)


module.exports = {createCoupon, deleteCoupon, getCoupon, getCoupons, updateCoupon}