"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//This is for data structure for mognodb
const jobDescriptionSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    paragraph: { type: String },
    isBullet: { type: Boolean, required: true },
    bulletData: [{ type: String }],
});
const jobSchema = new mongoose_1.default.Schema({
    jobTitle: { type: String, required: true },
    jobDescription: [jobDescriptionSchema], //embedded JobDescription objects in array
    skills: [{ type: String, required: true }],
    education: [{ type: String, required: true }],
    isSalaryRange: { type: Boolean, required: true },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    salaryType: { type: String, required: true },
    employmentType: { type: String, required: true },
    shift: { type: String, required: true },
    schedule: { type: String, required: true },
    status: { type: String, default: 'Open' },
    month: { type: String, required: true },
    year: { type: Number, required: true },
}, { timestamps: true });
jobSchema.index({ status: 1 });
exports.JobModel = mongoose_1.default.model('jobs', jobSchema);
//# sourceMappingURL=jobModel.js.map