import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSessionRequest } from "../lib/api.js";
import { clearToken, getToken } from "../lib/auth.js";

export default function CreateSessionPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if(!getToken()){
      navigate("/login");
    }
  }, [navigate]);

  const onCreate = async () => {
    setError("");
    setLoading(true);
    try{
      const res = await createSessionRequest({});
      const sessionCode = res.data.session?.sessionCode;
      if(!sessionCode){
        throw new Error("Invalid response");
      }
      navigate(`/room/${sessionCode}`);
    }
    catch(err){
      if(err?.response?.status === 401){
        clearToken();
      }
      setError(err?.response?.data?.message || "Could not create session");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h2 style={{ marginTop: 0 }}>Create Session</h2>
        <button className="btn" disabled={loading} onClick={onCreate}>
          {loading ? "Creating..." : "Create & Start Coding"}
        </button>

        <div className="text-center">
          You can also{" "}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/join")}
          >
            Join a session
          </button>
        </div>

        {error ? <div className="error">{error}</div> : null}
      </div>
    </div>
  );
}

