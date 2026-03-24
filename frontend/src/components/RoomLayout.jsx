import ProblemEditor from "./ProblemEditor.jsx";
import SampleTestEditor from "./SampleTestEditor.jsx";
import CodeEditor from "./CodeEditor.jsx";

export default function RoomLayout({
  sessionCode,
  interviewerName,
  role,
  language,
  problemStatement,
  sampleTest,
  code,
  status,
  onLanguageChange,
  onResetStarter,
  onProblemStatementChange,
  onSampleTestChange,
  onCodeChange,
  onLogout,
}) {
  return (
    <div className="roomShell">
      <div className="topBar">
        <div className="topBarTitle">
          <div className="brandBlock">
            <strong>Code Meet</strong>
            <span className={`roleBadge ${role === "Interviewer" ? "roleBadgeInterviewer" : "roleBadgeCandidate"}`}>
              {role}
            </span>
          </div>
          <div className="roomMeta">
            <span className="room-badge">Room: {sessionCode}</span>
            <span className="hostText">Host: {interviewerName || "Unknown"}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="btn btn-secondary"
          style={{ width: "auto", padding: "6px 14px" }}
        >
          Logout
        </button>
      </div>

      <div className="roomBody">
        <div className="leftStack">
          <div className="panel">
            <div className="panelHeader">
              <div>
                <div className="panelTitle">Problem Statement</div>
              </div>
            </div>
            <ProblemEditor value={problemStatement} onChange={onProblemStatementChange} />
          </div>

          <div className="panel">
            <div className="panelHeader">
              <div>
                <div className="panelTitle">Sample Tests</div>
              </div>
            </div>
            <SampleTestEditor value={sampleTest} onChange={onSampleTestChange} />
          </div>
        </div>

        <CodeEditor
          value={code}
          language={language}
          onLanguageChange={onLanguageChange}
          onResetStarter={onResetStarter}
          onChange={onCodeChange}
        />
      </div>

      <div className="statusBar">
        <span className="status-dot"></span>
        {status || "System Ready"}
      </div>
    </div>
  );
}

