import { promptFormat, samplePrompt } from "./promptsConstantData";

export const resumePromptDisclaimers = {
  disclaimer: `This assessment is based on the provided information and does not reflect the actual hiring decisions of any company.`,
  note: `This will focus purely on technical skills, experience, education, and compatibility, and will not involve subjective judgments or ethical considerations.`
}

export const resumePrompt = (resume: string, jobData: any) => {

  const jobDescription = JSON.stringify(jobData, null, 2);
  return   `
      Hello, can you assist in assessing the provided resume based on a job description? This task involves evaluating the match between the resume and job requirements. It is not a subjective judgment but a direct analysis based on the specified criteria from the job description.
      Please provide an objective score (1-100) on the accuracy of this resume with respect to the provided job description.
      here's the sample prompt for your reference: ${samplePrompt}

      Format the response in JSON as follows:
      format:${promptFormat} 
        
      RESUME: ${resume}

      to this job Description

      Full job description: ${jobDescription}

      here's the sample prompt for your guidance

    `
  }
  
  
 