import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { CLIENT_URL } from './config/env.config';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import './config/passport.config'; 
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();

app.use(cors({
  origin: CLIENT_URL, 
  credentials: true
}));
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); 

// --- Routes ---
app.get('/api/health', (req, res) => res.json({ status: 'UP' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// --- ADD ERROR HANDLER AS THE LAST MIDDLEWARE ---
app.use(errorHandler);

export default app;