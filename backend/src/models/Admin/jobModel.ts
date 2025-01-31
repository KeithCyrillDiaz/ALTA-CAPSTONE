

    import mongoose from "mongoose";

    // Define the schema interface for a single job description
    interface JobDescription {
        title: string;
        paragraph: string;
        isBullet: boolean;
        bulletData: string[];
    }
    
    // Define the schema interface for a Job document
    export interface JobDocument extends mongoose.Document {
        jobTitle: string;
        jobDescription: JobDescription[];
        skills: string[];
        education: string[];
        isSalaryRange: boolean;
        minSalary: number;
        maxSalary: number;
        salaryType: string;
        employmentType: string;
        shift: string;
        schedule: string;

        status: string;
        month: string;
        year: number;
        createdAt: Date;
        updatedAt: Date;
    }



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
        datePublished: {type: Date, default: new Date()},
        slot: {type: Number, default: 2},
        applicants: {type: Number, default: 0},
       
        workMode: {type: String, default: "Remote"},
        status: {type: String, default: 'Open'},
        month: {type: String, required: true},
        year: {type: Number, required: true},
    }, {timestamps: true});

    jobSchema.index({status: 1});

    export const JobModel = mongoose.model<JobDocument>('jobs', jobSchema);
