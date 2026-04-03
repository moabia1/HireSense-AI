const { GoogleGenAI } = require("@google/genai");
const z = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score indicating how well the candidate matches the job requirements, on a scale of 0 to 100",
    ),

  
  jobDescription: z
    .string()
    .describe(
      "The job description for the position the candidate is applying for",
  ),
  

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question can be asked during the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take, etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with the intention behind asking those questions and how to answer them",
    ),

  
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question can be asked during the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take, etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with the intention behind asking those questions and how to answer them",
    ),

  
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking and needs to work on",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of the skill gap (low, medium, high)"),
      }),
    )
    .describe(
      "Skills that the candidate is lacking and needs to work on along with the severity of the gap (low, medium, high)",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .string()
          .describe(
            "The day of the preparation plan (e.g., Day 1, Day 2, etc.)",
          ),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan (e.g., Data Structures, System Design, etc.)",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be completed on that day to follow the preparation plan",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview",
    ),
});


const schema = zodToJsonSchema(interviewReportSchema, {
  target: "jsonSchema7",
  $refStrategy: "none", // 🔥 MOST IMPORTANT
});


async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  
  const prompt = `
You are an AI Interview Assistant.

Generate a structured interview report STRICTLY in JSON format.

Follow this schema exactly:
- matchScore (0-100 number)
- jobDescription (string)
- technicalQuestions (array of objects with question, intention, answer)
- behavioralQuestions (array of objects with question, intention, answer)
- skillGaps (array of objects with skill, severity: low | medium | high)
- preparationPlan (array of objects with day, focus, tasks)

DO NOT return anything except valid JSON.

Candidate Data:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  console.log(response.text)
}

module.exports = generateInterviewReport;
