import { Router } from "express";
import { predict, getExamList } from "../controllers/predictor.controller";

const router = Router();
router.get("/", predict);
router.get("/exams", getExamList);

export default router;
