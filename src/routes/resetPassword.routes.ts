import { Router } from "express";
const router = Router();
import { resetPassword } from '../controllers/index';
router.put('/', resetPassword);
export default router;