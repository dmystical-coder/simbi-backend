import joi from "joi";
import { Request, Response, NextFunction } from "express";

export async function preassessmentValidator(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const schema = joi.object({
		"What is your preferred way of studying?": joi.string().required(),
		"How do you usually take notes?": joi.string().required(),
		"What time do you feel most focused?": joi.string().required(),
		"How long can you study before losing focus?": joi.string().required(),
		"What is your biggest struggle when studying?": joi.string().required(),
		"How often do you procrastinate on studying?": joi.string().required(),
		"What is your current level of education?": joi.string().required(),
		"Would you like Simbi to hold you accountable? (e.g, with reminders or check-ins)?": joi
			.string()
			.required(),
		"How should SIMBI react if you miss a study goal?": joi.string().required(),
		"What are your current learning goals?": joi.string().required().min(20),
		"How often would you like SIMBI to check in on your progress?": joi.string().required(),
	});
	const { error } = schema.validate(req.body);
	if (error) {
		res.status(400).json({
			message: "Validation error",
			details: error.details.map((d) => d.message),
		});
		return;
	}
	next();
}
