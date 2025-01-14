import mongoose from "mongoose";


const geminiResumeSchema = new mongoose.Schema({
  applicationId: {type: mongoose.Schema.Types.ObjectId, required: true},
  rating: { type: Number, required: true },
  shortExplanation: { type: String, required: true },
  fullExplanation: {
    skillsMatch: {
      score: { type: Number, required: true },
      details: {
        strengths: { type: String, required: true },
        missedSkills: { type: [String], required: true }
      }
    },
    experience: {
      score: { type: Number, required: true },
      details: {
        internshipExperience: { type: String, required: true },
        technologiesUsed: { type: [String], required: true }
      }
    },
    education: {
      score: { type: Number, required: true },
      details: {
        degree: { type: String, required: true },
        additionalAchievement: { type: String, required: true }
      }
    },
    certificationsAndProjects: {
      score: { type: Number, required: true },
      details: {
        certifications: { type: String, required: true },
        projectRelevance: { type: String, required: true }
      }
    },
    jobRoleCompatibility: {
      score: { type: Number, required: true },
      details: {
        internshipRoleCompatibility: { type: String, required: true },
        experienceGap: { type: String, required: true }
      }
    }
  }
})


export const GeminiResumeModel = mongoose.model("Gemini_Resume_Prompt", geminiResumeSchema);
