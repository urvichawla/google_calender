import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDatabase } from '../src/config/database';
import routes from '../src/routes';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://google-calender-taupe.vercel.app',
  /^https:\/\/google-calender-.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin || origin.startsWith(allowedOrigin);
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

connectDatabase();

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
