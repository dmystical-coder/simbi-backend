import { DailyStatus } from "./enums";
import { StudyPlanCreate } from "./study-plan.interfaces";

export interface PlanDailyStatus {
	id: string;
	planId: string;
	date: Date;
	totalMinutesStudied: number;
	targetAchieved: boolean;
	status: DailyStatus;

	// Relations
	plan?: StudyPlanCreate;
}

export interface CreatePlanDailyStatusInput {
	planId: string;
	date: Date;
	totalMinutesStudied?: number;
	targetAchieved?: boolean;
	status: DailyStatus;
	simbiReaction?: string;
}

export interface UpdatePlanDailyStatusInput {
	totalMinutesStudied?: number;
	targetAchieved?: boolean;
	status?: DailyStatus;
	simbiReaction?: string;
}
