const pdf = require("pdf-parse");
const {generateInterviewReport,generateResumePdfForCandidate} = require("../services/ai.services");
const interviewModel = require("../models/interviewReport.model");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description This function generates an interview report for a candidate based on their resume, self-description, and the job description. It uses the pdf-parse library to extract text from the uploaded resume and then calls the generateInterviewReport service to create the report. Finally, it saves the report in the database and returns it in the response.
 */
async function generateReport(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body;
    const resumeData = await (new pdf.PDFParse(Uint8Array.from(req.file.buffer))).getText();

    const interviewReportByAI = await generateInterviewReport({
      resume:resumeData.text,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewModel.create({
      resume: resumeData.text,
      selfDescription,
      jobDescription,
      ...JSON.parse(interviewReportByAI),
      user: req.user._id
    })

    res.status(200).json({
      interviewReport
    });

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
}


/**
 * @description This function retrieves an interview report by its ID for the authenticated user.
 */
async function getReportById(req, res) {
  const { interviewId } = req.params;
  try {
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user._id });

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    res.status(200).json({
      message: "Interview report retrieved successfully",
      interviewReport
    });
  } catch (error) {
    console.error("Error retrieving report:", error);
    res.status(500).json({ error: "Failed to retrieve report" });
  }
}


/**
 * @description This function retrieves all interview reports for the authenticated user.
 */
async function getAllReports(req, res) {
  const interviewReports = await interviewReportModel.find({ user: req.user._id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps");

  
  res.status(200).json({
    message: "Interview reports retrieved successfully",
    interviewReports
  });
}


/**
 * @description This function generates a PDF for a specific interview report.
 */
async function generateResumePdf(req, res) {
  const { interviewId } = req.params;
  
  const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user._id });
  
  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found" });
  }

  const { resume, selfDescription, jobDescription } = interviewReport;
  
  const pdfBuffer = await generateResumePdfForCandidate({ resumeText: resume, selfDescription, jobDescription });
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`,
  });
  res.send(pdfBuffer);
} 

module.exports = {
  generateReport,
  getReportById,
  getAllReports,
  generateResumePdf
};
