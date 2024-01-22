require('dotenv').config();

// Common imports
const express = require('express');
const cors = require("cors");
const morgan = require('morgan');
const redis = require("./utils/redis.utils");
const createError = require('http-errors');
const mongo = require("./utils/mongo.utils");
const http = require('http');

// Inits
redis.init();
mongo.init();

const AuthRoutes = require("./src/routes/auth.routes");
const UserRoutes = require("./src/routes/user.routes");
const PackageRoutes = require("./src/routes/package.routes");
const DeliveryRoutes = require("./src/routes/delivery.routes");
const { verifyAccessToken } = require("./utils/jwt.utils");
const socketService = require('./src/services/socket.service');

// App config
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors config
const corsOptions = {
  origin: "http://localhost:4200",
};
app.use(cors(corsOptions));

// Socket.IO setup
const server = http.createServer(app);
socketService.configureSocket(server);

// Routes declarations
app.get('/', async (req, res, next) => {
    res.send('Hello, welcome to Package Tracker api');
});

app.get('/api', verifyAccessToken, async (req, res, next) => {
  res.status(200).json({ message: "Yeah you can access a protected route" });
});

app.use('/api/auth', AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/packages', PackageRoutes);
app.use('/api/deliveries', DeliveryRoutes);

// Error handling
app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// App startup
const PORT = process.env.SERVER_PORT || 2024;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
