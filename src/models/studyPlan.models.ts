import prisma from "../database/db";
import { GeneratedStudyPlan, StudyPlanCreate } from "../interfaces/study-plan.interfaces";


/**
 * Create a new study plan in the database
 */
export const createStudyPlan = async (userId: string, data: {
  name: string;
  subjects: string[];
  startDate: Date;
  endDate: Date;
  totalDuration: number;
  difficultyLevel: string;
  planData: GeneratedStudyPlan;
  status: string;
}): Promise<StudyPlanCreate> => {
  const createdPlan = await prisma.studyPlan.create({
    data: {
      userId,
      name: data.name,
      subjects: data.subjects,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDuration: data.totalDuration,
      difficultyLevel: data.difficultyLevel,
      planData: data.planData as any, // JSON type in Prisma
      status: data.status,
    }
  });

  return {
    ...createdPlan,
    planData: createdPlan.planData as unknown as GeneratedStudyPlan,
    status: createdPlan.status as "active" | "completed" | "archived",
    totalDuration: createdPlan.totalDuration || 0
  };
};

/**
 * Get a study plan by ID
 */
export const getStudyPlanById = async (id: string): Promise<StudyPlanCreate | null> => {
  const studyPlan = await prisma.studyPlan.findUnique({
    where: { id }
  });

  if (!studyPlan) return null;

  return {
    ...studyPlan,
    planData: studyPlan.planData as unknown as GeneratedStudyPlan,
    status: studyPlan.status as "active" | "completed" | "archived",
    totalDuration: studyPlan.totalDuration || 0
  };
};

/**
 * Get all study plans for a specific user
 */
export const getStudyPlansByUserId = async (userId: string): Promise<StudyPlanCreate[]> => {
  const studyPlans = await prisma.studyPlan.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return studyPlans.map(plan => ({
    ...plan,
    planData: plan.planData as unknown as GeneratedStudyPlan,
    status: plan.status as "active" | "completed" | "archived",
    totalDuration: plan.totalDuration || 0
  }));
};

/**
 * Update a study plan's status
 */
export const updateStudyPlanStatus = async (id: string, status: string): Promise<StudyPlanCreate> => {
  const updatedPlan = await prisma.studyPlan.update({
    where: { id },
    data: { status }
  });

  return {
    ...updatedPlan,
    planData: updatedPlan.planData as unknown as GeneratedStudyPlan,
    status: updatedPlan.status as "active" | "completed" | "archived",
    totalDuration: updatedPlan.totalDuration || 0
  };
};


/**
 * Delete a study plan
 */
export const deleteStudyPlan = async (id: string): Promise<void> => {
  await prisma.studyPlan.delete({
    where: { id }
  });
};

/**
 * Create study sessions from a study plan
 */
export const createStudySessionsFromPlan = async (
  userId: string, 
  studyPlanId: string, 
  sessions: Array<{
    date: string | Date;
    startTime: string | Date;
    endTime: string | Date;
    topic: string;
    description?: string;
  }>
): Promise<void> => {
  // Ensure sessions is an array
  if (!Array.isArray(sessions)) {
    console.error("Sessions is not an array:", sessions);
    throw new Error("Sessions must be an array");
  }
  
  // Create all sessions in a transaction
  await prisma.$transaction(
    sessions.map(session => {
      try {
        // Validate that all required fields exist
        if (!session.date || !session.startTime || !session.endTime || !session.topic) {
          console.error("Invalid session data:", session);
          throw new Error("Session is missing required fields");
        }
        
        // Convert string dates to Date objects
        const dateObj = session.date instanceof Date ? session.date : new Date(session.date);
        const startTimeObj = session.startTime instanceof Date ? session.startTime : new Date(session.startTime);
        const endTimeObj = session.endTime instanceof Date ? session.endTime : new Date(session.endTime);
        
        // Check if dates are valid
        if (isNaN(dateObj.getTime()) || isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())) {
          console.error("Invalid date in session:", session);
          throw new Error("Session contains invalid date");
        }
        
        // Calculate duration
        const durationSeconds = Math.floor((endTimeObj.getTime() - startTimeObj.getTime()) / 1000);
        
        // Ensure duration is positive
        if (durationSeconds <= 0) {
          console.warn("Session has zero or negative duration:", session);
          // You could either throw an error or set a minimum duration
          // throw new Error("Session duration must be positive");
          // Or set a minimum duration:
          const minimumDuration = 60; // 60 seconds (1 minute)
          
          return prisma.studySession.create({
            data: {
              userId,
              studyPlanId,
              date: dateObj,
              startTime: startTimeObj,
              endTime: endTimeObj,
              topic: session.topic,
              notes: session.description || null,
              duration: minimumDuration,
              completed: false
            }
          });
        }
        
        return prisma.studySession.create({
          data: {
            userId,
            studyPlanId,
            date: dateObj,
            startTime: startTimeObj,
            endTime: endTimeObj,
            topic: session.topic,
            notes: session.description || null,
            duration: durationSeconds,
            completed: false
          }
        });
      } catch (error) {
        console.error("Error processing session:", error, session);
        // Skip this session or handle the error as appropriate
        // For a transaction, you might want to throw the error
        throw error;
      }
    })
  );
};
/**
 * Create milestones from a study plan
 */
