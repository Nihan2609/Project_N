import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./stylelogin.css"; // Using the same CSS file as login

const Register = () => {
  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    skill: "",
    isAnonymous: false,
    role: "user",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/register", inputs);
      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      setError("Registration failed: " + (err.response?.data || "Unknown error"));
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h2 className="login-title">Register</h2>

        <input
          className="login-input"
          name="name"
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          className="login-input"
          name="contact"
          onChange={handleChange}
          placeholder="Contact Info"
          required
        />

        <select
          className="login-select"
          name="role"
          value={inputs.role}
          onChange={handleChange}
        >
          <option value="volunteer">Volunteer</option>
          <option value="user">User</option>
        </select>

        {inputs.role === "volunteer" && (
          <input
            className="login-input"
            name="skill"
            onChange={handleChange}
            placeholder="Skill (e.g., First Aid)"
            required
          />
        )}

        {inputs.role === "user" && (
          <div className="login-checkbox">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              onChange={handleChange}
            />
            <label htmlFor="isAnonymous">Register as Anonymous Donor</label>
          </div>
        )}

        <button className="login-button" type="submit">
          Register
        </button>

        {error && <p className="login-error">{error}</p>}

        <p className="login-register">
          Already have an account?{" "}
          <Link to="/Login" className="login-link">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;