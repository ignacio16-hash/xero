import { Router, Request, Response } from 'express';
import { getOrders, getOrderById } from '../services/order.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { marketplace, page, limit } = req.query;
  const result = await getOrders(
    marketplace as string | undefined,
    page ? parseInt(page as string) : 1,
    limit ? parseInt(limit as string) : 20
  );
  res.json(result);
});

router.get('/:id', async (req: Request, res: Response) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

export default router;
