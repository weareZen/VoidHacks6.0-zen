const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

// Connecting to the database 
connectDB();

// Middlewares 
app.use(express.json());
app.use(cors({
  origin: '*', 
  credentials: true, 
}));


// Routes
app.get('/', (req, res) => {
  res.send('Server is running ...');
});

// app.use('/api/v1/user', userRoutes); 

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});