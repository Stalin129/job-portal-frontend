import { useState } from "react";
import "./register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Check password
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      username: formData.name,
      email: formData.email,
      password: formData.password,
      role: role.toUpperCase(),
    };

    try{
        const response =await axios.post("http://localhost:8080/auth/register", userData);
        if(response.data== "Account created") {
          navigate("/");
        }
        alert(response.data);
    }
    catch (error) {
      console.error("Error during registration:", error);
    }
  };

  // ============================
  // STEP 1: SELECT ACCOUNT TYPE
  // ============================

  if (!role) {
    return (
      <div className="register-page">
        <div className="register-container">

          <h1>JobPortal</h1>

          <h2>Create Account</h2>

          <p className="subtitle">I want to:</p>

          {/* Candidate */}
          <button
            className="role-card"
            onClick={() => setRole("candidate")}
          >
            <span className="role-icon">👤</span>

            <div>
              <h3>Find a Job</h3>
              <p>Candidate</p>
            </div>
          </button>

          {/* Recruiter */}
          <button
            className="role-card"
            onClick={() => setRole("recruiter")}
          >
            <span className="role-icon">💼</span>

            <div>
              <h3>Recruit Candidates</h3>
              <p>Recruiter</p>
            </div>
          </button>

          {/* Employer */}
          <button
            className="role-card"
            onClick={() => setRole("employer")}
          >
            <span className="role-icon">🏢</span>

            <div>
              <h3>Post Jobs</h3>
              <p>Employer</p>
            </div>
          </button>

        </div>
      </div>
    );
  }

  // ============================
  // STEP 2: REGISTRATION FORM
  // ============================

  return (
    <div className="register-page">
      <div className="register-container">

        <h1>JobPortal</h1>

        <h2>
          Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>


          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="create-btn">
            Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
          </button>

        </form>

        <button
          type="button"
          className="back-btn"
          onClick={() => setRole("")}
        >
          ← Change Account Type
        </button>

      </div>
    </div>
  );
}

export default Register;