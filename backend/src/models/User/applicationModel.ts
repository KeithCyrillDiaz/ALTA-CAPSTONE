import mongoose from "mongoose";

//This is for data structure for mognodb
export interface IApplication extends mongoose.Document {
    // Personal Information
    givenName: string;
    lastName: string;
    birthday: Date;
    gender: string;
    email: string;
    phoneNumber: string;
    currentCity: string;
    expectedSalary: number;
    coverLetterGdriveID?: string;
    resumeGdriveID: string;

    // For Gemini Prompting
    resumeString: string;
    jobId: mongoose.Schema.Types.ObjectId;
    position: string;
    
    // Previous Company Details
    jobTitle: string;
    company: string;
    workOnsite: boolean;

    // Other fields
    employmentStatus: string;

    // Gemini Contents
    resumeAccuracy: number; // percentage result based on accuracy of resume in Job Description from AI
    geminiResponseId: mongoose.Schema.Types.ObjectId;

    // TimeStamp for filter
    month: string;
    year: number;

    // Expiry field for document expiration
    expiresAt?: Date;
    
    // Timestamps (createdAt and updatedAt) are included automatically due to `timestamps: true`
    createdAt?: Date;
    updatedAt?: Date;
}

const applicationSchema = new mongoose.Schema ({

    // Personal Information
    givenName: {type: String, required: true},
    lastName: {type: String, required: true},
    birthday: {type: Date, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    currentCity: {type: String, required: true},
    expectedSalary: {type: Number, required: true},
    coverLetterGdriveID: {type: String},
    resumeGdriveID: {type: String, required: true},

    //FOR GEMINI PROMPTING
    resumeString: {type: String, required: true},
    jobId: {type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true},
    position: {type: String, required: true},
    
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
    
    expiresAt: { type: Date }
    
}, {timestamps: true, expireAfterSeconds: 0,})

//Create a TTL index on the expiresAt field to automatically delete the document after expiresAt time
applicationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

//THIS IS NEED FOR BETTER PERFORMANCE IN QUERRYING FOR TOP DATA
applicationSchema.index({month: 1, year: 1, position: 1})

export const ApplicationModel = mongoose.model('Application', applicationSchema);
