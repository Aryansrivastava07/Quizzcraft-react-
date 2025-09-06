import { Router } from "express";
import {
    userRegister,
    userRequestVerificationMail,
    userVerification,
    userLogin,
    userLogout,
    userRefreshToken,
    getUser
} from "../controllers/user.controllers.js";
import  {authenticateUser}  from "../middlewares/authenticator.middleware.js";
const router = Router();

router.route('/register').post(userRegister);
router.route('/userRequestVerificationMail/:id').get(userRequestVerificationMail);
router.route('/userVerification/:id').post(userVerification);
router.route('/login').post(userLogin);
router.route('/logout/:id').post(userLogout);
router.route('/refreshToken').post(userRefreshToken);
router.route('/user').get(authenticateUser,getUser);

export default router;