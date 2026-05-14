import { Router, Request, Response } from 'express';
import { getOrders, getOrderById } from '../services/order.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const marketplace = typeof req.query.marketplace === 'string' ? req.query.marketplace : undefined;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
  const result = await getOrders(marketplace, page, limit);
  res.json(result);
});

router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

export default router;
