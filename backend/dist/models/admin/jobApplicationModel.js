"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobApplicationSchema = new mongoose_1.default.Schema({
    jobTitle: { type: String, required: true },
    jobId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'jobs', required: true },
    applicantId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Application', required: true },
}, { timestamps: true });
exports.JobApplicationModel = mongoose_1.default.model("JobApplication", jobApplicationSchema);
//# sourceMappingURL=jobApplicationModel.js.map