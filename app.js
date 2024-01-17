require('dotenv').config()

// Common imports
const express = require('express');
const morgan = require('morgan');
const redis = require("./utils/redis.utils");
const createError = require('http-errors')
const mongo = require("./utils/mongo.utils");

// Inits
redis.init();
mongo.init();

const AuthRoutes = require("./src/routes/auth.routes");
const { verifyAccessToken } = require("./utils/jwt.utils");


// App config
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes declarations
app.get('/', async (req, res, next) => {
    res.send('Hello, welcome to Package Tracker api')
})
app.get('/api', verifyAccessToken, async (req, res, next) => {
  res.status(200).json({message:"Yeah you can access a protected route"})
})
app.use('/api/auth', AuthRoutes)
// app.use('/auth', AuthRoutes)



// Error handling
app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

// App startup
const PORT = process.env.PORT || 2024
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app;