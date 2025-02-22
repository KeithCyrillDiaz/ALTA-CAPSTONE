import mongoose from "mongoose";


const geminiResumeSchema = new mongoose.Schema({
  applicationId: {type: mongoose.Schema.Types.ObjectId, required: true},
  rating: { type: Number, required: true },
  shortExplanation: { type: String, required: true },
  "Full Explanation": {
    skillsMatch: {
      score: { type: Number, required: true },
      details: {
        strengths: { type: [String], required: true },
        missedSkills: { type: [String], required: true }
      }
    },
    "Experience": {
      score: { type: Number, required: true },
      details: {
        internshipExperience: { type: String, required: true },
        technologiesUsed: { type: [String], required: true }
      }
    },
    "Education": {
      score: { type: Number, required: true },
      details: {
        degree: { type: String, required: true },
        additionalAchievement: { type: String, required: true }
      }
    },
    "Certifications & Projects": {
      score: { type: Number, required: true },
      details: {
        certifications: { type: String, required: true },
        projectRelevance: { type: String, required: true }
      }
    },
    "Job Role Compatibility": {
      score: { type: Number, required: true },
      details: {
        internshipRoleCompatibility: { type: String, required: true },
        experienceGap: { type: String, required: true }
      }
    }
  }
})

//CREATE INDEX FOR EFFICIENT AND MUCH FASTER QUERYING
geminiResumeSchema.index({ applicationId: 1 }); //1 FOR ASCENDING ORDER -1 FOR DESCENDING

export const GeminiResumeModel = mongoose.model("Gemini_Resume_Prompt", geminiResumeSchema);
