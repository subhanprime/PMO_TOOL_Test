import { Router } from "express";
const router = Router();
import { createProject } from '../controllers/index';

router.post('/create', createProject);
export default router;