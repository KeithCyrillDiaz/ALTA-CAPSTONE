
export interface ResumePromptTypes {
    rating: number;
    shortExplanation: string;
    fullExplanation: {
      skillsMatch: {
        score: number;
        details: {
          strengths: string;
          missedSkills: string[];
        };
      };
      experience: {
        score: number;
        details: {
          internshipExperience: string;
          technologiesUsed: string[];
        };
      };
      education: {
        score: number;
        details: {
          degree: string;
          additionalAchievement: string;
        };
      };
      certificationsAndProjects: {
        score: number;
        details: {
          certifications: string;
          projectRelevance: string;
        };
      };
      jobRoleCompatibility: {
        score: number;
        details: {
          internshipRoleCompatibility: string;
          experienceGap: string;
        };
      };
    };
  }
  


export const promptFormat = `
      
     {
        "rating": "Number",
        "shortExplanation": "String",
        "fullExplanation": {
            "skillsMatch": {
                "score": "Number",
                "details": {
                    "strengths": "String",
                    "missedSkills": ["String"]
                }
            },
            "experience": {
                "score": "Number",
                "details": {
                    "internshipExperience": "String",
                    "technologiesUsed": ["String"]
                }
            },
            "education": {
                "score": "Number",
                "details": {
                    "degree": "String",
                    "additionalAchievement": "String"
                }
            },
            "certificationsAndProjects": {
                "score": "Number",
                "details": {
                    "certifications": "String",
                    "projectRelevance": "String"
                }
            },
            "jobRoleCompatibility": {
                "score": "Number",
                "details": {
                    "internshipRoleCompatibility": "String",
                    "experienceGap": "String"
                }
            }
        }
    }


`


export const samplePrompt = `
    {
        "rating": 85,
        "shortExplanation": "The resume meets most of the requirements of the Front-end Developer position but lacks certain specific skills.",
        "fullExplanation": {
            "skillsMatch": {
                "score": 80,
                "details": {
                    "strengths": "The resume demonstrates proficiency in React, JavaScript, HTML, and CSS, which are essential skills for a Front-end Developer. Additionally, the candidate has experience with Node.js and Express, which are advantageous in the field.",
                    "missedSkills": [
                    "Single-SPA for micro frontend architecture",
                    "GraphQL (Apollo)",
                    "Cypress Testing Framework",
                    "Jest",
                    "Enzyme"
                    ]
                }
            },
            "experience": {
                "score": 75,
                "details": {
                    "internshipExperience": "The candidate has relevant internship experience in web development, utilizing React, TypeScript, and backend services.",
                    "technologiesUsed": [
                    "Node.js",
                    "Express",
                    "React",
                    "TypeScript",
                    "RESTful APIs"
                    ]
                }
            },
            "education": {
                "score": 100,
                "details": {
                    "degree": "Bachelor of Science in Information System",
                    "additionalAchievement": "Graduated with a GPA of 1.567, Cum Laude, and President List academic reward."
                }
            },
            "certificationsAndProjects": {
                "score": 70,
                "details": {
                    "certifications": "Certificate of Academic Excellence, DevFest Cloud, AI Powered Virtual Professionals Seminar",
                    "projectRelevance": "The candidate's capstone project, 'Kalinga App,' demonstrates their ability to develop a MERN stack application for breast milk donation management."
                }
            },
            "jobRoleCompatibility": {
                "score": 85,
                "details": {
                    "internshipRoleCompatibility": "The candidate's internship responsibilities align well with the job requirements, including developing web applications using React and TypeScript, and collaborating with team members.",
                    "experienceGap": "The candidate does not have direct experience in micro frontend architecture, GraphQL, or automated testing, which are specific requirements for this role."
                }
            }
        }
    }

`