const express = require("express"); 
const app = express(); 

require('dotenv').config()
const databaseConnection = require('./config/database')
const logger = require('morgan')

app.get("/", 
    (req, res) => { res.send("Express on Vercel"); }
); 

const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });

module.exports = app;