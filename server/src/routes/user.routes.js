import { Router } from "express";
import {
    userRegister,
    userRequestVerificationMail,
    userVerification,
    userLogin,
    userLogout,
    userRefreshToken,
    getUser,
    updateProfile,
    uploadAvatar,
    getAvatar
} from "../controllers/user.controllers.js";
import  {authenticateUser}  from "../middlewares/authenticator.middleware.js";
import { avatarUpload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route('/register').post(userRegister);
router.route('/userRequestVerificationMail/:id').get(userRequestVerificationMail);
router.route('/userVerification/:id').post(userVerification);
router.route('/login').post(userLogin);
router.route('/logout/:id').post(userLogout);
router.route('/refreshToken').post(userRefreshToken);
router.route('/user').get(authenticateUser,getUser);
router.route('/updateProfile').post(authenticateUser, updateProfile);
router.route('/upload-avatar').post(authenticateUser, avatarUpload.single('avatar'), uploadAvatar);
router.route('/avatar').get(authenticateUser, getAvatar);

export default router;