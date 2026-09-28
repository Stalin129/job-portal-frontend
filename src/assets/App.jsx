import { Routes, Route } from "react-router-dom";
import Login from "../login";
import Register from "./register";
import Candidate from "./candidate/candidate";
import Employer from "./employer/employer";
import Recruiter from "./recruiter/reqruiter";
import Admin from "./admin/admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/candidate" element={<Candidate />} />
      <Route path="/employer" element={<Employer/>}/>
      <Route path="/recruiter" element={<Recruiter/>}/>
      <Route path="/admin" element={<Admin/>}/>
    </Routes>
  );
}

export default App;