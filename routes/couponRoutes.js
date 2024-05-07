const express = require('express')
const { createCoupon, deleteCoupon, getCoupon, getCoupons, updateCoupon } = require('../controllers/couponCtr')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { uploadImages } = require('../controllers/productCtr')
const router = express.Router()

router.post('/', authMiddleware, isAdmin ,createCoupon)
router.get('/', authMiddleware, isAdmin, getCoupons)
router.get('/:id', authMiddleware, isAdmin, getCoupon)
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon)
router.put('/:id', authMiddleware, isAdmin, updateCoupon, uploadImages)
module.exports = router