import mongoose from "mongoose";

//This is for data structure for mognodb

const applicationSchema = new mongoose.Schema ({

    // Personal Information
    givenName: {type: String, required: true},
    lastName: {type: String, required: true},
    birthday: {type: Date, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    currentCity: {type: String, required: true},
    expectedSalary: {type: Number, required: true},
    coverLetterGdriveID: {type: String},
    resumeGdriveID: {type: String, required: true},

    //FOR GEMINI PROMPTING
    resumeString: {type: String, required: true},
    jobId: {type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true},
    
    // Previous Company Details
    jobTitle: {type: String, required: true},
    company: {type: String, required: true},
    workOnsite: {type: Boolean, required: true},

    //others
    employmentStatus: {type: String, default: "Pending"},

    //GEMINI CONTENTS
    resumeAccuracy: {type: Number, required: true}, //percentage result based on accuracy of resume in Job Decription from AI
    geminiResponseId: {type: mongoose.Schema.Types.ObjectId, required: true},
  
    //TimeStamp for filter
    month: {type: String, required: true},
    year: {type: Number, required: true},

    
}, {timestamps: true})

//THIS IS NEED FOR BETTER PERFORMANCE IN QUERRYING FOR TOP DATA
applicationSchema.index({month: 1, year: 1})

export const ApplicationModel = mongoose.model('Application', applicationSchema);