export const createMilestonesFromPlan = async (
  userId: string,
  studyPlanId: string,
  milestones: Array<{
    description: string;
    targetDate: string;  // Date in YYYY-MM-DD format
  }>
): Promise<void> => {
  // Create all milestones in a transaction
  await prisma.$transaction(
    milestones.map(milestone =>
      prisma.milestone.create({
        data: {
          userId,
          studyPlanId,
          description: milestone.description,
          targetDate: milestone.targetDate,
          completed: false
        }
      })
    )
  );
};

// get a milestone by study plan id
export const getMilestonesByStudyPlanId = async (studyPlanId: string): Promise<any[]> => {
  const milestones = await prisma.milestone.findMany({
    where: { studyPlanId },
    orderBy: { targetDate: 'asc' }
  });

  return milestones.map(milestone => ({
    ...milestone,
    targetDate: milestone.targetDate.toISOString().split('T')[0] // Format to YYYY-MM-DD
  }));
}


// get a study session by study plan id
export const getStudySessionsByStudyPlanId = async (studyPlanId: string): Promise<any[]> => {
  const studySessions = await prisma.studySession.findMany({
    where: { studyPlanId },
    orderBy: { date: 'asc' }
  });

  return studySessions.map(session => ({
    ...session,
    date: session.date.toISOString().split('T')[0], // Format to YYYY-MM-DD
    startTime: session.startTime?.toISOString().split('T')[1].slice(0, 5) || '', // Format to HH:mm
    endTime: session.endTime?.toISOString().split('T')[1].slice(0, 5) || '' // Format to HH:mm
  }));
}

// get a study session by id
export const getStudySessionById = async (id: string): Promise<any | null> => {
  const studySession = await prisma.studySession.findUnique({
    where: { id }
  });

  if (!studySession) return null;

  return {
    ...studySession,
    date: studySession.date.toISOString().split('T')[0], // Format to YYYY-MM-DD
    startTime: studySession.startTime?.toISOString().split('T')[1].slice(0, 5) || '', // Format to HH:mm
    endTime: studySession.endTime?.toISOString().split('T')[1].slice(0, 5) || '' // Format to HH:mm
  };
}

// update a study session by id
export const updateStudySessionById = async (id: string, data: {
  date: string | Date;
  startTime: string | Date;
  endTime: string | Date;
  topic: string;
  description?: string;
}): Promise<any> => { 
  const updatedSession = await prisma.studySession.update({
    where: { id },
    data: {
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      topic: data.topic,
      notes: data.description || null
    }
  });

  return {
    ...updatedSession,
    date: updatedSession.date.toISOString().split('T')[0], // Format to YYYY-MM-DD
    startTime: updatedSession.startTime?.toISOString().split('T')[1].slice(0, 5) || '', // Format to HH:mm
    endTime: updatedSession.endTime?.toISOString().split('T')[1].slice(0, 5) || '' // Format to HH:mm
  };
}


// update study session status by id
export const updateStudySessionStatusById = async (id: string, completed: boolean): Promise<any> => {
  const updatedSession = await prisma.studySession.update({
    where: { id },
    data: {
      completed: completed
    }
  });

  return {
    ...updatedSession,
    date: updatedSession.date.toISOString().split('T')[0], // Format to YYYY-MM-DD
    startTime: updatedSession.startTime?.toISOString().split('T')[1].slice(0, 5) || '', // Format to HH:mm
    endTime: updatedSession.endTime?.toISOString().split('T')[1].slice(0, 5) || '' // Format to HH:mm
  };
}

// update milestone percentage by id
export const updateMilestonePercentageById = async (id: string, percentage: number): Promise<any> => {
  const updatedMilestone = await prisma.milestone.update({
    where: { id },
    data: {
      percentage: percentage,
    }
  });

  return {
    ...updatedMilestone,
    targetDate: updatedMilestone.targetDate.toISOString().split('T')[0] // Format to YYYY-MM-DD
  };
}


// get milestone by id
export const getMilestoneById = async (id: string): Promise<any | null> => {
  const milestone = await prisma.milestone.findUnique({
    where: { id }
  });

  if (!milestone) return null;

  return {
    ...milestone,
    targetDate: milestone.targetDate.toISOString().split('T')[0] // Format to YYYY-MM-DD
  };
}

// update a milestone completed status by id
export const updateMilestoneStatusById = async (id: string, completed: boolean): Promise<any> => {
  const updatedMilestone = await prisma.milestone.update({
    where: { id },
    data: {
      completed: completed
    }
  });

  return {
    ...updatedMilestone,
    targetDate: updatedMilestone.targetDate.toISOString().split('T')[0] // Format to YYYY-MM-DD
  };
}
