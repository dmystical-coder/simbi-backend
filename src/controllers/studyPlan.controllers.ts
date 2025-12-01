import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../interfaces/request.interfaces";
import * as studyPlanService from "../services/studyPlan.services";
import { StudyPlanInput } from "../interfaces/study-plan.interfaces";
import { getStudyPlanById } from "../models/studyPlan.models";
import { getUserById } from "../services/user.services";


export async function generateStudyPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const studyPlanInput: StudyPlanInput = req.body;
        const userId = customReq.user.id;
        // Generate study plan using OpenAI
        const generatedPlan = await studyPlanService.generateStudyPlan(userId, studyPlanInput);

        if (generatedPlan) {
            // send email to user
            const studyPlan = generatedPlan.overview.name;
            await studyPlanService.sendStudyPlanEmail(
                userId,
                studyPlan,
            );

            res.status(200).json({
                status: "success",
                message: "Study plan generated successfully",
                data: generatedPlan
            });
            return;
        }

        next(new Error("Failed to generate study plan"));
    } catch (error) {
        console.error("Error in generateStudyPlan controller:", error);
        next(error);
    }
}

//get all study plans created by a user
export async function getAllStudyPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }
        const userId = customReq.user.id;
        const studyPlans = await studyPlanService.getStudyPlans(userId);
        if (studyPlans) {
            res.status(200).json({
                status: "success",
                message: "Study plans retrieved successfully",
                data: studyPlans
            });
            return;
        }
        next(new Error("Failed to retrieve study plans"));
    } catch (error) {
        console.error("Error in getAllStudyPlans controller:", error);
        next(error);
    }
}



// this function is used to get the study plan a particular user study plan
export async function getStudyPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
     
        
        const planId = req.params.planId;
        if (!planId) {
            res.status(400).json({ success: false, message: "Plan ID is required" });
            return;
        }
        // Validate user is authenticated

        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const userId = customReq.user.id;
        const studyPlan = await studyPlanService.getStudyPlan(planId);

        if (studyPlan) {
            res.status(200).json({
                status: "success",
                message: "Study plan retrieved successfully",
                data: studyPlan
            });
            return;
        }

        next(new Error("Failed to retrieve study plan"));
    } catch (error) {
        console.error("Error in getStudyPlan controller:", error);
        next(error);
    }
}


// Update a study plan  status
export async function updateStudyPlanStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const planId = req.params.planId;
        if (!planId) {
            res.status(400).json({ success: false, message: "Plan ID is required" });
            return;
        }
        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const userId = customReq.user.id;
        const status = req.body.status;

        const updatedPlan = await studyPlanService.updateStudyPlanStatus(planId, status);

        if (updatedPlan) {
            res.status(200).json({
                status: "success",
                message: "Study plan status updated successfully",
                data: updatedPlan
            });
            return;
        }

        next(new Error("Failed to update study plan status"));
    } catch (error) {
        console.error("Error in updateStudyPlanStatus controller:", error);
        next(error);
    }
}

// Delete a study plan
export async function deleteStudyPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const planId = req.params.planId;
        if (!planId) {
            res.status(400).json({ success: false, message: "Plan ID is required" });
            return;
        }
        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const userId = customReq.user.id;

        await studyPlanService.deleteStudyPlan(planId);

        res.status(200).json({
            status: "success",
            message: "Study plan deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteStudyPlan controller:", error);
        next(error);
    }
}


// get a milestone by study plan id
export async function getMilestonesByStudyPlanId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const planId = req.params.planId;
        if (!planId) {
            res.status(400).json({ success: false, message: "Plan ID is required" });
            return;
        }
        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const userId = customReq.user.id;

        const milestones = await studyPlanService.getMilestonesByStudyPlanId(planId);

        if (milestones) {
            res.status(200).json({
                status: "success",
                message: "Milestones retrieved successfully",
                data: milestones
            });
            return;
        }

        next(new Error("Failed to retrieve milestones"));
    } catch (error) {
        console.error("Error in getMilestonesByStudyPlanId controller:", error);
        next(error);
    }
}

// get a study session by study plan id
export async function getStudySessionsByStudyPlanId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const planId = req.params.planId;
        if (!planId) {
            res.status(400).json({ success: false, message: "Plan ID is required" });
            return;
        }
        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const userId = customReq.user.id;

        const studySessions = await studyPlanService.getStudySessionsByStudyPlanId(planId);

        if (studySessions) {
            res.status(200).json({
                status: "success",
                message: "Study sessions retrieved successfully",
                data: studySessions
            });
            return;
        }

        next(new Error("Failed to retrieve study sessions"));
    } catch (error) {
        console.error("Error in getStudySessionsByStudyPlanId controller:", error);
        next(error);
    }
}


// confirm a study session was completed by study plan id
export async function confirmCompleteStudySession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }
        const planId = req.body.planId;
        const sessionId = req.body.sessionId;
        const timeSpent=req.body.timeSpent;
        const userId= customReq.user.id;

        const updatedSession = await studyPlanService.confirmStudySession(planId,timeSpent,sessionId);

        if (updatedSession) {
            await studyPlanService.sendStudySessionEmail(userId,updatedSession.topic)
            res.status(200).json({
                status: "success",
                message: "Study session updated successfully",
                data: updatedSession
            });
            return;
        }

        next(new Error("Failed to update study session"));
    } catch (error) {
        console.error("Error in updateStudySessionById controller:", error);
        next(error);
    }
}


// get a study session by id
export async function getStudySessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const sessionId = req.params.sessionId;
        if (!sessionId) {
            res.status(400).json({ success: false, message: "Session ID is required" });
            return;
        }
        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const userId = customReq.user.id;

        const studySession = await studyPlanService.getStudySessionById(sessionId);

        if (studySession) {
            res.status(200).json({
                status: "success",
                message: "Study session retrieved successfully",
                data: studySession
            });
            return;
        }

        next(new Error("Failed to retrieve study session"));
    } catch (error) {
        console.error("Error in getStudySessionById controller:", error);
        next(error);
    }
}


// get  a milestone by id
export async function getMilestoneById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const milestoneId = req.params.milestoneId;
        if (!milestoneId) {
            res.status(400).json({ success: false, message: "Milestone ID is required" });
            return;
        }
        // Validate user is authenticated
        const customReq = req as CustomRequest;
        if (!customReq.user?.id) {
            res.status(401).json({ success: false, message: "Authentication required" });
            return;
        }

        const userId = customReq.user.id;

        const milestone = await studyPlanService.getMilestoneById(milestoneId);

        if (milestone) {
            res.status(200).json({
                status: "success",
                message: "Milestone retrieved successfully",
                data: milestone
            });
            return;
        }

        next(new Error("Failed to retrieve milestone"));
    } catch (error) {
        console.error("Error in getMilestoneById controller:", error);
        next(error);
    }
}

