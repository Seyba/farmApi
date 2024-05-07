const express = require('express')
const router = express.Router()
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware')
const { createColor, deleteColor, getColors, getColor, updateColor } = require('../controllers/colorCtr')
router.get('/', getColors)
router.post('/', authMiddleware, isAdmin, createColor)
router.put('/:id', authMiddleware, isAdmin, updateColor)
router.get('/:id', getColor)
router.delete('/:id', authMiddleware, isAdmin, deleteColor)

module.exports = router