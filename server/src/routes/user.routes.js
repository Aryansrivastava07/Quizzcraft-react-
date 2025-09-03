import { Router } from "express";
import {
    userRegister,
    userRequestVerificationMail,
    userVerification,
    userLogin,
    userLogout,
    userRefreshToken
} from "../controllers/user.controllers.js";
const router = Router();

router.route('/register').post(userRegister);
router.route('/userRequestVerificationMail/:id').get(userRequestVerificationMail);
router.route('/userVerification/:id').post(userVerification);
router.route('/login').post(userLogin);
router.route('/logout/:id').post(userLogout);
router.route('/refreshToken').post(userRefreshToken);

export default router;