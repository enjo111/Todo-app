import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import { sequelize } from './model/todo.js';
import todoRoutes from './routes/todoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import logger from './middleware/logger.js';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// 1. Global Middlewares
app.use(cors({
  origin: true, // This reflects the request origin, allowing all origins while supporting credentials
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parses incoming JSON payloads
app.use(logger); // Use the logger middleware

// 2. Health Check / Root Route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Todo API is running smoothly!' });
});

// 3. API Routes Integration
app.use('/api/todos', todoRoutes);
app.use('/api/auth', userRoutes);

// 4. Fallback for Unhandled Routes (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// 5. Database Sync & Server Startup
const startServer = async (): Promise<void> => {
  try {
    // Authenticate and sync model with SQLite database
    await sequelize.authenticate();
    console.log(' SQLite connection established successfully.');

    // sync() creates the table if it doesn't exist.
    // Use { force: true } during dev only if you want to drop and recreate tables on every restart.
    await sequelize.sync();
    console.log(' Database synchronized.');

    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
