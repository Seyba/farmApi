const express = require('express')
const router = express.Router()
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware')
const { createEnquiry, deleteEnquiry, getEnquiries, getEnquiry, updateEnquiry } = require('../controllers/enqCtr')

router.get('/', getEnquiries)
router.post('/', createEnquiry)
router.get('/:id', authMiddleware, isAdmin, getEnquiry)
router.put('/:id', authMiddleware, isAdmin, updateEnquiry)
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry)

module.exports = router