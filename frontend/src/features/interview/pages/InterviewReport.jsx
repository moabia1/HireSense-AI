import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/interview.module.scss";
import Navbar from "../../../components/Navbar/Navbar";
import { useInterview } from "../hooks/useInterview";

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: "technical", label: "Technical Questions", icon: "<>" },
  { id: "behavioral", label: "Behavioral Questions", icon: "◻" },
  { id: "roadmap", label: "Road Map", icon: "↗" },
];

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "green" : score >= 50 ? "yellow" : "red";
  const label =
    score >= 75
      ? "Strong match for this role"
      : score >= 50
        ? "Moderate match"
        : "Needs improvement";

  return (
    <div className={styles.scoreRing}>
      <svg width={106} height={106} viewBox="0 0 106 106">
        <circle cx={53} cy={53} r={r} className={styles.ringTrack} />
        <circle
          cx={53}
          cy={53}
          r={r}
          className={`${styles.ringProgress} ${styles[`ring--${color}`]}`}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 53 53)"
        />
        <text x={53} y={50} textAnchor="middle" className={styles.ringScore}>
          {score}
        </text>
        <text x={53} y={65} textAnchor="middle" className={styles.ringUnit}>
          %
        </text>
      </svg>
      <span className={`${styles.ringLabel} ${styles[`ringLabel--${color}`]}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Accordion Item ───────────────────────────────────────────────────────────
function AccordionItem({ index, question, intention, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${styles.accordionItem} ${open ? styles["accordionItem--open"] : ""}`}
    >
      <button
        className={styles.accordionTrigger}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.qBadge}>
          Q{String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.qText}>{question}</span>
        <span
          className={`${styles.chevron} ${open ? styles["chevron--open"] : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.accordionBody}>
          <div className={`${styles.infoBlock} ${styles["infoBlock--cyan"]}`}>
            <span className={styles.infoBlockLabel}>INTENT</span>
            <p className={styles.infoBlockText}>{intention}</p>
          </div>
          <div className={`${styles.infoBlock} ${styles["infoBlock--violet"]}`}>
            <span className={styles.infoBlockLabel}>IDEAL ANSWER</span>
            <p className={styles.infoBlockText}>{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────
function RoadmapSection({ plan }) {
  return (
    <div className={styles.roadmap}>
      {plan.map((item, i) => (
        <div key={i} className={styles.roadmapItem}>
          <div className={styles.roadmapTimeline}>
            <div className={styles.roadmapNode}>{i + 1}</div>
            {i < plan.length - 1 && <div className={styles.roadmapLine} />}
          </div>
          <div className={styles.roadmapContent}>
            <div className={styles.roadmapHeader}>
              <span className={styles.roadmapDay}>{item.day}</span>
              <span className={styles.roadmapFocus}>{item.focus}</span>
            </div>
            <ul className={styles.roadmapTasks}>
              {item.tasks.map((task, j) => (
                <li key={j} className={styles.roadmapTask}>
                  <span className={styles.taskDot}>◆</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className={styles.loadingState}>
      <div className={styles.loadingSpinner} />
      <p className={styles.loadingText}>Fetching your interview report...</p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message }) {
  return (
    <div className={styles.errorState}>
      <span className={styles.errorIcon}>⚠</span>
      <p className={styles.errorText}>
        {message || "Failed to load report. Please try again."}
      </p>
    </div>
  );
}

// ─── Main Report Page ─────────────────────────────────────────────────────────
const Report = () => {
  const { interviewId } = useParams();
  const { getReportById, generateReportPdf } = useInterview();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("technical");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!interviewId) return;

    let cancelled = false;

    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getReportById(interviewId);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReport();

    return () => {
      cancelled = true;
    };
  }, [interviewId]);

  const activeQuestions = data
    ? activeSection === "technical"
      ? data.technicalQuestions
      : data.behavioralQuestions
    : [];

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.background} aria-hidden="true">
        <div className={`${styles.blob} ${styles["blob--1"]}`} />
        <div className={`${styles.blob} ${styles["blob--2"]}`} />
        <div className={styles.gridOverlay} />
      </div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}

      {!loading && !error && data && (
        <div className={styles.layout}>
          {/* ── Left Sidebar ── */}
          <aside className={styles.sidebar}>
            <span className={styles.sidebarLabel}>SECTIONS</span>
            <nav className={styles.sidebarNav}>
              {NAV_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  className={`${styles.navItem} ${activeSection === s.id ? styles["navItem--active"] : ""}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  <span className={styles.navIcon}>{s.icon}</span>
                  <span className={styles.navLabel}>{s.label}</span>
                </button>
              ))}
            </nav>

            {/* ── Download Button ── */}
            <div className={styles.sidebarDivider} />
            <button
              className={`${styles.sidebarDownloadBtn} ${downloading ? styles["sidebarDownloadBtn--loading"] : ""}`}
              disabled={downloading}
              onClick={async () => {
                setDownloading(true);
                try {
                  await generateReportPdf(interviewId);
                } finally {
                  setDownloading(false);
                }
              }}
            >
              <span className={styles.sidebarDownloadGlow} />
              {downloading ? (
                <span className={styles.sidebarDownloadSpinner} />
              ) : (
                <svg
                  className={styles.sidebarDownloadIcon}
                  width={15}
                  height={15}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
              <span className={styles.sidebarDownloadText}>
                {downloading ? "Preparing..." : "Download Report"}
              </span>
            </button>
          </aside>

          {/* ── Center Content ── */}
          <div className={styles.main}>
            {(activeSection === "technical" ||
              activeSection === "behavioral") && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    {activeSection === "technical"
                      ? "Technical Questions"
                      : "Behavioral Questions"}
                  </h2>
                  <span className={styles.questionCount}>
                    {activeQuestions.length} questions
                  </span>
                </div>
                <div className={styles.accordionList}>
                  {activeQuestions.map((q, i) => (
                    <AccordionItem
                      key={i}
                      index={i}
                      question={q.question}
                      intention={q.intention}
                      answer={q.answer}
                    />
                  ))}
                </div>
              </section>
            )}

            {activeSection === "roadmap" && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Preparation Road Map</h2>
                  <span className={styles.questionCount}>
                    {data.preparationPlan.length} phases
                  </span>
                </div>
                <RoadmapSection plan={data.preparationPlan} />
              </section>
            )}
          </div>

          {/* ── Right Panel ── */}
          <aside className={styles.rightPanel}>
            <div className={styles.panel}>
              <span className={styles.panelLabel}>MATCH SCORE</span>
              <ScoreRing score={data.matchScore} />
            </div>

            <div className={styles.panel}>
              <span className={styles.panelLabel}>SKILL GAPS</span>
              <div className={styles.skillGapList}>
                {data.skillGaps.map((gap, i) => (
                  <div
                    key={i}
                    className={`${styles.skillGapItem} ${styles[`skillGap--${gap.severity}`]}`}
                  >
                    <span className={styles.skillGapName}>{gap.skill}</span>
                    <span className={styles.skillGapBadge}>
                      {gap.severity.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Report;
