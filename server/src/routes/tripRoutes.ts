// src/routes/tripRoutes.ts
import { Router } from 'express';
import { tripController } from '../controllers/tripController';

const router = Router();

router.post('/:userId/trips', tripController.createTrip);
router.get('/:userId/trips/:tripId', tripController.getTripById);
router.post('/:userId/trips/:tripId/places', tripController.createPlace);
router.get('/:userId/trips/:tripId/places', tripController.getTripPlaces);

export default router;
