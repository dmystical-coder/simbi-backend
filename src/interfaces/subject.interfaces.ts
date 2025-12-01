import { User } from "./user.interfaces";
import { StudyPlanCreate } from "./study-plan.interfaces";
import { QuizQuestion } from "./quiz-question.interfaces";

export interface Subject {
	id: string;
	userId: string;
	name: string;
	educationLevel: string;
	educationYear?: number | null;
	colorCode: string;
	difficultyLevel: number;
	priority: number;
	createdAt: Date;

	// Relations
	user?: User;
	studyPlans?: StudyPlanCreate[];
	quizQuestions?: QuizQuestion[];
}

export interface CreateSubjectInput {
	userId: string;
	name: string;
	educationLevel: string;
	educationYear?: number | null;
	colorCode?: string;
	difficultyLevel?: number;
	priority?: number;
}

export interface UpdateSubjectInput {
	name?: string;
	educationLevel?: string;
	educationYear?: number | null;
	colorCode?: string;
	difficultyLevel?: number;
	priority?: number;
}
