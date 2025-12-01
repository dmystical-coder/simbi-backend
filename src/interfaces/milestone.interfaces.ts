// milestone.interfaces.ts
import { MilestoneStatus } from "./enums";
import { User } from "./user.interfaces";
import { StudyPlanCreate } from "./study-plan.interfaces";

export interface Milestone {
	id: string;
	userId: string;
	planId?: string | null;
	title: string;
	description?: string | null;
	dueDate?: Date | null;
	completionCriteria?: string | null;
	percentage?: number | null;
	status: MilestoneStatus;
	createdAt: Date;
	completedAt?: Date | null;

	// Relations
	user?: User;
	plan?: StudyPlanCreate | null;
}

export interface CreateMilestoneInput {
	userId: string;
	planId?: string | null;
	title: string;
	description?: string | null;
	dueDate?: Date | null;
	completionCriteria?: string | null;
	status?: MilestoneStatus;
	percentage?: number | null;
}

export interface UpdateMilestoneInput {
	title?: string;
	description?: string | null;
	dueDate?: Date | null;
	completionCriteria?: string | null;
	status?: MilestoneStatus;
	completedAt?: Date | null;
	percentage?: number | null;
}
