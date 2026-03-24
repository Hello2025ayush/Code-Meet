import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerRequest } from "../lib/api.js";
import { setToken, clearToken, getToken, setCurrentUser } from "../lib/auth.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await registerRequest({ name, email, password });
      setToken(res.data.token);
      setCurrentUser(res.data.user || null);
      navigate("/create");
    }
    catch(err){
      if(err?.response?.status === 401){
        clearToken();
      }
      setError(err?.response?.data?.message || "Registration failed");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h2 style={{ marginTop: 0 }}>Register</h2>
        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="label">Name</div>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              autoComplete="name"
              required
            />
          </div>
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
              autoComplete="new-password"
              required
            />
          </div>

          <button className="btn" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {error ? <div className="error">{error}</div> : null}

        <div className="text-center">
          Already have an account?{" "}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

