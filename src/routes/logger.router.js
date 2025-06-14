import { Router } from 'express';
import loggerController from '../controllers/logger.controller.js';

const router = Router();

router.get('/loggerTest', loggerController.loggerTest);

// Error without try/catch
router.get('/loggerTest/boom', loggerController.boomTest);

// Promise rejection without try/catch
router.get('/loggerTest/fail', loggerController.failPromiseTest);

export default router;
