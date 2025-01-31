import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);

export default router;
