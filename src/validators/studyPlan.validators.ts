import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BadRequestError } from "../utils/errorClasses";

export function generateStudyPlanValidator(req: Request, res: Response, next: NextFunction): void {
    const studyPlanSchema = z.object({
        name: z.string().min(1, "Name is required"),
        subjects: z.union([
            z.string(),
            z.array(z.string())
        ]),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
        dailyStudyTime: z.string().regex(/^\d{1,2}:\d{2}$/, "Daily study time must be in HH:MM format").optional(),
        daysAvailable: z.union([
            z.string(),
            z.array(z.string().refine(val => 
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(val),
                "Invalid day of week"
            ))
        ]),
        preferredStudyMethod: z.string().min(1, "Preferred study method is required").optional(),
        learningStyle: z.string().min(1, "Learning style is required").optional(),
        dailyStudyDuration: z.string().regex(/^\d+[hm]$/, "Daily study duration must be in format: Xh or Xm"),
        breakDuration: z.string().regex(/^\d+[hm]$/, "Break duration must be in format: Xm or Xh"),
        needStudyTips: z.union([z.boolean(), z.string()]).optional(),
        priorityTag: z.string().optional(),
        difficultyLevel: z.string().optional(),
        studyLevel: z.string().optional(),
        addToSchedule: z.union([z.boolean(), z.string()]).optional(),
        preferredTone: z.string().optional(),
        milestoneType: z.string().optional(),
        motivationPreference: z.string().optional(),
        checkInStyle: z.string().optional(),
        telegramReminder: z.union([z.boolean(), z.string()]).optional(),
        rewardStyle: z.string().optional(),
        rewardFrequency: z.string().optional(),
    });

    try {
        studyPlanSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            next(new BadRequestError(error.errors[0].message));
            return;
        }
        next(error);
    }
}


export function validateConfirmCompleteStudySession(req: Request, _res: Response, next: NextFunction): void {
    const confirmCompleteStudySessionSchema = z.object({
        planId: z.string().min(1, "Plan ID is required"),
        sessionId: z.string().min(1, "Session ID is required"),
        timeSpent: z.string().transform((val) => Number(val))
    });

    try {
        confirmCompleteStudySessionSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            next(new BadRequestError(error.errors[0].message));
            return;
        }
        next(error);
    }
}