import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDatabase } from '../src/config/database';
import routes from '../src/routes';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
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
