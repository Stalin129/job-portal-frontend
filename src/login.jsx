import { useState } from "react";
import "./Login.css";
import api from "./assets/axiosInstance/AxiosInstance";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      const response =await api.post("/auth/login", {
        username,
        password
      });

      if(response.data){
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        if(response.data.role === "EMPLOYER") {
          navigate("/employer");
        } else if(response.data.role === "RECRUITER") {
          navigate("/recruiter");
        } else if(response.data.role === "CANDIDATE"){
          navigate("/candidate");
        }
        else if(response.data.role==="admin"){
          navigate("/admin");
        }
        console.log("Login successful"+ response.data.username+" "+response.data.token+" "+response.data.role);
      }else{
        console.log("Login failed");
      }
    }
   catch (error) {
    alert(error.response?.data || error.message);
}

  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        <h1 className="logo">JobPortal</h1>

        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p className="register-text" onClick={() => navigate("/register")}>
          Don't have an account?
          <a href="/register"> Register</a>
        </p>

      </div>
    </div>
  );
}

export default Login;