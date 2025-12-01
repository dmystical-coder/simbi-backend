/**
 * Input received from the frontend for study plan generation
 */
export interface StudyPlanInput {
	name: string;
	subjects: string[] | string;
	startDate: string;
	endDate: string;
	dailyStudyTime: string;
	daysAvailable: string[] | string;
	priorityTag?: string;
	difficultyLevel?: string;
	studyLevel?: string;
	addToSchedule?: boolean | string;
	preferredStudyMethod: string;
	learningStyle: string;
	dailyStudyDuration: string;
	breakDuration: string;
	needStudyTips?: boolean | string;
	preferredTone?: string;
	milestoneType?: string;
	motivationPreference?: string;
	checkInStyle?: string;
	telegramReminder?: boolean | string;
	rewardStyle?: string;
	rewardFrequency?: string;
 }
  
  /**
   * Structure of the AI-generated study plan
   */
export interface GeneratedStudyPlan {
	overview: {
	  name: string;
	  subjects: string[];
	  duration: string;
	  totalDuration: number;
	  difficulty: string;
	};
	schedule: Array<{
	  date: string;
	  dayOfWeek: string;
	  sessions: Array<{
		topic: string;
		startTime: string;
		endTime: string;
		description: string;
		resources?: string[];
	  }>;
	}>;
	milestones: Array<{
	  date: string;
	  description: string;
	  completed: boolean;
	}>;
	tips: string[];
	rewards: Array<{
	  milestone: string;
	  reward: string;
	}>;
  }
  
  /**
   * Database model for study plan
   */
export interface StudyPlanCreate {
	id: string;
	userId: string;
	name: string;
	subjects: string[];
	startDate: Date;
	endDate: Date;
	totalDuration: number;
	difficultyLevel: string;
	planData: GeneratedStudyPlan;
	status: "active" | "completed" | "archived";
	createdAt: Date;
	updatedAt: Date;
  }