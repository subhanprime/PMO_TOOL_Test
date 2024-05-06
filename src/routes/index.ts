import loginRoute from './authentication/login';
import user from './users.routes';
import { Router } from "express";
import active_account from './active_account.routes';
import AllUsers from './allUsers.routes';
import { resetPassword } from '../controllers';

const router = Router();

router.use('/account', active_account);
router.use('/user', user);
router.use('/allUsers', AllUsers);
router.use('/login', loginRoute);
router.use('/resetPassword', resetPassword);

export default router;