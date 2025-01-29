"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const applicationSchema = new mongoose_1.default.Schema({
    // Personal Information
    givenName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthday: { type: Date, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    currentCity: { type: String, required: true },
    expectedSalary: { type: Number, required: true },
    coverLetterGdriveID: { type: String },
    resumeGdriveID: { type: String, required: true },
    //FOR GEMINI PROMPTING
    resumeString: { type: String, required: true },
    jobId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'jobs', required: true },
    position: { type: String, required: true },
    // Previous Company Details
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    workOnsite: { type: Boolean, required: true },
    //others
    employmentStatus: { type: String, default: "Pending" },
    //GEMINI CONTENTS
    resumeAccuracy: { type: Number, required: true }, //percentage result based on accuracy of resume in Job Decription from AI
    geminiResponseId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    //TimeStamp for filter
    month: { type: String, required: true },
    year: { type: Number, required: true },
    expiresAt: { type: Date }
}, { timestamps: true, expireAfterSeconds: 0, });
//Create a TTL index on the expiresAt field to automatically delete the document after expiresAt time
applicationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//THIS IS NEED FOR BETTER PERFORMANCE IN QUERRYING FOR TOP DATA
applicationSchema.index({ month: 1, year: 1, position: 1 });
exports.ApplicationModel = mongoose_1.default.model('Application', applicationSchema);
//# sourceMappingURL=applicationModel.js.map