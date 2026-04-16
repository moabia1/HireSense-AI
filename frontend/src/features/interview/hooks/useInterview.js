import { useContext } from "react";
import { getInterviewReport, getInterviewReportById, getAllInterviewReports } from "../services/interview.api";
import { InterviewContext } from "../interview.context";


export const useInterview = () => {
  
  const { loading, setLoading, report, setReport, reports, setReports } =
    useContext(InterviewContext);
  
  
  const generateReport = async ({ jobDescription, selfDescription, resume }) => {
    setLoading(true);
    let response = null;
    try {
      response = await getInterviewReport({ jobDescription, selfDescription, resume });
      setReport(response.interviewReport);
    } catch (error) {
      console.error("Error generating interview report:", error);
    } finally {
      setLoading(false);
    }
    return response.interviewReport;
  }

  const getReportById = async (interviewId) => {
    setLoading(true);
    let response = null;
    try {
      response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
    } catch (error) {
      console.log("Error fetching interview report by ID:", error);
    } finally {
      setLoading(false);
    }
    return response.interviewReport;
  }

  const getAllReports = async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (error) {
      console.log("Error fetching all interview reports:", error);
    } finally {
      setLoading(false);
    }
    return response.interviewReports;
  }

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getAllReports
  }
}