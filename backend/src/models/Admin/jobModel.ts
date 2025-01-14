

import mongoose from "mongoose";

//This is for data structure for mognodb


const jobDescriptionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    paragraph: {type: String},
    isBullet: {type: Boolean, required: true},
    bulletData: [{type: String}],
})

const jobSchema = new mongoose.Schema ({
    jobTitle: {type: String, required: true},
    jobDescription: [jobDescriptionSchema], //embedded JobDescription objects in array
    skills: [{type: String, required: true}],
    education:  [{type: String, required: true}],
    isSalaryRange: {type: Boolean, required: true},
    minSalary: {type: Number, required: true},
    maxSalary: {type: Number, required: true},
    salaryType: {type: String, required: true},
    employmentType: {type: String, required: true},
    shift: {type: String, required: true},
    schedule: {type: String, required: true},
    
    month: {type: String, required: true},
    year: {type: Number, required: true},
}, {timestamps: true});



export const JobModel = mongoose.model('jobs', jobSchema);
