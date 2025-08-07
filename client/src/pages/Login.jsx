import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./stylelogin.css";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    role: "admin",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/login", inputs);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("userRole", res.data.role);

      if (res.data.role === "admin") navigate("/admin/home");
      else if (res.data.role === "volunteer") navigate("/volunteer/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError("Login failed: " + (err.response?.data || "Unknown error"));
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>

        <input
          className="login-input"
          name="username"
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          className="login-input"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select
          className="login-select"
          name="role"
          value={inputs.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="volunteer">Volunteer</option>
          <option value="user">User</option>
        </select>

        <button className="login-button" type="submit">
          Login
        </button>

        {error && <p className="login-error">{error}</p>}

        <p className="login-register">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
