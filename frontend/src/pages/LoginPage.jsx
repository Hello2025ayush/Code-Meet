import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginRequest } from "../lib/api.js";
import { setToken, getToken, clearToken, setCurrentUser } from "../lib/auth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, skip to create page.
  React.useEffect(() => {
    if(getToken()){
      navigate("/create");
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try{
      const res = await loginRequest({ email, password });
      setToken(res.data.token);
      setCurrentUser(res.data.user || null);
      navigate("/create");
    }
    catch(err){
      if(err?.response?.status === 401){
        clearToken();
      }
      setError(err?.response?.data?.message || "Login failed");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="label">Email</div>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="field">
            <div className="label">Password</div>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error ? <div className="error">{error}</div> : null}

        <div className="text-center">
          No account?{" "}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

