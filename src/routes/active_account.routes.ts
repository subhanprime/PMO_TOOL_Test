import { Router } from "express";
const router = Router();
import { activeAccount } from '../controllers/index';

router.get('/active', activeAccount);
export default router;