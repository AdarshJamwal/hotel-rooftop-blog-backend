const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));


// Routes
const blogRoutes = require('./src/routes/blog.route');
const commentRoutes = require('./src/routes/comment.route');
const userRoutes = require('./src/routes/auth.user.route');

app.use('/api/auth', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('App is running Successfully!');
});

// Database connection
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

main();

// Export app for Vercel serverless function handling
module.exports = app;
