const express = require("express");
const { authUser } = require("../middleware/auth.middleware");
const {
  generateReport,
  getReportById,
  getAllReports,
} = require("../controllers/interview.controller");
const upload = require("../middleware/storage");

const interviewRouter = express.Router();

/**
 * @route POST
 * @description This route generates an interview report for a candidate based on their resume, self-description, and the job description.
 * @access Private (only authenticated users can access this route)
 */
interviewRouter.post("/", authUser, upload.single("resume"), generateReport);

/**
 * @route GET /api/interview/report/:interviewId
 * @description This route retrieves the details of a specific interview report based on the provided interview ID.
 * @access Private (only authenticated users can access this route)
 */
interviewRouter.get("/report/:interviewId", authUser, getReportById);

/**
 * @route GET /api/interview/
 * @description This route retrieves all interview reports for the authenticated user, sorted by creation date in descending order. It excludes certain fields from the response for privacy and efficiency.
 * @access Private (only authenticated users can access this route)
 */
interviewRouter.get("/", authUser, getAllReports);

module.exports = interviewRouter;
