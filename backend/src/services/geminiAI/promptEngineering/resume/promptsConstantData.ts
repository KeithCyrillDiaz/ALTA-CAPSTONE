
export interface ResumePromptTypes {
    rating: number;
    shortExplanation: string;
    "Full Explanation": {
      skillsMatch: {
        score: number;
        details: {
          strengths: string;
          missedSkills: string[];
        };
      };
      "Experience": {
        score: number;
        details: {
          internshipExperience: string;
          technologiesUsed: string[];
        };
      };
      "Education": {
        score: number;
        details: {
          degree: string;
          additionalAchievement: string;
        };
      };
      "Certifications & Projects": {
        score: number;
        details: {
          certifications: string;
          projectRelevance: string;
        };
      };
      "Job Role Compatibility": {
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
        "Full Explanation": {
            "skillsMatch": {
                "score": "Number",
                "details": {
                    "strengths": "String",
                    "missedSkills": ["String"]
                }
            },
            "Experience": {
                "score": "Number",
                "details": {
                    "internshipExperience": "String",
                    "technologiesUsed": ["String"]
                }
            },
            "Education": {
                "score": "Number",
                "details": {
                    "degree": "String",
                    "additionalAchievement": "String"
                }
            },
            "Certifications & Projects": {
                "score": "Number",
                "details": {
                    "certifications": "String",
                    "projectRelevance": "String"
                }
            },
            "Job Role Compatibility": {
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
        "Full Explanation": {
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
            "Experience": {
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
            "Education": {
                "score": 100,
                "details": {
                    "degree": "Bachelor of Science in Information System",
                    "additionalAchievement": "Graduated with a GPA of 1.567, Cum Laude, and President List academic reward."
                }
            },
            "Certifications & Projects": {
                "score": 70,
                "details": {
                    "certifications": "Certificate of Academic Excellence, DevFest Cloud, AI Powered Virtual Professionals Seminar",
                    "projectRelevance": "The candidate's capstone project, 'Kalinga App,' demonstrates their ability to develop a MERN stack application for breast milk donation management."
                }
            },
            "Job Role Compatibility": {
                "score": 85,
                "details": {
                    "internshipRoleCompatibility": "The candidate's internship responsibilities align well with the job requirements, including developing web applications using React and TypeScript, and collaborating with team members.",
                    "experienceGap": "The candidate does not have direct experience in micro frontend architecture, GraphQL, or automated testing, which are specific requirements for this role."
                }
            }
        }
    }

`