import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Sparkles, FileText, ArrowRight, Zap, CheckCircle } from "lucide-react";
import styles from "./Home.module.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const containerRef = useRef(null);

  const { loading, generateReport, reports,getAllReports } = useInterview();
  
  useEffect(() => {
    getAllReports();
  }, [])

  console.log(reports)


  // Track mouse for glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setResume(f);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) setResume(f);
  };

  const removeResume = () => setResume(null);

  const canGenerate = resume || selfDescription.trim().length > 0;
  const jobDescLength = jobDescription.length;
  const selfDescLength = selfDescription.length;

  const generateStrategy = useCallback(async () => {
    if (!canGenerate) return;
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resume,
    });
    navigate(`/interview/report/${data._id}`);
  }, [
    canGenerate,
    jobDescription,
    resume,
    selfDescription,
    generateReport,
    navigate,
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const blobVariants = {
    animate: {
      x: [0, 30, -30, 0],
      y: [0, -30, 30, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.main
      className={styles.home}
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Navbar />
      {/* Animated Background Elements */}
      <div className={styles.background} aria-hidden="true">
        <div
          className={styles.gradientOrb}
          style={{
            "--mouse-x": `${mousePosition.x}px`,
            "--mouse-y": `${mousePosition.y}px`,
          }}
        />

        <motion.div
          className={`${styles.blob} ${styles["blob--1"]}`}
          variants={blobVariants}
          animate="animate"
        />
        <motion.div
          className={`${styles.blob} ${styles["blob--2"]}`}
          variants={blobVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className={`${styles.blob} ${styles["blob--3"]}`}
          variants={blobVariants}
          animate="animate"
          transition={{ delay: 4 }}
        />

        {/* Grid overlay */}
        <div className={styles.gridOverlay} />
      </div>

      {/* Hero Section */}
      <motion.section className={styles.hero} variants={itemVariants}>
        <h2 className={styles.heroTitle}>
          Create Your
          <br />
          <span className={styles.gradientText}> Personalized </span> <br/>
          Interview Strategy
        </h2>
        <p className={styles.heroSubtitle}>
          Upload your resume, paste a job description, and let AI build a
          complete interview roadmap tailored to your skills.
        </p>
      </motion.section>

      {/* Main Card */}
      <motion.section
        className={styles.mainCard}
        variants={itemVariants}
        whileHover={{ y: -4 }}
      >
        {/* Loading state */}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <p>Generating your interview strategy...</p>
          </div>
        )}

        <div className={styles.cardContent}>
          {/* Left Column - Job Description */}
          <div className={styles.column} style={{ "--column-flex": "1" }}>
            <div className={styles.fieldGroup}>
              <div className={styles.fieldHeader}>
                <h3 className={styles.fieldTitle}>Target Job Description</h3>
                <span className={styles.required}>REQUIRED</span>
              </div>

              <textarea
                className={styles.textarea}
                maxLength={5000}
                placeholder="Senior Frontend Engineer at a fast-growing SaaS startup working with React, TypeScript, performance optimization, and design systems."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                spellCheck="true"
              />

              <div className={styles.charCounter}>
                <span>{jobDescLength}</span>
                <span className={styles.counterMax}>/ 5000</span>
              </div>

              {/* AI Tip Card */}
              <motion.div className={styles.tipCard} whileHover={{ x: 4 }}>
                <Sparkles size={16} />
                <span>
                  <strong>Pro tip:</strong> Include required skills,
                  responsibilities, and tech stack for better analysis.
                </span>
              </motion.div>
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* Right Column - Resume & Self Description */}
          <div className={styles.column} style={{ "--column-flex": "1" }}>
            {/* Upload Section */}
            <motion.div
              className={`${styles.uploadZone} ${
                dragActive ? styles["uploadZone--active"] : ""
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={onFileChange}
                hidden
                aria-label="Upload resume"
              />

              {!resume ? (
                <div className={styles.uploadContent}>
                  <motion.div
                    className={styles.uploadIcon}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Upload size={32} />
                  </motion.div>
                  <div className={styles.uploadLabel}>Upload Resume</div>
                  <div className={styles.uploadHint}>PDF • Up to 10MB</div>
                </div>
              ) : (
                <motion.div
                  className={styles.fileSelected}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={24} className={styles.successIcon} />
                  <div className={styles.fileName}>{resume.name}</div>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeResume();
                    }}
                    aria-label="Remove resume"
                  >
                    Remove
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* OR Divider */}
            <div className={styles.orDivider}>
              <span>OR</span>
            </div>

            {/* Self Description */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldTitle}>
                Your Professional Summary
              </label>

              <textarea
                className={styles.textarea}
                placeholder="Share your experience, key skills, achievements, and career goals. (200-400 words recommended)"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                spellCheck="true"
              />

              <div className={styles.charCounter}>
                <span>{selfDescLength}</span>
                <span className={styles.counterMax}>words</span>
              </div>
            </div>

            {/* Info Box */}
            <div className={styles.infoBox}>
              <FileText size={16} />
              <span>
                Upload a <strong>resume</strong> or provide your{" "}
                <strong>professional summary</strong> for analysis.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Action Area */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaInfo}>
            <Zap size={14} />
            <span>AI analyzes skills, gaps, confidence, and readiness</span>
          </div>

          <motion.button
            className={`${styles.ctaButton} ${
              !canGenerate || loading ? styles["ctaButton--disabled"] : ""
            }`}
            onClick={generateStrategy}
            disabled={!canGenerate || loading}
            whileHover={canGenerate && !loading ? { scale: 1.05 } : {}}
            whileTap={canGenerate && !loading ? { scale: 0.95 } : {}}
          >
            <span>Generate My Interview Plan</span>
            {!loading && <ArrowRight size={18} />}
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap size={18} />
              </motion.div>
            )}
          </motion.button>
        </div>
      </motion.section>

      {/* Previous Reports */}
      {reports && reports.length > 0 && (
        <motion.section
          className={styles.reportsSection}
          variants={itemVariants}
        >
          <div className={styles.reportsSectionHeader}>
            <h3 className={styles.reportsSectionTitle}>Previous Reports</h3>
            <span className={styles.reportsCount}>
              {reports.length} reports
            </span>
          </div>
          <div className={styles.reportsGrid}>
            {reports.map((report) => (
              <motion.div
                key={report._id}
                className={styles.reportCard}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/interview/report/${report._id}`)}
              >
                <div className={styles.reportCardTop}>
                  <div className={styles.reportCardScore}>
                    <span className={styles.scoreNumber}>
                      {report.matchScore}
                    </span>
                    <span className={styles.scorePercent}>%</span>
                  </div>
                  <span
                    className={`${styles.scoreTag} ${
                      report.matchScore >= 75
                        ? styles["scoreTag--green"]
                        : report.matchScore >= 50
                          ? styles["scoreTag--yellow"]
                          : styles["scoreTag--red"]
                    }`}
                  >
                    {report.matchScore >= 75
                      ? "Strong"
                      : report.matchScore >= 50
                        ? "Moderate"
                        : "Weak"}
                  </span>
                </div>
                <p className={styles.reportCardTitle}>{report.title}</p>
                <div className={styles.reportCardFooter}>
                  <span className={styles.reportCardDate}>
                    {new Date(report.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className={styles.reportCardArrow}>→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Footer hint */}
      <motion.div className={styles.footerHint} variants={itemVariants}>
        Approx <strong>30 seconds</strong> to generate your complete interview
        strategy
      </motion.div>
    </motion.main>
  );
};

export default Home;
