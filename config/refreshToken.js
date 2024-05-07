const jwt = require('jsonwebtoken')

const generateNewToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "3d"})
}

module.exports = {generateNewToken}