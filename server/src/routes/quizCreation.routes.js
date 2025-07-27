import { Router } from "express";
import { quizCreation } from "../controllers/quizCreation.controllers.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();

router.route('/quizCreation').post(upload.array('files') ,quizCreation);

export default router;