const express = require('express')
const router = express.Router()
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware')
const { createBrand, deleteBrand, getBrands, getBrand, updateBrand } = require('../controllers/brandCtr')
router.get('/', getBrands)
router.post('/', authMiddleware, isAdmin, createBrand)
router.put('/:id', authMiddleware, isAdmin, updateBrand)
router.get('/:id', getBrand)
router.delete('/:id', authMiddleware, isAdmin, deleteBrand)

module.exports = router