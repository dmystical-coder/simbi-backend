-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hasCompletedPreAssessment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preAssessmentCompletedAt" TIMESTAMP(3);
