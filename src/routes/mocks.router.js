// routers/mocks.router.js
import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingusers/:quantity', mocksController.mockingUsers);
router.get('/mockingpets/:quantity', mocksController.mockingPets);
router.post('/generateData', mocksController.generateData);

export default router;
