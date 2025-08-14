import { Router } from "express";
import { quizCreation, getQuiz,updateQuiz} from "../controllers/quizCreation.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import  {authenticateUser}  from "../middlewares/authenticator.middleware.js";
import { get } from "http";
const router = Router();

router.route('/quizCreation').post(authenticateUser,upload.array('files') ,quizCreation);
router.route('/getQuiz').get(authenticateUser,getQuiz);
router.route('/updateQuiz').post(authenticateUser,updateQuiz);


export default router;

