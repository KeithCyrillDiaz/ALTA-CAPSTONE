"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumePrompt = exports.resumePromptDisclaimers = void 0;
const promptsConstantData_1 = require("./promptsConstantData");
exports.resumePromptDisclaimers = {
    disclaimer: `This assessment is based on the provided information and does not reflect the actual hiring decisions of any company.`,
    note: `This will focus purely on technical skills, experience, education, and compatibility, and will not involve subjective judgments or ethical considerations.`
};
const resumePrompt = (resume, jobData) => {
    const jobDescription = JSON.stringify(jobData, null, 2);
    return `
      Hello, can you assist in assessing the provided resume based on a job description? This task involves evaluating the match between the resume and job requirements. It is not a subjective judgment but a direct analysis based on the specified criteria from the job description.
      Please provide an objective score (1-100) on the accuracy of this resume with respect to the provided job description.
      here's the sample prompt for your reference: ${promptsConstantData_1.samplePrompt}

      Strictly follow this Format just like the sample Format:
      format:${promptsConstantData_1.promptFormat} 
        
      RESUME: ${resume}

      to this job Description

      Full job description: ${jobDescription}

      here's the sample prompt for your guidance

    `;
};
exports.resumePrompt = resumePrompt;
//# sourceMappingURL=resumePrompts.js.map