import express from 'express';
import webhookRoutes from './routes/webhooks';
import orderRoutes from './routes/orders';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/webhooks', webhookRoutes);
app.use('/orders', orderRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
