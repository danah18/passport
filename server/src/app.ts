import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes';
import tripRoutes from './routes/tripRoutes';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users', tripRoutes);

export default app;
