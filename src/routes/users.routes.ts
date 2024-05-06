import { Router } from "express";
const router = Router();
import { userInfo, EditUserInfo, createUser } from '../controllers/index';

router.get('/:email', userInfo);
router.put('/edit', EditUserInfo);
router.post('/createUser', createUser);
export default router;