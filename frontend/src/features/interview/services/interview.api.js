import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/interview",
  withCredentials: true,
})


export const getInterviewReport = async ({ jobDescription, selfDescription, resume }) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resume);

  const response = await api.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}


export const getInterviewReportById = async (interviewId) => { 
  const response = await api.get(`/report/${interviewId}`);
  return response.data;
}

export const getAllInterviewReports = async () => {
  const response = await api.get("/");
  return response.data;
}

export const generateInterviewReportPdf = async (interviewId) => {
  const response = await api.post(`/report/${interviewId}/pdf`, null, {
    responseType: "blob",
  });
  return response.data;
}