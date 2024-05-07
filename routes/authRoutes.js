const express = require('express')
const router = express.Router()
const { 
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
    getUserCart,
    getUser, 
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
} = require('../controllers/userCtr')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')

router.put("/password",authMiddleware ,updatePassword)
router.post("/cart", authMiddleware, userCart)
router.post("/forgot-password-token", forgotPasswordToken)
router.post("/admin-login", adminLogin)
router.put("/reset-password/:token", resetPassword)
router.post("/cart/cash-order", authMiddleware, createOrder)
router.post("/register", createUser)
router.post("/login", loginUserCtr)
router.post("/cart/applycoupon", authMiddleware, applyCoupon)
router.get("/logout", logOut)
router.delete("/empty-cart", authMiddleware, emptyCart)
router.get("/cart", authMiddleware, getUserCart)
router.get("/all-users", getUsers)
router.get("/refresh", handleTokenRefresh)
router.get("/wishlist", authMiddleware, getWishList)
router.get("/get-orders", authMiddleware, getOrders)
router.get("/get-allOrders", authMiddleware, isAdmin, getAllOrders)
router.put("/save-address", authMiddleware, saveAddress)
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus)
router.get("/:id", authMiddleware, isAdmin, getUser)
router.delete("/:id", deleteUser)
router.put("/edit-user", authMiddleware, updateUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser)

module.exports = router