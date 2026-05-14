import { Router } from 'express';
import { handleFalabellaWebhook } from '../webhooks/falabella.handler';
import { handleRipleyWebhook } from '../webhooks/ripley.handler';
import { handleParisWebhook } from '../webhooks/paris.handler';

const router = Router();

router.post('/falabella', handleFalabellaWebhook);
router.post('/ripley', handleRipleyWebhook);
router.post('/paris', handleParisWebhook);

export default router;
