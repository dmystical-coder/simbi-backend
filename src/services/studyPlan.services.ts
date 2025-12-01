import OpenAI from "openai";
import { z } from "zod";
import config from "../config/settings";
import { getUserById } from "./user.services";
import * as studyPlanModel from "../models/studyPlan.models";
import { StudyPlanInput, GeneratedStudyPlan,StudyPlanCreate} from "../interfaces/study-plan.interfaces";
import { sendStudyPlanCreatedEmail,sendStudySessionCompeted} from "./email.services";
import { BadRequestError, ForbiddenError } from "../utils/errorClasses";

const client = new OpenAI({
  apiKey: config.SIMBI_AI_KEY,
  baseURL: "https://api.openai.com/v1",
});

// Zod schema for validating the input
const studyPlanInputSchema = z.object({
    name: z.string(),
    subjects: z.array(z.string()).or(z.string()),
    startDate: z.string(),
    endDate: z.string(),
    dailyStudyTime: z.string().optional().default("00:00"),
    daysAvailable: z.array(z.string()).or(z.string()),
    priorityTag: z.string().optional().default("Medium"),
    difficultyLevel: z.string().optional().default("Intermediate"),
    studyLevel: z.string().optional().default("Undergraduate"),
    addToSchedule: z.boolean().or(z.string().transform(val => val === "Yes")).optional().default(false),
    preferredStudyMethod: z.string().optional().default("Pomodoro"),
    learningStyle: z.string().optional().default("Visual"),
    dailyStudyDuration: z.string(),
    breakDuration: z.string(),
    needStudyTips: z.boolean().or(z.string().transform(val => val === "Yes")).optional().default(true),
    preferredTone: z.string().optional().default("Friendly"),
    milestoneType: z.string().optional().default("Weekly"),
    motivationPreference: z.string().optional().default("Encouraging"),
    checkInStyle: z.string().optional().default("Daily"),
    telegramReminder: z.boolean().or(z.string().transform(val => val === "Yes")).optional().default(false),
    rewardStyle: z.string().optional().default("Achievement badges"),
    rewardFrequency: z.string().optional().default("Weekly")
});
/**
 * Generates a study plan using the OpenAI API
 * @param input The user's study plan preferences
 * @returns A detailed, structured study plan
 */
