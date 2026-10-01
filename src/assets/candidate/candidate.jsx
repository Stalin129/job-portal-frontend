import "./candidate.css";
import api from "../axiosInstance/AxiosInstance";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Candidate() {

    const [applications, setApplications] = useState([]);
    const [joblist, setJoblist] = useState([]);
    const [searchJob, setSearchJob] = useState("");
    const [jobOption, setJobOption] = useState([]);
    const [locationOption, setLocationOption] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [location, setLocation] = useState("");
    const [dashboardData, setDashboardData] = useState(true);
    const [findJobsData, setFindJobsData] = useState(false);
    const [applicationsData, setApplicationsData] = useState(false);
    const [profileData, setProfileData] = useState(false);
    const [settingsData, setSettingsData] = useState(false);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [showModal, setShowModal] = useState(false);
    const [modalJob, setModalJob] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [totalJob, setTotaljob] = useState(0);
    const [editpage, setEditepage] = useState(false)
    const [nextJob, setNextJob] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;
    const [verify, setVerify] = useState(false);
    const [poppassword, setPoppassword] = useState(false);
    const [popusername, setPopusername] = useState(false);
    const [popemail, setPopemail] = useState(false);
    const [popuppassword, setPopuppassword] = useState(false);
    const [popdelete, setPopdelete] = useState(false);
    const [displaydata, setDisplaydata] = useState("");
    const [resumeUrl, setResumeUrl] = useState(null);
    const [profilecheck, setProfilecheck] = useState(false);
    const [selected, setSelected] = useState("0");
    const [underreview, setUnderreview] = useState("0");
    const [rejected, setRejected] = useState("0");
    const [userdata, setUserdata] = useState({
        username: localStorage.getItem("username"),
        updatename: "",
        email: "",
        password: "",
        confirmpassword: ""
    });
    const userupdate = async () => {
        console.log(userdata)
        if (userdata.password !== userdata.confirmpassword) {
            alert("Passwords do not match!")
            return;
        }
        const currentdata = {
            username: userdata.username,
            updatename: userdata.updatename,
            email: userdata.email,
            password: userdata.password
        }

        try {
            const res = await api.post("/auth/userdataupdate", currentdata
            ); alert(res.data)

            if (res.data == "Succesfully Updated") {
                settingDisplay("");
                if (currentdata.updatename != "") {
                    localStorage.setItem("username", currentdata.updatename);
                }
                else if (currentdata.email != "") {
                    localStorage.setItem("email", currentdata.email);
                }
                setUserdata({
                    username: localStorage.getItem("username"),
                    updatename: "",
                    email: "",
                    password: "",
                    confirmpassword: ""
                })
            }
        }
        catch (error) {
            alert(error)
        }
    };
    const [verifydata, setVerifydata] = useState({
        password: ""
    })
    const sendverify = async () => {
        const data = {
            username: localStorage.getItem("username"),
            password: verifydata.password
        }
        try {
            const res = await api.post("/auth/accountverifying", data

            );
            if (res.data == "Verified") {
                alert("Verified")
                settingDisplay(displaydata);
            }

        } catch (error) {
            alert("Not Verified")
        }
    };

    const editbutton = () => {
        setEditepage(true)
    }
    const [candidateinfo, setCandidateinfo] = useState({
        user: {
            id: localStorage.getItem("userId"),
        }
        ,
        fullname: "",
        phone: "",
        gender: "",
        city: "",
        religion: "",
        skills: "",
        education: "",
        experience: "",
        preferredrole: "",
        cgpa: "",
    })
    const [editInfo, setEditInfo] = useState(candidateinfo);
    const [resumeFile, setResumeFile] = useState(null);
    const getcandidateinfo = async () => {
        try {
            const res = await api.get(`/auth/getcandidateinfo/${localStorage.getItem("userId")}`
            );
            console.log(res.data);
            setCandidateinfo(res.data);
            setEditInfo(res.data);

        }
        catch (error) {
            console.error("Error fetching candidate info:", error.response.data);
            setProfilecheck(true);
        }
    }
    const getResume = async () => {

        try {

            const response = await api.get(
                `/auth/getresume/${localStorage.getItem("userId")}`,
                {
                    responseType: "blob"
                }
            );

            const url = URL.createObjectURL(response.data);

            setResumeUrl(url);

        } catch (error) {

            console.error("Error getting resume:", error);

        }
    };


    const profileUpdate = async () => {

        try {
            const res = await api.post("/auth/candidateupdate", editInfo
            );
            setCandidateinfo(res.data);
            const resumeFormData = new FormData();
            if (resumeFile) {
                resumeFormData.append("resume", resumeFile);
                const resumeResponse = await api.post(`/auth/candidateupdateresume/${localStorage.getItem("userId")}`, resumeFormData);
                console.log("Resume uploaded successfully:", resumeResponse.data);

            }
            getResume();

        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }
    const [applyJob, setApplyJob] = useState({
        user: {
            id: localStorage.getItem("userId"),
        },
        jobs: {
            id: "",
        },
        resume: "url",
        status: "applied"
    });


    const filteredJobs = jobOption.filter((job) =>
        job.role.toLowerCase().includes(searchJob.toLowerCase())
    );

    useEffect(() => {

        dashboardjob();
        getcandidateinfo();
    }, []);
    const dashboardjob = async () => {
        try {
            const res = await api.post(`/auth/userapplications/${localStorage.getItem("username")}`
            );
            if (res.data.length === 0) {
                setApplications([{ role: "No applications found", companyname: "", status: "", appliedAt: "" }]);
                setTotaljob(0);
            } else {
                setApplications(res.data);
                setTotaljob(res.data.length);
                console.log(res.data)
                const selectedcount = res.data.filter(data => data.status === "Selected").length;
                setSelected(selectedcount);
                const underreviewcount = res.data.filter(data => data.status === "Under Review").length;
                setUnderreview(underreviewcount);
                const rejectedcount = res.data.filter(data => data.status === "Rejected").length;
                setRejected(rejectedcount);

            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    }
    const findJobs = async () => {
        try {
            const res = await api.get("/auth/joblist"

            )
            console.log(res.data)
            setJoblist(res.data)
            setJobOption(
                res.data
                    .filter(
                        (job, index, self) =>
                            index ===
                            self.findIndex(
                                (j) =>
                                    j.job.role.toLowerCase() === job.job.role.toLowerCase()
                            )
                    )
                    .map((job) => ({
                        id: job.job.id,
                        role: job.job.role
                    }))
            );
            setLocationOption(
                res.data
                    .filter(
                        (job, index, self) =>
                            index ===
                            self.findIndex(
                                (j) =>
                                    j.job.location.toLowerCase() === job.job.location.toLowerCase()
                            )
                    )
                    .map((job) => ({
                        id: job.job.id,
                        location: job.job.location
                    }))
            );
        }
        catch (error) {
            console.error("Error fetching job list:", error);
        }
    }
    const startIndex = (currentPage - 1) * jobsPerPage;

    const currentJobs = joblist.slice(
        startIndex,
        startIndex + jobsPerPage
    );

    const display = async (data) => {
        setActiveMenu(data);
        setDashboardData(false);
        setFindJobsData(false);
        setApplicationsData(false);
        setProfileData(false);
        setSettingsData(false);
        switch (data) {
            case "dashboard":
                setDashboardData(true);
                dashboardjob();
                break;
            case "findjobs":
                setFindJobsData(true);
                findJobs();

                break;
            case "applications":
                setApplicationsData(true);
                dashboardjob();
                break;
            case "profile":
                setProfileData(true);
                getcandidateinfo();
                getResume();
                break;
            case "settings":
                setSettingsData(true);
                break;
            default:
                break;
        }
    }
    const openModal = (item, type = 'job') => {
        setModalJob(item);
        setModalType(type);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setModalJob(null);
    }
    // prevent background scrolling when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = '' };
    }, [showModal]);
    const handleSearch = async () => {
        console.log(location)
        try {
            const res = await api.get(`/auth/searchjob/${searchJob}/${location}`

            )
            setJoblist([])
            setJoblist(res.data)
        } catch (error) {
            setJoblist([])
            console.log(error.response?.data || error.message);

        }



    }

   
    const joblistMatches = modalJob
        ? joblist.filter((j) => j.role && modalJob.role && j.role.toLowerCase() === modalJob.role.toLowerCase())
        : [];

    const handleApply = (jobId) => {
        setApplyJob((prev) => ({
            ...prev,
            jobs: {
                id: jobId
            },

        }));

    }
    useEffect(() => {
        const applyJobToServer = async () => {
            try {
                const res = await api.post("/auth/jobApplication", applyJob

                ).then((response) => {
                    console.log("Job applied successfully:", response.data);
                    if (response.data == "Applied") {
                        alert("Job applied successfully!");
                        dashboardjob();
                    }
                    else {
                        alert(response.data);
                    }

                });

            } catch (error) {
                console.error("Error applying for job:", error.response?.data || error.message);
            }
        };

        if (applyJob.jobs.id) {
            applyJobToServer();
        }
    }, [applyJob]);


    const deletejob = async (jobId) => {
        console.log("Deleting job with ID:", jobId);
        try {
            const res = await api.delete(`/auth/deleteappliedjob/${jobId}`

            );
            alert(res.data);
            dashboardjob();
        } catch (error) {
            console.error("Error deleting job:", error.response?.data || error.message);
        }
    };

    const settingDisplay = (data) => {
        setPopusername(false);
        setPopemail(false);
        setPopuppassword(false);
        setPopdelete(false);
        setPopdelete(false);
        switch (data) {
            case "username":
                setPopusername(true)
                break;
            case "email":
                setPopemail(true);
                break;
            case "password":
                setPopuppassword(true);
                break;
            case "delete":
                setPopdelete(true);
                break;
        }
    }

    const deleteAccount = async () => {
        try {
            const res = await api.delete(`/auth/delete_user/${localStorage.getItem("userId")}`

            );
            alert(res.data);
            navigate("/");
        } catch (error) {
            alert(alert);
        }
    }
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
    }

    return (
        <div className="candidate-page">

            {/* Sidebar */}
            <aside className="side-bar">
                <h1>JobPortal</h1>

                <div className="side-bar-menu">
                    <h2 className={activeMenu === "dashboard" ? "active" : ""} onClick={() => display("dashboard")}>Dashboard</h2>
                    <h2 className={activeMenu === "findjobs" ? "active" : ""} onClick={() => display("findjobs")}>Find Jobs</h2>
                    <h2 className={activeMenu === "applications" ? "active" : ""} onClick={() => display("applications")}>Applications</h2>
                    <h2 className={activeMenu === "profile" ? "active" : ""} onClick={() => display("profile")}>Profile</h2>
                    <h2 className={activeMenu === "settings" ? "active" : ""} onClick={() => display("settings")}>Settings</h2>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">

                {/* Top */}


                {dashboardData && (
                    <div className="dashboard-page">
                        <div className="top">
                            <p>Dashboard</p>
                            <p>Hello, {localStorage.getItem("username")}!</p>
                        </div>
                        <div className="middle-inner">

                            <div className="stat-card">
                                <p>Applied</p>
                                <h2>{totalJob}</h2>
                            </div>

                            <div className="stat-card">
                                <p>Review</p>
                                <h2>{underreview}</h2>
                            </div>

                            <div className="stat-card">
                                <p>Selected</p>
                                <h2>{selected}</h2>
                            </div>

                        </div>


                        <div className="recent-applications">
                            <h3>Recent Applications</h3>

                            <div>
                                {applications.map((application, index) => (
                                    <div key={index} className="application-card" onClick={() => openModal(application, 'application')} style={{ cursor: 'pointer' }}>

                                        <div>
                                            <h4>{application.role}</h4>
                                            <p>{application.companyname}</p>
                                        </div>

                                        {application.status && (
                                            <div>
                                                <p className={`candidate-action ${application.status.toLowerCase().trim().replace(/\s+/g, '-')}`}>{application.status}</p>
                                                <p>{application.appliedAt}</p>
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {findJobsData && (
                    <div className="find-jobs-page">
                        <div className="top">
                            <h1>Find Your Dream Job 🔍</h1>
                            <div className="profile-section">
                                <span>🔔</span>
                                <span className="profile-icon">👤</span>
                                <span>Profile</span>
                            </div>

                        </div>



                        <div className="find-jobs-content">

                            {/* Search inputs */}
                            <div className="search-container">

                                <div className="search-input">
                                    <span>🔍</span>

                                    <input
                                        type="text"
                                        placeholder="Search jobs..."
                                        value={searchJob}
                                        onChange={(e) => {
                                            setSearchJob(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                    />

                                    {showSuggestions && searchJob && (
                                        <div className="search-suggestions">
                                            {filteredJobs.length > 0 ? (
                                                filteredJobs.map((job) => (
                                                    <div
                                                        key={job.id}
                                                        className="suggestion-item"
                                                        onClick={() => {
                                                            setSearchJob(job.role);
                                                            setShowSuggestions(false);
                                                        }}
                                                    >
                                                        {job.role}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="suggestion-item">
                                                    No matching jobs
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="location-input">
                                    <span>📍</span>

                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    >
                                        <option value="">Select Location</option>
                                        {locationOption.map((loc) => (
                                            <option key={loc.id} value={loc.location}>
                                                {loc.location}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="search-buttons">
                                <button className="search-btn" onClick={() => { handleSearch(); setNextJob(false); }}>
                                    Search
                                </button>

                                <button onClick={() => { display("findjobs"); setNextJob(true); }} className="clear-btn">
                                    Clear Filters
                                </button>
                            </div>

                            {/* Available Jobs */}
                            <div className="jobs-title">
                                <h2>Available Jobs</h2>
                                <p>{joblist.length} jobs found</p>
                            </div>

                            {joblist.length === 0 && (
                                <div className="no-jobs">
                                    <div className="no-jobs-icon">🔍</div>
                                    <h2>No Jobs Found</h2>
                                    <p>Try changing your search or location.</p>
                                </div>
                            )}

                            {/* Job Cards */}
                            <div className="jobs-list">

                                {currentJobs.map((job) => (
                                    <div key={job.job.id} className="job-card">

                                        <div className="job-top">

                                            <div>
                                                <h2>{job.job.role}</h2>

                                                <p>
                                                    <span className="company">{job.job.employer.companyname}</span>
                                                    {" • "}
                                                    {job.job.location}
                                                </p>
                                            </div>
                                        <div className="jobstatus">
                                            <span className="job-type">
                                                {job.job.jobtype}
                                            </span>
                                            <span className={(job.job.status==="Active")?"status-active":"status"}>
                                                {job.job.status}
                                            </span>
                                        </div>
                                        </div>

                                        <p className="skills">
                                            {job.job.skills}
                                        </p>

                                        <div className="job-bottom">

                                            <h3>{job.job.salary}</h3>

                                            <div className="job-buttons">

                                                <button className="view-btn" onClick={() => openModal(job, 'job')}>
                                                    View Job
                                                </button>

                                                <button
                                                    className={
                                                        applications.some((application) => application.id === job.job.id)
                                                            ? "apply-btn applied-btn"
                                                            : (["Closed","Draft"].includes(job.job.status))?"closed-btn":"apply-btn"
                                                    }
                                                    onClick={() => handleApply(job.job.id)}
                                                    disabled={["Closed","Draft"].includes(job.job.status)||applications.some((application) => application.id === job.job.id)} 
                                                >

                                                    {applications.some((application) => application.id === job.job.id)
                                                        ? "✓ Applied"
                                                        : (job.job.status!="Active")?job.job.status:"Apply Now"}
                                                </button>

                                            </div>

                                        </div>

                                    </div>))}
                                {nextJob && <div className="pagination">

                                    {currentPage > 1 && <button
                                        onClick={() => setCurrentPage(currentPage - 1)}

                                    >
                                        {currentPage - 1} Previous
                                    </button>}
                                    {currentPage * jobsPerPage < joblist.length && (<button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next {currentPage}
                                    </button>)}


                                </div>}

                            </div>

                        </div>

                    </div>
                )}
                {applicationsData && (
                    <div className="applications-page">

                        <div className="applications-title">
                            <div>
                                <h1>My Applications</h1>
                                <p>Track and manage your job applications</p>
                            </div>
                        </div>

                        <div className="application-summary">

                            <div className="summary-card">
                                <p>Total Applied</p>
                                <h2>{totalJob}</h2>
                            </div>

                            <div className="summary-card review">
                                <p>Under Review</p>
                                <h2>{underreview}</h2>
                            </div>

                            <div className="summary-card selected">
                                <p>Selected</p>
                                <h2>{selected}</h2>
                            </div>

                            <div className="summary-card rejected">
                                <p>Rejected</p>
                                <h2>{rejected}</h2>
                            </div>

                        </div>


                        <div className="applications-list">
                            {applications.map((application, index) => (

                                <div className="application-job-card" key={index}>

                                    <div className="application-job-info">
                                        <h2>{application.role}</h2>
                                        {application.companyname && (
                                            <p className="company-name">{application.companyname}</p>
                                        )}
                                        {application.location && (
                                            <p className="job-location">📍 {application.location}</p>
                                        )}

                                        <div className="skills">
                                            {application.skills?.split(",").map((skill, index) => (
                                                <span key={index} className="skill-tag">{skill.trim()}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {application.status && (
                                        <div className="application-status">
                                            <span className={`candidate-action ${application.status.toLowerCase().trim().replace(/\s+/g, '-')}`}>{application.status}</span>
                                            <p>Applied on {application.appliedAt}</p>
                                            <button onClick={() => openModal(application, 'application')}>View Job</button>
                                            <button className="delete-job" onClick={() => { deletejob(application.userjobid) }}>Delete Job</button>
                                        </div>
                                    )}

                                </div>))}



                        </div>

                    </div>
                )}
                {profileData && (



                    <div className="profile-page">
                        {editpage && (
                            <div className="modal-overlay" onClick={() => setEditepage(false)}>
                                <div className="modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <div className="modal-title">
                                            <h2>Edit Profile</h2>
                                            <p className="muted">Update your personal and professional details</p>
                                        </div>
                                        <button className="modal-close" onClick={() => setEditepage(false)}>✕</button>
                                    </div>

                                    <div className="modal-body">
                                        <div className="modal-left">
                                            <form className="modal-form" onSubmit={(e) => { e.preventDefault(); profileUpdate(); setEditepage(false); }}>
                                                <div className="form-row">
                                                    <label>Full Name:</label>
                                                    <div className="field">
                                                        <input value={editInfo.fullname} placeholder="Enter full name" onChange={(e) => setEditInfo({ ...editInfo, fullname: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>Phone Number:</label>
                                                    <div className="field">
                                                        <input type="tel" value={editInfo.phone} placeholder="Enter phone number" onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>Gender:</label>
                                                    <div className="field">
                                                        <select value={editInfo.gender} onChange={(e) => setEditInfo({ ...editInfo, gender: e.target.value })}>
                                                            <option value="">Select</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>City:</label>
                                                    <div className="field">
                                                        <input value={editInfo.city} placeholder="Enter city" onChange={(e) => setEditInfo({ ...editInfo, city: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>Religion:</label>
                                                    <div className="field">
                                                        <input value={editInfo.religion} placeholder="Enter religion" onChange={(e) => setEditInfo({ ...editInfo, religion: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>Upload Resume:</label>
                                                    <div className="field">
                                                        <input type="file" accept=".pdf,.doc,.docx"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    setResumeFile(file);
                                                                    console.log("Selected file:", file);
                                                                }
                                                            }} />
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>Skills:</label>
                                                    <div className="field">
                                                        <input value={editInfo.skills} placeholder="Enter skills (comma separated)" onChange={(e) => setEditInfo({ ...editInfo, skills: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>Education:</label>
                                                    <div className="field">
                                                        <input value={editInfo.education} placeholder="Enter education" onChange={(e) => setEditInfo({ ...editInfo, education: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <label>CGPA:</label>
                                                    <div className="field">
                                                        <input value={editInfo.cgpa} placeholder="Enter CGPA" onChange={(e) => setEditInfo({ ...editInfo, cgpa: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>Experience:</label>
                                                    <div className="field">
                                                        <input value={editInfo.experience} placeholder="Enter experience" onChange={(e) => setEditInfo({ ...editInfo, experience: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <label>Preferred role:</label>
                                                    <div className="field">
                                                        <input value={editInfo.preferredrole} placeholder="Enter preferred role" onChange={(e) => setEditInfo({ ...editInfo, preferredrole: e.target.value })} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <div className="modal-right">
                                            <div className="apply-card">
                                                <h4>Profile Preview</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: 56, height: 56, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#3148b7' }}>{localStorage.getItem("username")?.charAt(0)?.toUpperCase()}</div>
                                                    <div>
                                                        <strong>{editInfo.fullname || localStorage.getItem("username")}</strong>
                                                        <div className="muted">{editInfo.city}</div>
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: 12 }}>
                                                    <div className="modal-section">
                                                        <h4>Skills</h4>
                                                        <div className="tags">{(editInfo.skills || "").split(",").filter(Boolean).map((s, idx) => <span key={idx} className="tag">{s.trim()}</span>)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setEditepage(false)}>Exit</button>
                                        <button type="button" className="btn btn-primary" onClick={() => { profileUpdate(); setEditepage(false); }}>Save</button>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div className="profile-header">
                            <div>
                                <h1>My Profile</h1>
                                <p>Manage your personal and professional information</p>
                            </div>

                            <button className="edit-profile-btn" onClick={() => { editbutton() }}>
                                Edit Profile
                            </button>
                        </div>

                        <div className="profile-container">

                            {/* Profile summary */}
                            <div className="profile-card profile-summary">

                                <div className="profile-avatar">
                                    {localStorage.getItem("username")?.charAt(0)?.toUpperCase()}
                                </div>

                                <div className="profile-user-info">
                                    <h2>{localStorage.getItem("username")}</h2>
                                    <p>{localStorage.getItem("email")}</p>
                                    <span>{localStorage.getItem("role")}</span>
                                </div>

                            </div>


                            {/* Personal Information */}
                            <div className="profile-card">

                                <h2 className="profile-section-title">
                                    Personal Information
                                </h2>

                                <div className="profile-grid">

                                    <div className="profile-field">
                                        <span>Full Name</span>
                                        <p>{candidateinfo.fullname || "Not added"}</p>
                                    </div>

                                    <div className="profile-field">
                                        <span>Email Address</span>
                                        <p>{localStorage.getItem("email") || "Not added"}</p>
                                    </div>

                                    <div className="profile-field">
                                        <span>Phone Number</span>
                                        <p>{candidateinfo.phone || "Not added"}</p>
                                    </div>

                                    <div className="profile-field">
                                        <span>City</span>
                                        <p>{candidateinfo.city || "Not added"}</p>
                                    </div>
                                    <div className="profile-field">
                                        <span>Gender</span>
                                        <p>{candidateinfo.gender || "Not added"}</p>
                                    </div>
                                    <div className="profile-field">
                                        <span>Religion</span>
                                        <p>{candidateinfo.religion || "Not added"}</p>
                                    </div>

                                </div>

                            </div>


                            {/* Professional Information */}
                            <div className="profile-card">

                                <h2 className="profile-section-title">
                                    Professional Information
                                </h2>

                                <div className="profile-grid">

                                    <div className="profile-field">
                                        <span>Experience</span>
                                        <p>{candidateinfo.experience || "Not added"}</p>
                                    </div>

                                    <div className="profile-field">
                                        <span>Preferred Role</span>
                                        <p>{candidateinfo.preferredrole || "Not added"}</p>
                                    </div>

                                </div>
                                <div className="profile-grid">
                                    <div className="profile-field skills-field">
                                        <span>Skills</span>

                                        <div className="skills-list">
                                            <p>{candidateinfo.skills || "Not added"}</p>
                                        </div>
                                    </div>
                                    <div className="profile-field skills-field">
                                        <span>Resume</span>
                                        {resumeUrl ? (
                                            <a
                                                href={resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Resume
                                            </a>
                                        ) : (
                                            <p>Not added</p>
                                        )}
                                    </div>
                                    <div className="profile-field">
                                        <span>Education</span>
                                        <p>{candidateinfo.education || "Not added"}</p>
                                    </div>
                                    <div className="profile-field">
                                        <span>CGPA</span>
                                        <p>{candidateinfo.cgpa || "Not added"}</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                )}
                {settingsData && (
                    <div className="settings-page">

                        {poppassword &&
                            <div className="settings-verification-overlay">
                                <div className="settings-verification">
                                    <div className="settings-verification-header">
                                        <span>⚙️</span>
                                        <p>Change settings</p>
                                    </div>
                                    {poppassword && <div className="settings-verification-body">
                                        <p className="settings-verification-close" onClick={() => { setPoppassword(false); setVerifydata({ ...verifydata, password: "" }) }}>×</p>
                                        <span>Password</span>
                                        <input type="password" value={verifydata.password} onChange={(e) => setVerifydata({ ...verifydata, password: e.target.value })} />
                                        <button onClick={() => { sendverify(); setPoppassword(false); setVerifydata({ ...verifydata, password: "" }) }}>Verify</button>

                                    </div>}

                                </div>

                            </div>}
                        <div>
                            {popusername && <div className="settings-verification-overlay">
                                <div className="settings-verification">
                                    <div className="settings-verification-body">
                                        <p className="settings-verification-close" onClick={() => { setPopusername(false) }}>×</p>
                                        <span>Change Username</span>
                                        <input onChange={(e) => { setUserdata({ ...userdata, updatename: e.target.value }) }} />
                                        <button onClick={() => { userupdate() }}>Confirm</button>
                                    </div>
                                </div>
                            </div>}
                            {popemail && <div className="settings-verification-overlay">
                                <div className="settings-verification">
                                    <div className="settings-verification-body">
                                        <p className="settings-verification-close" onClick={() => { setPopemail(false) }}>×</p>
                                        <span>Change Email</span>
                                        <input type="email" onChange={(e) => { setUserdata({ ...userdata, email: e.target.value }) }} />
                                        <button onClick={() => { userupdate() }}>Confirm</button>
                                    </div>
                                </div>
                            </div>}
                            {popuppassword && <div className="settings-verification-overlay">
                                <div className="settings-verification">
                                    <div className="settings-verification-body">
                                        <p className="settings-verification-close" onClick={() => { setPopuppassword(false) }}>×</p>
                                        <span>Password</span>
                                        <input type="password" onChange={(e) => { setUserdata({ ...userdata, password: e.target.value }) }} />
                                        <span>Confirm Password</span>
                                        <input type="password" onChange={(e) => { setUserdata({ ...userdata, confirmpassword: e.target.value }) }} />
                                        <button onClick={() => { userupdate() }}>Confirm</button>
                                    </div>
                                </div>
                            </div>}

                        </div>

                        <div className="settings-header">
                            <div>
                                <h1>Settings</h1>
                                <p>Manage your account and preferences</p>
                            </div>
                        </div>


                        {/* Account Settings */}
                        <div className="settings-card">

                            <h2 className="settings-section-title">
                                Account Settings
                            </h2>

                            <div className="settings-row">
                                <div>
                                    <h3>Username</h3>
                                    <p>{localStorage.getItem("username")}</p>
                                </div>

                                <button className="settings-btn" onClick={() => { setPoppassword(true); setDisplaydata("username") }}>
                                    Edit
                                </button>
                            </div>

                            <div className="settings-row">
                                <div>
                                    <h3>Email Address</h3>
                                    <p>{localStorage.getItem("email")}</p>
                                </div>

                                <button className="settings-btn" onClick={() => { setPoppassword(true); setDisplaydata("email") }}>
                                    Change
                                </button>
                            </div>

                        </div>


                        {/* Password */}
                        <div className="settings-card">

                            <h2 className="settings-section-title">
                                Security
                            </h2>

                            <div className="settings-row">
                                <div>
                                    <h3>Password</h3>
                                    <p>Change your account password regularly.</p>
                                </div>

                                <button className="settings-btn" onClick={() => { setPoppassword(true); setDisplaydata("password") }}>
                                    Change Password
                                </button>
                            </div>

                        </div>


                        {/* Notifications */}
                        <div className="settings-card">

                            <h2 className="settings-section-title">
                                Notifications
                            </h2>

                            <div className="settings-row">
                                <div>
                                    <h3>Job Notifications</h3>
                                    <p>Receive notifications about new job opportunities.</p>
                                </div>

                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>


                            <div className="settings-row">
                                <div>
                                    <h3>Application Updates</h3>
                                    <p>Receive updates about your job applications.</p>
                                </div>

                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                        </div>


                        {/* Danger Zone */}
                        <div className="settings-card danger-card">

                            <h2 className="settings-section-title danger-title">
                                Danger Zone
                            </h2>

                            <div className="settings-row">
                                <div>
                                    <h3>Delete Account</h3>
                                    <p>
                                        Permanently delete your account and all associated data.
                                    </p>
                                </div>

                                <button className="delete-btn" onClick={() => { setPoppassword(true); setDisplaydata("delete") }}>
                                    Delete Account
                                </button>
                                <button onClick={logout} >Logout</button>

                                {popdelete && <div className="delete-overlay">
                                    <p>×</p>
                                    <button className="delete-verification" onClick={() => { setPopdelete(false); deleteAccount() }}>Confirm to delete</button>
                                </div>
                                }

                            </div>

                        </div>

                    </div>
                )}

            </main>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Job details">
                        <header className="modal-header">
                            <div className="modal-title">
                                <h2>{modalJob?.role||modalJob.job.role}</h2>
                                <p className="modal-company">{modalJob?.companyname||modalJob?.job.companyname }</p>
                                <h5>{modalJob?.jobdescribtion||modalJob.job.jobdescribtion}</h5>
                                <div className="modal-meta">
                                    <span className="meta-location">{modalJob?.location||modalJob.job.location}</span>
                                </div>
                            </div>
                            <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
                        </header>

                        <div className="modal-body">
                            <section className="modal-left">
                                {modalJob?.skills && (
                                    <div className="modal-section">
                                        <h4>Skills</h4>
                                        <div className="tags">
                                            {Array.isArray(modalJob.skills) ? modalJob.skills.map((s, i) => (
                                                <span className="tag" key={i}>{s}</span>
                                            )) : <span className="tag">{modalJob.skills}</span>}
                                        </div>
                                    </div>
                                )}

                                <div className="modal-section">
                                    <h4>Details</h4>
                                    <ul className="details-list">
                                        {(modalJob?.job?.salary||modalJob?.salary )&& (<li><strong>Salary:</strong> <span>{modalJob?.job?.salary||modalJob?.salary}</span></li>)}
                                        {(modalJob?.job?.jobtype||modalJob?.type) && (<li><strong>Type:</strong> <span>{modalJob?.job?.jobtype||modalJob?.type}</span></li>)}
                                    </ul>
                                </div>

                                {modalType === 'application' && (
                                    <div className="modal-section">
                                        <h4>Application Notes</h4>
                                        <p className="muted">Status: {modalJob.status ||modalJob.job.status || 'N/A'}</p>
                                    </div>
                                )}
                            </section>

                            <aside className="modal-right">
                                {modalType === 'job' ? (
                                    <div>
                                        <div className="apply-card">
                                            <div className="apply-salary">{modalJob?.job.salary || '—'}</div>
                                            <div className="apply-type">{modalJob?.job.jobtype || '—'}</div>
                                            <button
                                                className={
                                                        applications.some((application) => application.id === modalJob.job.id)
                                                            ? "apply-btn applied-btn"
                                                            : (["Closed","Draft"].includes(modalJob.job.status))?"closed-btn":"apply-btn"
                                                    }
                                                onClick={() => handleApply(modalJob.job.id)}
                                                disabled={["Closed","Draft"].includes(modalJob.job.status)||applications.some((application) => application.id === modalJob.job.id)}
                                            >
                                            
                                                {applications.some((application) => application.id === modalJob.job.id)
                                                        ? "✓ Applied"
                                                        : (modalJob.job.status!="Active")?modalJob.job.status:"Apply Now"}
                                            </button>

                                        </div>


                                    </div>
                                ) : (
                                    <div className="apply-card">
                                        <div className="apply-salary">{modalJob?.salary || '—'}</div>
                                        <div className="apply-type muted">Applied on: {modalJob?.appliedAt || '—'}</div>
                                        <div style={{ marginTop: 12 }}>
                                            <strong>Status:</strong> <span className="muted">{modalJob?.status || 'N/A'}</span>
                                        </div>
                                    </div>
                                )}
                            </aside>
                        </div>
                    </div>
                </div>
            )}

            {profilecheck && (

                <div className="modal-overlay" >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <h2>Share your Profile</h2>
                                <p className="muted">Share your personal and professional details</p>
                            </div>

                        </div>

                        <div className="modal-body">
                            <div className="modal-left">
                                <form className="modal-form" onSubmit={(e) => { e.preventDefault(); profileUpdate(); setProfilecheck(false); }}>
                                    <div className="form-row">
                                        <label>Full Name:</label>
                                        <div className="field"  >
                                            <input required placeholder="Enter full name" onChange={(e) => setEditInfo({ ...editInfo, fullname: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>Phone Number:</label>
                                        <div className="field">
                                            <input type="tel" required placeholder="Enter phone number" onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>Gender:</label>
                                        <div className="field">
                                            <select required onChange={(e) => setEditInfo({ ...editInfo, gender: e.target.value })}>
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>City:</label>
                                        <div className="field">
                                            <input required placeholder="Enter city" onChange={(e) => setEditInfo({ ...editInfo, city: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>Religion:</label>
                                        <div className="field">
                                            <input required placeholder="Enter religion" onChange={(e) => setEditInfo({ ...editInfo, religion: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>Upload Resume:</label>
                                        <div className="field">
                                            <input type="file" required accept=".pdf,.doc,.docx"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setResumeFile(file);
                                                        console.log("Selected file:", file);
                                                    }
                                                }} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>Skills:</label>
                                        <div className="field">
                                            <input placeholder="Enter skills (comma separated)" onChange={(e) => setEditInfo({ ...editInfo, skills: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>Education:</label>
                                        <div className="field">
                                            <input required placeholder="Enter education" onChange={(e) => setEditInfo({ ...editInfo, education: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <label>CGPA:</label>
                                        <div className="field">
                                            <input required placeholder="Enter CGPA" onChange={(e) => setEditInfo({ ...editInfo, cgpa: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>Experience:</label>
                                        <div className="field">
                                            <input required placeholder="Enter experience" onChange={(e) => setEditInfo({ ...editInfo, experience: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <label>Preferred role:</label>
                                        <div className="field">
                                            <input required placeholder="Enter preferred role" onChange={(e) => setEditInfo({ ...editInfo, preferredrole: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary" >Save</button>
                                    </div>
                                </form>
                            </div>

                            <div className="modal-right">
                                <div className="apply-card">
                                    <h4>Profile Preview</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: 56, height: 56, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#3148b7' }}>{localStorage.getItem("username")?.charAt(0)?.toUpperCase()}</div>
                                        <div>
                                            <strong>{editInfo.fullname || localStorage.getItem("username")}</strong>
                                            <div className="muted">{editInfo.city}</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <div className="modal-section">
                                            <h4>Skills</h4>
                                            <div className="tags">{(editInfo.skills || "N/A").split(",").filter(Boolean).map((s, idx) => <span key={idx} className="tag">{s.trim()}</span>)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            )}

        </div>
    );
}

export default Candidate;