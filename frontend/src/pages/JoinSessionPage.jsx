import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { joinSessionRequest } from "../lib/api.js";
import { clearToken, getToken } from "../lib/auth.js";

export default function JoinSessionPage() {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if(!getToken()){
      navigate("/login");
    }
  }, [navigate]);

  const onJoin = async () => {
    setError("");
    setLoading(true);
    try{
      const res = await joinSessionRequest(sessionCode);
      const code = res.data.session?.sessionCode || sessionCode;
      navigate(`/room/${code}`);
    }
    catch(err){
      if(err?.response?.status === 401){
        clearToken();
      }
      setError(err?.response?.data?.message || "Could not join session");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h2 style={{ marginTop: 0 }}>Join Session</h2>

        <div className="field">
          <div className="label">Session Code</div>
          <input
            className="input"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            type="text"
            placeholder="e.g. ABC123"
            required
          />
        </div>

        <button
          className="btn"
          disabled={loading || !sessionCode.trim()}
          onClick={onJoin}
        >
          {loading ? "Joining..." : "Join"}
        </button>

        {error ? <div className="error">{error}</div> : null}
      </div>
    </div>
  );
}

