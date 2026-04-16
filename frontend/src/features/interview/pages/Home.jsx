import React, { useState, useRef, useCallback } from "react";
import "../styles/home.scss";
import { useInterview } from "../hooks/useInterview";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef(null);

  const { loading, generateReport } = useInterview()
  

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

  const generateStrategy = useCallback(async () => {
    if (!canGenerate) return;
    await generateReport({ jobDescription, selfDescription, resume });
  }, [canGenerate, jobDescription, resume, selfDescription]);

  return (
    <main className="home">
      <div className="bg-blobs" aria-hidden>
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <span className="blob blob--3" />
      </div>

      <section className="home__hero">
        <h1 className="hero__title animate-fadeUp">
          Create Your Custom{" "}
          <span className="gradient-text">Interview Plan</span>
        </h1>
        <p className="hero__subtitle animate-fadeUp">
          Let our AI analyze your profile and build a winning strategy
        </p>
      </section>

      <section className="home__card card--glass animate-fadeUp">
        <div className="card__inner">
          <div className="card__left">
            <div className="field">
              <div className="field__header">
                <h3 className="field__title">Target Job Description</h3>
                <span className="tag">REQUIRED</span>
              </div>
              <textarea
                className="input textarea"
                maxLength={5000}
                placeholder={`Example: Senior Frontend Engineer at a fast-growing SaaS startup working with React, performance, and design systems.`}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="meta">
                <span className="meta__count">
                  {jobDescription.length}/5000
                </span>
              </div>
            </div>
          </div>

          <div className="card__right">
            <div
              className={`upload ${dragActive ? "upload--active" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileRef.current && fileRef.current.click()}
              role="button"
              tabIndex={0}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="input-file"
                onChange={onFileChange}
                hidden
              />

              {!resume ? (
                <div className="upload__inner">
                  <svg
                    className="upload__icon"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 3v10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 7l4-4 4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="13"
                      width="18"
                      height="8"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div className="upload__label">Upload Resume</div>
                  <small className="upload__hint">Best Results • PDF</small>
                </div>
              ) : (
                <div className="upload__file">
                  <div className="file__meta">
                    <strong>{resume.name}</strong>
                    <button
                      className="file__remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeResume();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="divider">OR</div>

            <div className="field">
              <label className="field__title">Your Profile</label>
              <textarea
                className="input textarea"
                placeholder="Short self-description about your experience, skills and goals (200-400 words)."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                rows={6}
              />
            </div>

            <div className="info-box">
              Either <strong>Resume</strong> or{" "}
              <strong>Self Description</strong> is required
            </div>
          </div>
        </div>

        <div className="card__cta">
          <span className="cta__info">
            AI-Powered Strategy Generation • Approx 30s
          </span>
          <button
            className="btn--primary"
            onClick={generateStrategy}
            disabled={!canGenerate || loading}>
            Generate My Interview Strategy
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
