import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { clearToken, getCurrentUser, getToken } from "../lib/auth.js";
import { getStarterCode, isStarterCode } from "../lib/editor.js";
import RoomLayout from "../components/RoomLayout.jsx";
import { createRoomSocket } from "../lib/socket.js";

export default function RoomPage() {
  const navigate = useNavigate();
  const { sessionCode } = useParams();

  const socketRef = useRef(null);
  const emitTimersRef = useRef({});
  const codeApplyingFromRemoteRef = useRef(false);

  const [problemStatement, setProblemStatement] = useState("");
  const [sampleTest, setSampleTest] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [status, setStatus] = useState("Loading...");
  const [interviewerName, setInterviewerName] = useState("");
  const [createdBy, setCreatedBy] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if(!getToken()){
      navigate("/login");
      return;
    }

    // Connect socket + join the room.
    const socket = createRoomSocket();
    socketRef.current = socket;

    setStatus("Connecting...");

    socket.on("connect", () => {
      setStatus("Connected. Joining room...");
      socket.emit("joinSession", { sessionCode });
    });

    socket.on("connect_error", (err) => {
      setStatus(err?.message || "Connection error");
    });

    socket.on("loadSessionState", ({ problemStatement, sampleTest, code, language, interviewerName, createdBy }) => {
      const nextLanguage = language || "cpp";
      const nextCode = code || getStarterCode(nextLanguage);

      codeApplyingFromRemoteRef.current = true;
      setProblemStatement(problemStatement || "");
      setSampleTest(sampleTest || "");
      setLanguage(nextLanguage);
      setCode(nextCode);
      setInterviewerName(interviewerName || "");
      setCreatedBy(createdBy || null);
      setStatus("Synced");

      if (!code) {
        socket.emit("codeChange", { sessionCode, code: nextCode });
      }

      // Monaco may trigger onChange after programmatic set.
      setTimeout(() => {
        codeApplyingFromRemoteRef.current = false;
      }, 50);
    });

    socket.on("problemStatementUpdate", ({ problemStatement }) => {
      setProblemStatement(problemStatement || "");
    });

    socket.on("sampleTestUpdate", ({ sampleTest }) => {
      setSampleTest(sampleTest || "");
    });

    socket.on("codeUpdate", ({ code }) => {
      codeApplyingFromRemoteRef.current = true;
      setCode(code || "");

      setTimeout(() => {
        codeApplyingFromRemoteRef.current = false;
      }, 50);
    });

    socket.on("languageUpdate", ({ language, code }) => {
      codeApplyingFromRemoteRef.current = true;
      setLanguage(language || "cpp");
      setCode(code || getStarterCode(language || "cpp"));
      setStatus("Language updated");

      setTimeout(() => {
        codeApplyingFromRemoteRef.current = false;
      }, 50);
    });

    return () => {
      Object.values(emitTimersRef.current).forEach(clearTimeout);
      socket.disconnect();
    };
  }, [navigate, sessionCode]);

  const onLogout = () => {
    clearToken();
    navigate("/login");
  };

  const emitWithDebounce = (key, fn, delay = 150) => {
    if(emitTimersRef.current[key]){
      clearTimeout(emitTimersRef.current[key]);
    }
    emitTimersRef.current[key] = setTimeout(fn, delay);
  };

  const role = createdBy && currentUser?.id === createdBy
    ? "Interviewer"
    : interviewerName && currentUser?.name === interviewerName
      ? "Interviewer"
      : "Candidate";

  const handleLanguageChange = (nextLanguage) => {
    const socket = socketRef.current;
    const shouldApplyStarter = !code.trim() || isStarterCode(language, code);
    const nextCode = shouldApplyStarter ? getStarterCode(nextLanguage) : code;

    codeApplyingFromRemoteRef.current = true;
    setLanguage(nextLanguage);
    setCode(nextCode);
    setStatus(`Language set to ${nextLanguage}`);

    setTimeout(() => {
      codeApplyingFromRemoteRef.current = false;
    }, 50);

    if(!socket?.connected) return;

    emitWithDebounce("language", () => {
      socket.emit("languageChange", {
        sessionCode,
        language: nextLanguage,
        code: nextCode,
      });
    }, 100);
  };

  const handleResetStarter = () => {
    const socket = socketRef.current;
    const starter = getStarterCode(language);

    codeApplyingFromRemoteRef.current = true;
    setCode(starter);
    setStatus("Starter code restored");

    setTimeout(() => {
      codeApplyingFromRemoteRef.current = false;
    }, 50);

    if(!socket?.connected) return;

    emitWithDebounce("code", () => {
      socket.emit("codeChange", { sessionCode, code: starter });
    }, 100);
  };

  return (
    <RoomLayout
      sessionCode={sessionCode}
      interviewerName={interviewerName}
      role={role}
      language={language}
      problemStatement={problemStatement}
      sampleTest={sampleTest}
      code={code}
      status={status}
      onLanguageChange={handleLanguageChange}
      onResetStarter={handleResetStarter}
      onProblemStatementChange={(v) => {
        setProblemStatement(v);
        const socket = socketRef.current;
        if(!socket?.connected) return;

        emitWithDebounce("problem", () => {
          socket.emit("problemStatementChange", { sessionCode, problemStatement: v });
        });
      }}
      onSampleTestChange={(v) => {
        setSampleTest(v);
        const socket = socketRef.current;
        if(!socket?.connected) return;

        emitWithDebounce("sample", () => {
          socket.emit("sampleTestChange", { sessionCode, sampleTest: v });
        });
      }}
      onCodeChange={(v) => {
        setCode(v);

        // If this change came from remote sync, don't re-emit.
        if(codeApplyingFromRemoteRef.current) return;

        const socket = socketRef.current;
        if(!socket?.connected) return;

        emitWithDebounce("code", () => {
          socket.emit("codeChange", { sessionCode, code: v });
        });
      }}
      onLogout={onLogout}
    />
  );
}

