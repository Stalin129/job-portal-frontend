import "./admin.css";
import { useState, useEffect } from "react";
import api from "../axiosInstance/AxiosInstance";
import { useNavigate } from "react-router-dom";
function Admin() {
  const navigate=useNavigate();
  const [sidebar, setSidebar] = useState({
    dashboard: true,
    user: false,
    employers: false,
    recruiters: false,
    candidates: false,
    jobs: false,
    applications: false,
  });
  const [employersData,setEmployerData] =useState([]);
  const [totalEmpoyer,setTotalEmployer] =useState(null);
  const employerdatahandle=async()=>{
    try{
    const res=await api.get("/auth/employers");
      setEmployerData(res.data);
      setTotalEmployer(res.data.filter(data=>data.employer).length);
      console.log("employer data",res.data);
    }catch(error){
      console.log(error.response.data);
    }
  }
  const [recruitersData,setRecruitersData] = useState([]);
  const recruiterdatahandle=async()=>{
    try{
    const res=await api.get("/auth/recruiters");
    setRecruitersData(res.data);
    console.log("recruiters",res.data);
    }catch(error){
      console.log(error.response.data);
    }

  }
  const [candidatesData,setCandidatesData] = useState([]);
  const candidatedatahandle=async()=>{
    try{
    const res=await api.get("/auth/candidates");
    setCandidatesData(res.data);
    console.log("candidates",res.data);
    }catch(error){
      console.log(error.response.data);
    }
  }
  const [jobsData,setJobsData] = useState([]);
  const jobdatahandle=async()=>{
    try{
    const res=await api.get("/auth/jobs");
      setJobsData(res.data);
      console.log("jobs",res.data);
    }catch(error){
      console.log(error.response.data);
    }
  }
  const [applicationsData,setApplicationsData] = useState([]);
  const applicantdatahandle=async()=>{
    try{
    const res=await api.get("/auth/applicants");
    setApplicationsData(res.data);
    console.log("applicants",res.data);
    }catch(error){
      console.log(error.response.data);
    }
  }

  const [usersData, setUserData] = useState([]);
  useEffect(() => {
    const loadData = () => {
      loaduserdata();
      employerdatahandle();
      recruiterdatahandle();
      candidatedatahandle();
      jobdatahandle();
      applicantdatahandle();
    }
    loadData();
  }, []);

  const loaduserdata = async () => {
    try {
      const res = await api.get("/auth/users");
      console.log(res.data);
      const users=res.data.filter(user=>user.role.toLowerCase()!=="admin");
      setUserData(users);
      
      
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const deleteuserhandle=async(id)=>{
    try{
    const res=await api.delete(`/auth/delete_user/${id}`);
    loaduserdata();
    employerdatahandle();
    recruiterdatahandle();
    candidatedatahandle();
    jobdatahandle();
    applicantdatahandle();
    
    }catch(error){
      console.log(error.response.data);
    }

  };
  const deletejobhandle=async(id)=>{
    try{
      const res=await api.delete(`/auth/deletejob/${id}`);
      jobdatahandle();
      applicantdatahandle();
      employerdatahandle();
      recruiterdatahandle();
    }catch(error){
      console.log(error.response.data);
    }
  }
  const deleteapplicanthandle=async(id)=>{
      try{
        const res=await api.delete(`/auth/deleteapplicant/${id}`);
        applicantdatahandle();
        jobdatahandle();
      }catch(error){
        console.log(error.response.data);
      }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const employersPerPage = 5;
  const totalPages = Math.ceil(employersData.length / employersPerPage);
  const startIndex = (currentPage - 1) * employersPerPage;
  const currentEmployers = employersData.slice(startIndex, startIndex + employersPerPage);
  const recruiterTotalPages = Math.ceil(recruitersData.length / employersPerPage);
  const recruiterStartIndex = (currentPage - 1) * employersPerPage;
  const currentRecruiters = recruitersData.slice(recruiterStartIndex, recruiterStartIndex + employersPerPage);
  const candidateTotalPages = Math.ceil(candidatesData.length / employersPerPage);
  const candidateStartIndex = (currentPage - 1) * employersPerPage;
  const currentCandidates = candidatesData.slice(candidateStartIndex, candidateStartIndex + employersPerPage);
  const jobsTotalPages = Math.ceil(jobsData.length / employersPerPage);
  const jobsStartIndex = (currentPage - 1) * employersPerPage;
  const currentJobs = jobsData.slice(jobsStartIndex, jobsStartIndex + employersPerPage);
  const applicationsTotalPages = Math.ceil(applicationsData.length / employersPerPage);
  const applicationsStartIndex = (currentPage - 1) * employersPerPage;
  const currentApplications = applicationsData.slice(applicationsStartIndex, applicationsStartIndex + employersPerPage);
  const usersTotalPages = Math.ceil(usersData.length / employersPerPage);
  const usersStartIndex = (userCurrentPage - 1) * employersPerPage;
  const currentUsers = usersData.slice(usersStartIndex, usersStartIndex + employersPerPage);

  const switchsidebar = (data) => {
    setSidebar({
      dashboard: false,
      user: false,
      employers: false,
      recruiters: false,
      candidates: false,
      jobs: false,
      applications: false,

    });
    switch (data) {
      case "dashboard":
        setSidebar({ dashboard: true });
        break;
      case "users":
        setSidebar({ user: true });
        setUserCurrentPage(1);
        break;
      case "employers":
        setSidebar({ employers: true });
        setCurrentPage(1);
        break;
      case "recruiters":
        setSidebar({ recruiters: true });
        break;
      case "candidates":
        setSidebar({ candidates: true });
        break;
      case "jobs":
        setSidebar({ jobs: true });
        break;
      case "applications":
        setSidebar({ applications: true });
        break;

    }
  };
  const stats = [
    { label: "Total Users", value: usersData.length, icon: "👥", tone: "blue" },
    { label: "Total Employers", value: totalEmpoyer, icon: "🏢", tone: "green" },
    { label: "Total Recruiters", value: recruitersData.length, icon: "👤", tone: "peach" },
    { label: "Total Candidates", value: candidatesData.length, icon: "🎓", tone: "purple" },
    { label: "Total Jobs", value: jobsData.length, icon: "🗂️", tone: "rose" },
    { label: "Total Applications", value: applicationsData.length, icon: "📝", tone: "gold" },
  ];
  const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
    }
  return (
    <div className="admin-page">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span className="brand-dot" />
            <span className="brand-ring" />
          </div>
          <span>JobPortal</span>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${sidebar.dashboard ? 'active' : ''}`} type="button" onClick={() => { switchsidebar("dashboard") }}>
            <span className="nav-icon">🏠</span>
            <span >Dashboard</span>
          </button>
          <button className={`nav-item ${sidebar.user ? 'active' : ''}`} type="button" onClick={() => { switchsidebar("users") }}>
            <span className="nav-icon">👥</span>
            <span >Users</span>
          </button>
          <button className={`nav-item ${sidebar.employers ? 'active' : ''}`} type="button" onClick={() => { switchsidebar("employers") }}>
            <span className="nav-icon">🏢</span>
            <span >Employers</span>
          </button>
          <button className={`nav-item ${sidebar.recruiters ? 'active' : ''}`} type="button" onClick={() => { switchsidebar("recruiters") }}>
            <span className="nav-icon">👤</span>
            <span >Recruiters</span>
          </button>
          <button className={`nav-item ${sidebar.candidates ? 'active' : ''}`} type="button" onClick={() => { switchsidebar("candidates") }}>
            <span className="nav-icon">🎓</span>
            <span >Candidates</span>
          </button>
          <button className={`nav-item ${sidebar.jobs ? 'active' : ''}`} type="button" onClick={() => { switchsidebar("jobs") }}>
            <span className="nav-icon">🗂️</span>
            <span >Jobs</span>
          </button>
          <button className={`nav-item ${sidebar.applications ? 'active' : ''}`} type="button" onClick={() => { switchsidebar("applications") }}>
            <span className="nav-icon">📝</span>
            <span >Applications</span>
          </button>
          <button className="nav-item logout" type="button" onClick={logout}>
            <span className="nav-icon">↩</span>
            <span >Logout</span>
          </button>
        </nav>
      </aside>

      {sidebar.dashboard && (<main className="admin-main">
        <header className="topbar">
          <div className="topbar-spacer" />
          <div className="user-menu">
            <div className="user-avatar">A</div>
            <span className="user-name">Admin</span>
          </div>
        </header>

        <section className="dashboard-content">
          <h1>Welcome, Admin!</h1>
          <p>Here is a summary of your job portal.</p>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <div className={`stat-icon ${stat.tone}`}>
                  <span>{stat.icon}</span>
                </div>
                <div className="stat-details">
                  <span className="stat-label">{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>)}
      {sidebar.user && (
        <main className="admin-main users-main">
          <header className="topbar">
            <div className="topbar-spacer" />
            <div className="user-menu">
              <div className="user-avatar">A</div>
              <span className="user-name">Admin</span>
            </div>
          </header>

          <section className="users-content">
            <div className="users-header">
              <h1>Users</h1>
              
            </div>

            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="action-td">
                        <button className="icon-btn delete" onClick={() => { deleteuserhandle(user.id) }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="users-pagination">
                <button
                  className="page-btn"
                  type="button"
                  disabled={userCurrentPage === 1}
                  onClick={() => setUserCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  ‹
                </button>

                {Array.from({ length: usersTotalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-btn ${userCurrentPage === index + 1 ? 'active' : ''}`}
                    type="button"
                    onClick={() => setUserCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="page-btn"
                  type="button"
                  disabled={userCurrentPage === usersTotalPages}
                  onClick={() => setUserCurrentPage((page) => Math.min(page + 1, usersTotalPages))}
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
      {sidebar.employers && (
        <main className="admin-main employers-main">
          <header className="topbar">
            <div className="topbar-spacer" />
            <div className="user-menu">
              <div className="user-avatar">A</div>
              <span className="user-name">Admin</span>
            </div>
          </header>

          <section className="employers-content">
            <div className="employers-header">
              <div className="employers-title-wrap">
                <h1>Employers</h1>
                <p>Manage all registered employers.</p>
              </div>

             
            </div>

            <div className="employers-table-wrap">
              <table className="employers-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Company Name</th>
                    <th>Industry</th>
                    <th>Company Size</th>
                    <th>Location</th>
                    <th>Jobs Posted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployers.map((employer,index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td className="company-name-cell">
                        <span className={`company-logo ${employer.tone}`}>{employer.employer.companyname.charAt(0).toUpperCase()}</span>
                        <span>{employer.employer.companyname}</span>
                      </td>
                      <td>{employer.employer.industry}</td>
                      <td>{employer.employer.companysize}</td>
                      <td>{employer.employer.location}</td>
                      <td>{employer.totaljobs}</td>

                      <td className="action-td">
                        <button className="icon-btn delete" onClick={() => { deleteuserhandle(employer.employer.user.id) }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
      {sidebar.recruiters && (
        <main className="admin-main recruiters-main">
          <header className="topbar">
            <div className="topbar-spacer" />
            <div className="user-menu">
              <div className="user-avatar">A</div>
              <span className="user-name">Admin</span>
            </div>
          </header>

          <section className="recruiters-content">
            <div className="recruiters-header">
              <div className="recruiters-title-wrap">
                <h1>Recruiters</h1>
                <p>Manage all registered recruiters.</p>
              </div>

             
            </div>

            <div className="recruiters-table-wrap">
              <table className="recruiters-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Designation</th>
                    <th>Location</th>
                    <th>Jobs Managed</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecruiters.map((recruiter,index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td className="recruiter-name-cell">
                        <span className={`candidate-avatar ${recruiter.tone}`}>{recruiter.recruiter.user.username.charAt(0).toUpperCase()}</span>
                        <span>{recruiter.recruiter.user.username}</span>
                      </td>
                      <td>{recruiter.recruiter.user.email}</td>
                      <td>{recruiter.recruiter.companyname}</td>
                      <td>{recruiter.recruiter.designation}</td>
                      <td>{recruiter.recruiter.location}</td>
                      <td>{recruiter.totaljobs}</td>

                      <td className="action-td">
                        <button className="icon-btn delete" onClick={() => { deleteuserhandle(recruiter.recruiter.user.id) }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  ‹
                </button>

                {Array.from({ length: recruiterTotalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === recruiterTotalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, recruiterTotalPages))}
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
      {sidebar.candidates && (
        <main className="admin-main candidates-main">
          <header className="topbar">
            <div className="topbar-spacer" />
            <div className="user-menu">
              <div className="user-avatar">A</div>
              <span className="user-name">Admin</span>
            </div>
          </header>

          <section className="candidates-content">
            <div className="candidates-header">
              <div className="candidates-title-wrap">
                <h1>Candidates</h1>
                <p>Manage all registered candidates.</p>
              </div>

              
            </div>

            <div className="candidates-table-wrap">
              <table className="candidates-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    <th>Applications</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCandidates.map((candidate,index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td className="candidate-name-cell">
                        <span className={`candidate-avatar ${candidate.tone}`}>{candidate.candidate.user.username.charAt(0).toUpperCase()}</span>
                        <span>{candidate.candidate.user.username}</span>
                      </td>
                      <td>{candidate.candidate.user.email}</td>
                      <td>{candidate.candidate.city}</td>
                      <td>{candidate.candidate.experience}</td>
                      <td>
                        <div className="skills-cell">
                          {candidate.candidate.skills.split(",").map((skill) => (
                            <span key={skill.trim()} className="skill-badge">{skill.trim()}</span>
                          ))}
                        </div>
                      </td>
                      <td>{candidate.totalapplicants}</td>

                      <td className="action-td">
                        <button className="icon-btn delete" onClick={() => { deleteuserhandle(candidate.candidate.user.id) }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  ‹
                </button>

                {Array.from({ length: candidateTotalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === candidateTotalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, candidateTotalPages))}
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
      {sidebar.jobs && (
        <main className="admin-main jobs-main">
          <header className="topbar">
            <div className="topbar-spacer" />
            <div className="user-menu">
              <div className="user-avatar">A</div>
              <span className="user-name">Admin</span>
            </div>
          </header>

          <section className="jobs-content">
            <div className="jobs-header">
              <div className="jobs-title-wrap">
                <h1>Jobs</h1>
                <p>Manage all posted jobs.</p>
              </div>

              
            </div>

            <div className="jobs-table-wrap">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Job Type</th>
                    <th>Location</th>
                    <th>Applications</th>
                    <th>Status</th>
                    <th>Posted Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentJobs.map((job,index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td className="job-title-cell">{job.jobs.role}</td>
                      <td className="company-name-cell">
                        <span className={`company-logo ${job.companyTone}`}>{job.jobs.employer.companyname.charAt(0).toUpperCase()}</span>
                        <span>{job.jobs.employer.companyname}</span>
                      </td>
                      <td>
                        <span className="job-type-badge">{job.jobs.jobtype}</span>
                      </td>
                      <td>{job.jobs.location}</td>
                      <td>{job.totalapplicants}</td>
                      <td>
                        <span className={`table-status status-${job.jobs.status.toLowerCase().trim().replace(/\s+/g, '-')}`}>{job.jobs.status}</span>
                      </td>
                      <td>{new Date(job.jobs.appliedAt).toLocaleDateString()}</td>
                      <td className="action-td">
                        <button className="icon-btn delete" onClick={() => { deletejobhandle(job.jobs.id) }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  ‹
                </button>

                {Array.from({ length: jobsTotalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === jobsTotalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, jobsTotalPages))}
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
      {sidebar.applications && (
        <main className="admin-main applications-main">
          <header className="topbar">
            <div className="topbar-spacer" />
            <div className="user-menu">
              <div className="user-avatar">A</div>
              <span className="user-name">Admin</span>
            </div>
          </header>

          <section className="applications-content">
            <div className="applications-header">
              <div className="applications-title-wrap">
                <h1>Applications</h1>
                <p>View and manage all job applications.</p>
              </div>

              
            </div>

            <div className="applications-table-wrap">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.map((application,index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td className="candidate-name-cell">
                        <span className={`candidate-avatar ${application.tone}`}>{application.user.username.charAt(0).toUpperCase()}</span>
                        <div className="candidate-meta">
                          <span>{application.user.username}</span>
                          <small>{application.user.email}</small>
                        </div>
                      </td>
                      <td>{application.jobs.role}</td>
                      <td className="company-name-cell">
                        <span className={`company-logo ${application.tone}`}>{application.jobs.employer.companyname.charAt(0).toUpperCase()}</span>
                        <span>{application.jobs.employer.companyname}</span>
                      </td>
                      <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`table-status status-${application.status.toLowerCase().replace(/\s+/g, '-')}`}>{application.status}</span>
                      </td>
                      <td className="action-td">
                        <button className="icon-btn delete" onClick={() => { deleteapplicanthandle(application.id) }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  ‹
                </button>

                {Array.from({ length: applicationsTotalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="page-arrow"
                  type="button"
                  disabled={currentPage === applicationsTotalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, applicationsTotalPages))}
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default Admin;