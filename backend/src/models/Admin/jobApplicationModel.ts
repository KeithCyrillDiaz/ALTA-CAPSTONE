import mongoose from "mongoose";


const jobApplicationSchema = new mongoose.Schema({
    jobTitle: {type: String, required: true},
    jobId: {type: mongoose.Schema.Types.ObjectId, ref:'jobs', required: true},
    applicantId: {type: mongoose.Schema.Types.ObjectId, ref:'Application', required: true},
}, {timestamps: true});


export const JobApplicationModel = mongoose.model("JobApplication", jobApplicationSchema);
