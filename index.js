const express = require("express"); 

require('dotenv').config()
const databaseConnection = require('./config/database')
const logger = require('morgan')
const authRouter = require('./routes/authRoutes')
const blogCategoryRouter = require('./routes/blogCategoryRoutes')
const couponRouter = require('./routes/couponRoutes')
const colorRouter = require('./routes/colorRoutes')
const brandRouter = require('./routes/brandRoutes')
const enquiryRouter = require('./routes/enqRoutes')
const prodCategoryRouter = require('./routes/prodcategoryRoutes')
const productRouter = require('./routes/productRoute')
const blogRouter = require('./routes/blogRoutes')
const uploadRouter = require('./routes/uploadRoutes')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express(); 

// app.get("/", 
//     (req, res) => { res.send("Express on Vercel"); }
// ); 

const PORT = process.env.PORT || 8000; 
//app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });


//* Middlewares
app.use(express.json());
app.use(logger('dev'))
app.use(cookieParser())
app.use(cors())

app.use('/api/blog', blogRouter)
app.use('/api/blogcategory', blogCategoryRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/prodcategory', prodCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/user', authRouter)
app.use('/api/brand', brandRouter)
app.use('/api/color', colorRouter)
app.use('/api/enq', enquiryRouter)
app.use('/api/upload', uploadRouter)
app.use(notFound)
app.use(errorHandler)

//* connect to the database
databaseConnection()

app.listen(PORT, function() {
    console.log(`Express app running on port ${PORT}`)
});
//module.exports = app;