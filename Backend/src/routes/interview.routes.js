const express = require("express");
const { authUser } = require("../middleware/auth.middleware"); 



const interviewRouter = express.Router();


/**
 * @route POST
 * @description This route generates an interview report for a candidate based on their resume, self-description, and the job description.
 * @access Private (only authenticated users can access this route)
 */


module.exports = interviewRouter;