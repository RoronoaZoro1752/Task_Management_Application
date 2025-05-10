import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

connectDB();

const app = express();
 
// Middleware
app.use(cors({
  origin: "https://taskmanagementfrontend123.onrender.com",
  credentials: true,
}));

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});