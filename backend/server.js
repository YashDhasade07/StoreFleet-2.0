import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from './src/models/index.js';
import routes from './src/routes/index.js';

console.log('Server is running------------');
const app = express();
console.log('Server is running------------2');
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

// Global error handler
// app.use(errorHandler);

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