export const generateStudyPlan = async (userId:string,input: StudyPlanInput): Promise<GeneratedStudyPlan> => {
  try {
    // Validate the input
    const validatedInput = studyPlanInputSchema.parse(input);
    
    // Format subjects as array if string
    const subjects = Array.isArray(validatedInput.subjects) 
      ? validatedInput.subjects 
      : [validatedInput.subjects];
    
    // Format days available as array if string
    const daysAvailable = Array.isArray(validatedInput.daysAvailable) 
      ? validatedInput.daysAvailable 
      : validatedInput.daysAvailable.split('/');
    
    // Create a standardized prompt for the AI
    const prompt = createStudyPlanPrompt({
      ...validatedInput,
      subjects,
      daysAvailable
    });

    // Call OpenAI API
    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional education consultant specialized in creating detailed, personalized study plans. You create structured, practical study schedules that help students achieve their academic goals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse and return the AI-generated study plan
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("Failed to generate study plan");
    }

    const generatedPlan = JSON.parse(response) as GeneratedStudyPlan;
    const studyPlan=await saveStudyPlan(userId, generatedPlan);
    await createMilestone(userId,studyPlan.id, generatedPlan.milestones);

    for (const dailySchedule of generatedPlan.schedule) {
        await createStudySession(userId,studyPlan.id, dailySchedule);
    }


    return generatedPlan;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error(`Failed to generate study plan: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Creates a detailed prompt for the OpenAI API based on user inputs
 */
// new generated prompt
const createStudyPlanPrompt = (input: StudyPlanInput): string => {
    return `
  Create a detailed study plan with the following parameters:
  
  ## Study Plan Overview
  - Name: ${input.name}
  - Subject(s): ${Array.isArray(input.subjects) ? input.subjects.join(", ") : input.subjects}
  - Duration: ${input.startDate} to ${input.endDate} 
  - Daily Study Time: ${input.dailyStudyTime}
  - Available Days: ${Array.isArray(input.daysAvailable) ? input.daysAvailable.join(", ") : input.daysAvailable}
  - Priority: ${input.priorityTag}
  - Difficulty Level: ${input.difficultyLevel}
  - Study Level: ${input.studyLevel}
  
  ## Study Preferences
  - Preferred Study Method: ${input.preferredStudyMethod}
  - Learning Style: ${input.learningStyle}
  - Daily Study Duration: ${input.dailyStudyDuration}
  - Break Duration: ${input.breakDuration}
  - Preferred Tone: ${input.preferredTone}
  
  ## Milestones & Motivation
  - Milestone Type: ${input.milestoneType}
  - Motivation Style: ${input.motivationPreference}
  - Check-in Style: ${input.checkInStyle}
  - Reward Style: ${input.rewardStyle}
  - Reward Frequency: ${input.rewardFrequency}
  
  Please create a detailed, structured JSON response with the following format:
  {
    "overview": {
      "name": "Study plan name",
      "subjects": ["subject1", "subject2"],
      "duration": "start to end",
      "totalDuration": number, // this is the total duration in of the study sessions in seconds
      "difficulty": "level"
    },
    "schedule": [
      {
        "date": "YYYY-MM-DD",
        "dayOfWeek": "Monday",
        "sessions": [
          {   
            "date": "YYYY-MM-DDTHH:mm:ss.sssZ",
            "topic": "specific topic",
            "startTime": "YYYY-MM-DDTHH:mm:ss.sssZ",
            "endTime": "YYYY-MM-DDTHH:mm:ss.sssZ",
            "description": "detailed description of what to study",
            "resources": ["optional resources"]
          }
        ]
      }
    ],
    "milestones": [
      {
        "targetDate": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "description": "milestone description",
        "completed": false
      }
    ],
    "tips": [
      "Study tip 1",
      "Study tip 2"
    ],
    "rewards": [
      {
        "milestone": "milestone description",
        "reward": "reward description"
      }
    ]
  }
  
  Make sure the schedule accounts for the specified days available and daily durations. The plan should be comprehensive, realistic, and tailored to the subject and difficulty level.
  Ensure that the study sessions generated strictly last for the daily study duration as indicated by the user, note that daily study duration can be in hours or minutes,
  if the user specifies a daily study duration of 2h, the study sessions should be divided into 2 hours.If the user specifies a daily study duration of 1m, the study sessions should be divided into 1 minutes each.
  IMPORTANT: Please include at least 3 meaningful milestones strategically placed throughout the study duration to track progress. These milestones should represent significant achievements or checkpoints (beginning, middle, and end) that align with the student's learning journey. Each milestone should have a clear, achievable objective with a specific target date.
  `;
};


/**
 * Saves a generated study plan to the database
 */
export const saveStudyPlan = async (userId: string, plan: GeneratedStudyPlan) => {
  try {
    // Format the plan data for database storage
    const studyPlanData = {
      name: plan.overview.name,
      subjects: plan.overview.subjects,
      startDate: new Date(plan.schedule[0].date),
      endDate: new Date(plan.schedule[plan.schedule.length - 1].date),
      totalDuration: plan.overview.totalDuration,
      difficultyLevel: plan.overview.difficulty,
      planData: plan, // Store the full JSON plan
      status: "active"
    };

    // Save to database
    const savedPlan = await studyPlanModel.createStudyPlan(userId, studyPlanData);
    return savedPlan;
  } catch (error) {
    console.error("Error saving study plan:", error);
    throw new Error(`Failed to save study plan: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Retrieves all study plans for a user
 */
export const getUserStudyPlans = async (userId: string) => {
  try {
    const studyPlans = await studyPlanModel.getStudyPlansByUserId(userId);
    
    // Map through study plans and add percentage
    const studyPlansWithPercentage = await Promise.all(studyPlans.map(async (plan) => {
      // Get milestones for this study plan
      const milestones = await studyPlanModel.getMilestonesByStudyPlanId(plan.id);
      
      // Calculate average percentage from milestones
      const percentage = milestones.length 
        ? milestones.reduce((sum, milestone) => sum + (milestone.percentage || 0), 0) / milestones.length
        : 0;

      // Return plan with percentage rounded to 2 decimal places
      return {
        ...plan,
        percentage: Math.round(percentage * 100) / 100
      };
    }));

    return studyPlansWithPercentage;
  } catch (error) {
    console.error("Error retrieving study plans:", error);
    throw new Error(`Failed to retrieve study plans: ${error instanceof Error ? error.message : String(error)}`);
  }
};


// get all study plans of a user
export const getStudyPlans = async (userId: string) => {
  try {
    const studyPlans = await studyPlanModel.getStudyPlansByUserId(userId);
    
    // Map through study plans and add percentage
    const studyPlansWithPercentage = await Promise.all(studyPlans.map(async (plan) => {
      // Get milestones for this study plan
      const milestones = await studyPlanModel.getMilestonesByStudyPlanId(plan.id);
      
      // Calculate average percentage from milestones
      const percentage = milestones.length 
        ? milestones.reduce((sum, milestone) => sum + (milestone.percentage || 0), 0) / milestones.length
        : 0;

      // Return plan with percentage rounded to 2 decimal places
      return {
        ...plan,
        percentage: Math.round(percentage * 100) / 100
      };
    }));

    return studyPlansWithPercentage;
  } catch (error) {
    console.error("Error retrieving study plans:", error);
    throw new Error(`Failed to retrieve study plans: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Retrieves a single study plan by ID
 */
export const getStudyPlan = async (planId: string) => {
  try {
    return await studyPlanModel.getStudyPlanById(planId);
  } catch (error) {
    console.error("Error retrieving study plan:", error);
    throw new Error(`Failed to retrieve study plan: ${error instanceof Error ? error.message : String(error)}`);
  }
};


// update a study plan status
export const updateStudyPlanStatus = async (planId: string, status: string) => {
    try {
        const updatedPlan = await studyPlanModel.updateStudyPlanStatus(planId, status);
        return updatedPlan;
    }
    catch (error) {
        console.error("Error updating study plan status:", error);
        throw new Error(`Failed to update study plan status: ${error instanceof Error ? error.message : String(error)}`);
    }
};

// delete a study plan
export const deleteStudyPlan = async (planId: string) => {
  try {
    await studyPlanModel.deleteStudyPlan(planId);
    return { message: "Study plan deleted successfully" };
  } catch (error) {
    console.error("Error deleting study plan:", error);
    throw new Error(`Failed to delete study plan: ${error instanceof Error ? error.message : String(error)}`);
  }
};


// create a milestone
export const createMilestone = async (userId: string, studyPlanId: string, milestones: any) => {
  try {
    const studyPlan = await studyPlanModel.createMilestonesFromPlan(userId, studyPlanId, milestones);
    return studyPlan;
  } catch (error) {
    console.error("Error creating milestone:", error);
    throw new Error(`Failed to create milestone: ${error instanceof Error ? error.message : String(error)}`);
  }
};
  
// create a study session
export const createStudySession = async (userId: string, studyPlanId: string, dailySchedule: any) => {
    try {
      // Extract the sessions array from the daily schedule object
      const sessions = dailySchedule.sessions;
      
      // Add defensive check
      if (!sessions) {
        console.warn("No sessions found in daily schedule:", dailySchedule);
        return;
      }
      
      if (!Array.isArray(sessions)) {
        console.warn("Sessions is not an array:", sessions);
        return;
      }
      
      // Now pass the actual sessions array to createStudySessionsFromPlan
      const studyPlan = await studyPlanModel.createStudySessionsFromPlan(userId, studyPlanId, sessions);
      return studyPlan;
    } catch (error) {
      console.error("Error creating study session:", error);
      throw new Error(`Failed to create study session: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

// get milestons by study plan id
export const getMilestonesByStudyPlanId = async (studyPlanId: string) => {
    try {
        return await studyPlanModel.getMilestonesByStudyPlanId(studyPlanId);
    } catch (error) {
        console.error("Error retrieving milestones:", error);
        throw new Error(`Failed to retrieve milestones: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// get study sessions by study plan id
export const getStudySessionsByStudyPlanId = async (studyPlanId: string) => {
    try {
        return await studyPlanModel.getStudySessionsByStudyPlanId(studyPlanId);
    } catch (error) {
        console.error("Error retrieving study sessions:", error);
        throw new Error(`Failed to retrieve study sessions: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// send email when a study plan is created
export const sendStudyPlanEmail = async (userId:string,studyPlan: string) => {

    // Fetch user details from the database
    const user = await getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    try {
        await sendStudyPlanCreatedEmail(user.email,user.firstName,studyPlan);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// the function send email when a study session is completed
export const sendStudySessionEmail = async (userId:string,studySession: string) => {
    // Fetch user details from the database
    const user = await getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    try {
        await sendStudySessionCompeted (user.email,studySession);
    }catch (error) {
    console.error("Error send email:", error);
    throw new Error(`failed sending email: ${error instanceof Error ? error.message : String(error)}`);
    };
  }


// confirm study plan study session was completed
export const confirmStudySession = async (planId:string,timeSpent:number,sessionId: string) => {
  try{
    const studySession = await studyPlanModel.getStudySessionById(sessionId);
    if (!studySession) {
      throw new BadRequestError("Study session not found");
    }
    if (studySession.completed) {
      throw new BadRequestError("Study session already completed");
    }
    if (timeSpent < studySession.duration) {
      throw new BadRequestError("Time spent is less than the session duration");
    }
    const updatedSession = await studyPlanModel.updateStudySessionStatusById(sessionId, true);

  // Get all study sessions for this study plan
  const allSessions = await studyPlanModel.getStudySessionsByStudyPlanId(planId);
  const totalSessions = allSessions.length;
  const completedSessions = allSessions.filter(session => session.completed).length;
  const completionPercentage = (completedSessions / totalSessions) * 100;

  // Get all milestones for this study plan
  const milestones = await studyPlanModel.getMilestonesByStudyPlanId(planId);
  const totalMilestones = milestones.length;

  // Update milestone percentages based on completed sessions
  for (let i = 0; i < totalMilestones; i++) {
    const milestone = milestones[i];
    let milestonePercentage = 0;
    let shouldComplete = false;

    if (i === 0 && completionPercentage >= 33) {
      milestonePercentage = 100;
      shouldComplete = true;
    } else if (i === 1 && completionPercentage >= 66) {
      milestonePercentage = 100;
      shouldComplete = true;
    } else if (i === 2 && completionPercentage === 100) {
      milestonePercentage = 100;
      shouldComplete = true;
    } else {
      milestonePercentage = Math.min(100, Math.max(0, completionPercentage - (i * 33)));
    }

    await studyPlanModel.updateMilestonePercentageById(milestone.id, milestonePercentage);
    if (shouldComplete) {
      await studyPlanModel.updateMilestoneStatusById(milestone.id, true);
    }
  }

    return updatedSession;
  } catch (error) {
    console.error("Error confirming study session:", error);
    if (error instanceof BadRequestError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new BadRequestError(`Failed to confirm study session: ${error instanceof Error ? error.message : String(error)}`);
  };
}


// get study session by id
export const getStudySessionById = async (sessionId: string) => {
  try {
    const studySession = await studyPlanModel.getStudySessionById(sessionId);
    if (!studySession) {
      throw new BadRequestError("Study session not found");
    }
    return studySession;
  } catch (error) {
    console.error("Error retrieving study session:", error);
    throw new Error(`Failed to retrieve study session: ${error instanceof Error ? error.message : String(error)}`);
  }
}


// get milestone by id
export const getMilestoneById = async (milestoneId: string) => {
  try {
    const milestone = await studyPlanModel.getMilestoneById(milestoneId);
    if (!milestone) {
      throw new BadRequestError("Milestone not found");
    }
    return milestone;
  } catch (error) {
    console.error("Error retrieving milestone:", error);
    throw new Error(`Failed to retrieve milestone: ${error instanceof Error ? error.message : String(error)}`);
  }
}