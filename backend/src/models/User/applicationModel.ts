import mongoose from "mongoose";

//This is for data structure for mognodb

const applicationSchema = new mongoose.Schema ({

    // Personal Information
    givenName: {type: String, required: true},
    lastName: {type: String, required: true},
    birhtDay: {type: Date, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    currentCity: {type: String, required: true},
    expectedSalary: {type: Number, required: true},
    coverLetterURL: {type: String, required: true},
    resumeURL: {type: String, required: true},
    
    // Previous Company Details
    jobTitle: {type: String, required: true},
    company: {type: String, required: true},
    workOnsite: {type: Boolean, required: true},

    //others
    employmentStatus: {type: String, required: true},
    resumeAccuracy: {type: Number, required: true}, //percentage result based on accuracy of resume in Job Decription from AI

    //TimeStamp for filter
    month: {type: String, required: true},
    year: {type: Number, required: true},

}, {timestamps: true})


export const ApplicationModel = mongoose.model('Applicaiton', applicationSchema);
