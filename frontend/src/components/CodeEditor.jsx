import Editor from "@monaco-editor/react";
import { LANGUAGE_OPTIONS } from "../lib/editor.js";

export default function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  onResetStarter,
}) {
  return (
    <div className="codePanel">
      <div className="panelHeader panelHeaderEditor">
        <div>
          <div className="panelTitle">Code Editor</div>
          <div className="panelSubtext">Shared in real time for interviewer and candidate.</div>
        </div>

        <div className="editorToolbar">
          <label className="languagePicker">
            <span>Language</span>
            <select
              value={language}
              onChange={(e) => onLanguageChange?.(e.target.value)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="ghostBtn" onClick={onResetStarter}>
            Reset
          </button>
        </div>
      </div>
      <Editor
        height="100%"
        language={language}
        value={value || ""}
        onChange={(v) => onChange?.(v ?? "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          fontFamily: "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
          fontLigatures: true,
          scrollBeyondLastLine: false,
          wordWrap: "bounded",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          padding: { top: 16 },
          lineNumbersMinChars: 3,
          roundedSelection: true,
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
          tabSize: 4,
          renderLineHighlight: "gutter",
          contextmenu: true,
        }}
      />
    </div>
  );
}
