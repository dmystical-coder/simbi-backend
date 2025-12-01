import express from "express";
import * as studyPlanController from "../controllers/studyPlan.controllers";
import { authMiddleware } from "../middlewares/authentication.middlewares";
import { generateStudyPlanValidator , validateConfirmCompleteStudySession } from "../validators/studyPlan.validators";


const router = express.Router();

/**
 * @route POST /api/study-plans/generate
 * @desc Generate a study plan using AI
 * @access Private
 */
router.post("/generate", authMiddleware, generateStudyPlanValidator,studyPlanController.generateStudyPlan);
router.get("/all", authMiddleware, studyPlanController.getAllStudyPlans);
router.get("/:planId", authMiddleware, studyPlanController.getStudyPlan);
router.delete("/:planId", authMiddleware, studyPlanController.deleteStudyPlan);
router.put("/:planId", authMiddleware, studyPlanController.updateStudyPlanStatus);

// route to get all milestones of a study plan
router.get("/:planId/milestones", authMiddleware, studyPlanController.getMilestonesByStudyPlanId);
// route to get all study sessions of a study plan
router.get("/:planId/sessions", authMiddleware, studyPlanController.getStudySessionsByStudyPlanId);

//route to confirm that a study session is completed
router.post("/complete-session",authMiddleware,validateConfirmCompleteStudySession,studyPlanController.confirmCompleteStudySession)

// route to get a session by id
router.get("/session/:sessionId", authMiddleware, studyPlanController.getStudySessionById);
// route to get a milestone by id
router.get("/milestone/:milestoneId", authMiddleware, studyPlanController.getMilestoneById);

export default router;