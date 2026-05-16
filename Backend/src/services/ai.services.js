const { GoogleGenAI } = require("@google/genai");
const z = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppet = require("puppeteer");

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
  title: z.string().describe("The title of the interview report, usually the job title"),
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
- title (string)
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

  return response.text;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppet.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4" , margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }});
  await browser.close();
  return pdfBuffer;
}

async function generateResumePdfForCandidate({ resumeText, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z.string().describe("The HTML content of the resume which can be converted to PDF using libraries like puppeteer"),
  })

  const prompt = `You are an expert resume writer and ATS optimization specialist.

Generate a PROFESSIONAL, ATS-FRIENDLY, ONE-PAGE resume in clean HTML format.

Candidate Data:
Self Description: ${selfDescription}
Job Description: ${jobDescription}  
Resume Text: ${resumeText}

HTML Requirements:
- Use inline CSS only (puppeteer compatible)
- Clean, minimal design with good typography
- Single page layout — everything must fit in A4 size
- Font: Arial or system-safe fonts only
- Color: mostly black/dark gray, one accent color max

Resume Structure (in this order):
1. Header — Name, Email, Phone, LinkedIn, GitHub (single line)
2. Professional Summary — 2-3 lines tailored to the JD with keywords
3. Technical Skills — grouped by category, only JD-relevant skills
4. Experience — reverse chronological, max 3 jobs, 3-4 bullets each
5. Projects — max 2-3 most relevant to JD, with tech stack
6. Education — degree, institution, year, GPA if good
7. Certifications — only if relevant

Writing Rules:
- Every bullet starts with strong action verb (Built, Engineered, Optimized, Reduced)
- Quantify achievements wherever possible (e.g. "Reduced load time by 40%")
- Mirror exact keywords from Job Description for ATS scoring
- Remove anything not relevant to this specific JD
- No tables, no columns (ATS parsers struggle with them)
- No images or icons

Return ONLY a JSON object: { "html": "<html content here>" }
DO NOT return anything outside the JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema)
    }
  })

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = {generateInterviewReport, generateResumePdfForCandidate};
