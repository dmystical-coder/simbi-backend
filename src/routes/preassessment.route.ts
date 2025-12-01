import { Request, Response, NextFunction } from "express";
import { preassessmentValidator } from "../validators/preassessment";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authentication.middlewares";
import { CustomRequest } from "../interfaces/request.interfaces";
import prisma from "../database/db";

const preassessmentRoute: Router = Router();

preassessmentRoute.post(
	"/",
	authMiddleware,
	preassessmentValidator,
	async (req: CustomRequest, res: Response, next: NextFunction) => {
		await prisma.user.update({
			where: {
				id: req.user?.id,
			},
			data: {
				preferredStudyMethod: req.body["What’s your preferred way of studying?"],
				preAssesmentQuestions: req.body,
			},
		});
        res.status(200).json({
            status: "success",
            message: "Preassessment saved successfully",
        });
        return;
	}
);

export default preassessmentRoute;
