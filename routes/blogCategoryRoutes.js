const express = require('express')
const router = express.Router()
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware')
const { createCategory, deleteCategory, getCategories, getCategory, updateCategory } = require('../controllers/blogCategoryCtr')
router.get('/', getCategories)
router.post('/', authMiddleware, isAdmin, createCategory)
router.put('/:id', authMiddleware, isAdmin, updateCategory)
router.get('/:id', getCategory)
router.delete('/:id', authMiddleware, isAdmin, deleteCategory)

module.exports = router