import { Router } from "express";
const router = Router();
import { getAllUsers } from '../controllers/index';
router.get('/', getAllUsers);
export default router;