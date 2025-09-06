import { Router } from "express";
import { quizCreation, getQuiz,updateQuiz, deleteQuiz} from "../controllers/quizCreation.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import  {authenticateUser}  from "../middlewares/authenticator.middleware.js";
const router = Router();

router.route('/quizCreation').post(authenticateUser,upload.array('files') ,quizCreation);
router.route('/getQuiz').get(authenticateUser,getQuiz);
router.route('/updateQuiz').post(authenticateUser,updateQuiz);
router.route('/deleteQuiz/:id').delete(authenticateUser, deleteQuiz);


export default router;
