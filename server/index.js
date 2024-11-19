const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoute');
const { createServer } = require('http'); 
const { Server } = require('socket.io'); 
const initializeScheduler = require('./utils/scheduler');

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
const server = createServer(app); 

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'], 
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000, // Increase connection timeout
  pingInterval: 25000 // Ping interval
});

// Connecting to the database 
connectDB();

// Middlewares 
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true,
  })
);


// Routes
app.get('/', (req, res) => {
  res.send('Server is running ...');
});

app.use('/api/v1/admin', require("./routes/adminRoute")); 
app.use('/api/v1/student', require("./routes/studentRoute"));
app.use('/api/v1/mentor', require("./routes/mentorRoute"));
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', require('./routes/reportRoute'));

// Initialize scheduler
initializeScheduler();

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', (data) => {
    socket.broadcast.emit('receiveMessage', {
      senderId: data.senderId,
      message: data.message,
      senderName: data.senderName,
      userType: data.userType
    });
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket ${socket.id} disconnected: ${reason}`);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
