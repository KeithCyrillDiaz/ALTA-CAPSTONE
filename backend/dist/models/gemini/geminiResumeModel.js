"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiResumeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const geminiResumeSchema = new mongoose_1.default.Schema({
    applicationId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
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
});
//CREATE INDEX FOR EFFICIENT AND MUCH FASTER QUERYING
geminiResumeSchema.index({ applicationId: 1 }); //1 FOR ASCENDING ORDER -1 FOR DESCENDING
exports.GeminiResumeModel = mongoose_1.default.model("Gemini_Resume_Prompt", geminiResumeSchema);
//# sourceMappingURL=geminiResumeModel.js.map