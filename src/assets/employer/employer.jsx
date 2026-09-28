import React, { useEffect } from "react";
import "./employer.css";
import { useState } from "react";
import api from "../axiosInstance/AxiosInstance";
import { useNavigate } from "react-router-dom";

function Employer() {
    const username = (typeof window !== "undefined" && localStorage.getItem("username")) || "Zoho";
    const [dashboard, setDashboard] = useState(true);
    const [Postjob, setPostjob] = useState(false);
    const [managejob, setManagejob] = useState(false);
    const [applicant, setApplicant] = useState(false);
    const [profile, setProfile] = useState(false);
    const [setting, setSetting] = useState(false);
    const [employerId, setEmployerId] = useState("");
    const [successfully, setSuccessfully] = useState(false);
    const [successfullydata, setSuccessfullydata] = useState("");
    const [activejob, setActivejob] = useState("0");
    const [poppassword, setPoppassword] = useState(false);
    const [popusername, setPopusername] = useState(false);
    const [popemail, setPopemail] = useState(false);
    const [popuppassword, setPopuppassword] = useState(false);
    const [popdelete, setPopdelete] = useState(false);
    const [displaydata, setDisplaydata] = useState("");
    const [companyname, setCompanyame] = useState("");
    const navigate = useNavigate();
    const roleLabel = "Recruiter";
    const [activeApplicantTab, setActiveApplicantTab] = useState("Candidates");

    const [recruiterList, setRecruiterList] = useState([]);
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
    });

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
    const [userdata, setUserdata] = useState({
        username: localStorage.getItem("username"),
        updatename: "",
        email: "",
        password: "",
        confirmpassword: ""
    })

    const menuItems = [
        { label: "Dashboard", icon: "⌂" },
        { label: "Post Job", icon: "+" },
        { label: "Manage Jobs", icon: "▣" },
        { label: "Applicants", icon: "☰" },
        { label: "Profile", icon: "◔" },
        { label: "Settings", icon: "⚙" },
        { label: "Logout", icon: "↩" },
    ];

    const [recentApplications, setRecentApplications] = useState([]);
    const [applicantPage, setApplicantPage] = useState(1);
    const applicantsPerPage = 5;
    const totalApplicantPages = Math.max(1, Math.ceil(recentApplications.length / applicantsPerPage));
    const applicantStartIndex = (applicantPage - 1) * applicantsPerPage;
    const [applicantdata, setApplicantdata] = useState([]);
    const visibleApplicants = applicantdata.slice(applicantStartIndex, applicantStartIndex + applicantsPerPage);
    const [selected, setSelected] = useState("0");
    const applicanthandle = async () => {
        console.log(employerId);
        try {
            const res = await api.get(`/auth/employerapplicantcandidate/${localStorage.getItem("userId")}`);
            setApplicantdata(res.data);
            const selectedcount = res.data.filter(
                data => data.status?.toLowerCase() === "selected"
            ).length;

            setSelected(selectedcount);
            console.log(res.data);
        } catch (error) {
            console.log(error.response.data);
        }
    }


    const [profileForm, setProfileForm] = useState({
        companyname: "",
        industry: "",
        companysize: "",
        website: "",
        location: "",
        description: "",
        phone: "",
        email: ""
    });
    const [profileError, setProfileError] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const dashboardjobs = async () => {
        try {
            const res = await api.get(`/auth/employerapplicants/${localStorage.getItem("userId")}`);
            setRecentApplications(res.data);

        }
        catch (error) {
            console.log(error.response.data);
        }
    }
    const [profileedit, setProfileedit] = useState(false);
    const [profiledata, setProfiledata] = useState([]);

    const profilehandle = async () => {
        try {
            const res = await api.get(`/auth/getemployer/${localStorage.getItem("userId")}`);
            setProfiledata(res.data);
            setEmployerId(res.data.id);
            setCompanyame(res.data.companyname);
            console.log(res.data);
            setProfileForm({
                companyname: res.data.companyname,
                industry: res.data.industry,
                companysize: res.data.companysize,
                website: res.data.website,
                location: res.data.location,
                description: res.data.description,
                phone: res.data.phone,
                email: res.data.email
            })
        } catch (error) {
            const responseMessage = typeof error?.response?.data === "string" ? error.response.data : "";
            if (responseMessage.toLowerCase().includes("not found")) {
                setProfileedit(true);
            }
            console.log(responseMessage || error);
        }
    }
    const handleProfileInputChange = (event) => {
        const { name, value } = event.target;
        setProfileForm((prev) => ({ ...prev, [name]: value }));
    };
    const saveProfile = async (event) => {
        event.preventDefault();

        if (!profileForm.companyname || !profileForm.industry || !profileForm.companysize || !profileForm.location || !profileForm.description) {
            setProfileError("Please fill in all required fields.");
            return;
        }

        setIsSavingProfile(true);
        setProfileError("");

        const payload = {
            user: {
                id: localStorage.getItem("userId")
            },
            companyname: profileForm.companyname,
            industry: profileForm.industry,
            companysize: profileForm.companysize,
            website: profileForm.website,
            location: profileForm.location,
            description: profileForm.description,
            email: profileForm.email,
            phone: profileForm.phone
        };


        try {
            console.log(payload);
            const res = await api.post("/auth/employer", payload);

            setProfiledata(res.data);
            setEmployerId(res.data.id);
            setProfileedit(false);
            setCompanyame(res.data.companyname);
            console.log(res.data);
            setProfileForm({
                companyname: res.data.companyname,
                industry: res.data.industry,
                companysize: res.data.companysize,
                website: res.data.website,
                location: res.data.location,
                description: res.data.description,
                email: res.data.email,
                phone: res.data.phone
            });
            return;
        } catch (error) {
            console.log(error.response.status);
        }

        setIsSavingProfile(false);
    };
    useEffect(() => {
        dashboardjobs();
        profilehandle();
        getjobhandle();
        applicanthandle();
    }, []);
    const switchcomp = (data) => {
        setDashboard(false);
        setPostjob(false);
        setManagejob(false);
        setApplicant(false);
        setProfile(false);
        setSetting(false);

        switch (data) {
            case "Dashboard":
                setDashboard(true);
                dashboardjobs();
                break;
            case "Post Job":
                setPostjob(true);
                break;
            case "Manage Jobs":
                setManagejob(true);
                getjobhandle();
                break;
            case "Applicants":
                setApplicant(true);
                applicanthandle();
                recruiterhandle();
                break;
            case "Profile":
                setProfile(true);
                break;
            case "Settings":
                setSetting(true);
                break;
            default:
                setDashboard(true);
                logout();
                break;
        }
    };

    const [profileupdate, setProfileupdate] = useState(false);
    const updateProfile = async (e) => {
        e.preventDefault();
        const payload = {
            id: localStorage.getItem("userId"),
            companyname: null,
            industry: profileForm.industry,
            companysize: profileForm.companysize,
            website: profileForm.website,
            location: profileForm.location,
            description: profileForm.description,
            email: profileForm.email,
            phone: profileForm.phone
        };
        console.log(payload);
        try {
            const res = await api.put("/auth/employerupdate", payload);
            profilehandle();
            setProfileupdate(false);
        } catch (error) {
            console.log(error.response);
        }

    }
    const [jobpostdata, setJobpostdata] = useState({
        role: "",
        location: "",
        jobtype: "",
        employementtype: "",
        experience: "",
        salary: "",
        skills: "",
        vacancies: "",
        deadline: "",
        jobdescribtion: ""
    })
    const postjob = async (e) => {
        e.preventDefault();
        const payload = {
            employer: {
                id: Number(employerId)
            },
            ...jobpostdata
        };
        try {
            const res = await api.post("/auth/postjobs", payload);
            if (res.data == "posted") {
                setSuccessfully(true);
                setSuccessfullydata(res.data);
                switchcomp("Manage Jobs");
            }
        } catch (error) {
            setSuccessfully(true);
            setSuccessfullydata(error.response.data);
        }
    }
    const [employerjobs, setEmployerjobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;


    const totalPages = Math.max(1, Math.ceil(employerjobs.length / jobsPerPage));
    const startIndex = (currentPage - 1) * jobsPerPage;
    const visibleJobs = employerjobs.slice(startIndex, startIndex + jobsPerPage);
    const showingStart = employerjobs.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(startIndex + jobsPerPage, employerjobs.length);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const getjobhandle = async () => {
        try {
            const res = await api.get(`/auth/employerjobs/${localStorage.getItem("userId")}`);
            setEmployerjobs(res.data);
            const activeCount = res.data.filter(
                job => job.job.status === "Active"
            ).length;

            setActivejob(activeCount);

            setCurrentPage(1);
            console.log(res.data);
        }
        catch (error) {
            setEmployerjobs([]);
            console.log(error.response.data);
        }

    }
    const [openMenuJobId, setOpenMenuJobId] = useState(null);

    const handleDeleteJob = async (jobId) => {
        const confirmed = window.confirm("Delete this job? This action cannot be undone.");
        if (!confirmed) return;
        try {
            await api.delete(`/auth/deletejob/${jobId}`);
            getjobhandle();
        } catch (error) {
            console.error("Delete job error:", error.response?.data || error.message);
            setEmployerjobs((prev) => prev.filter((j) => String(j.job.id) !== String(jobId)));
        }
        setOpenMenuJobId(null);
    }
    const [candidatepop, setCandidatepop] = useState(false);
    const [candidateinfo, setCandidateinfo] = useState([]);

    const candidatepophandle = async (item) => {
        try {
            const res = await api.get(`/auth/getcandidateinfo/${item.user.id}`);
            setCandidatepop(true);
            setCandidateinfo({
                candidate: res.data,
                job: item
            });
            console.log(candidateinfo);

        } catch (error) {
            console.log(error.response.data)
            alert(error.response.data);
        }
    }


    const statushandle = async (data) => {
        try {
            const res = await api.put(`/auth/jobapplicantstatus/${data.userId}/${data.jobId}/${data.status}`);
            console.log(res.data);
            if (res.data == "Status updated") {
                dashboardjobs();
                applicanthandle();
            }
        }
        catch (error) {
            console.log(error.response.data);
        }
    }


    const [applicantpop, setApplicantpop] = useState(false);
    const applicantpophandle = (item) => {
        setApplicantpop(true);
        setCandidateinfo(item);
    }
    const [recruiterpop, setRecruiterpop] = useState(false);
    const [recruiterinfo, setRecruiterinfo] = useState([]);
    const recruiterpophandle = (item) => {
        setRecruiterpop(true);
        setRecruiterinfo(item);
    }

    const viewResume = () => {
        const base64 = candidateinfo?.candidate?.resume;

        if (!base64) return;

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");
    };

    const downloadResume = () => {
        const base64 = candidateinfo?.candidate?.resume;

        if (!base64) return;

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "Candidate_Resume.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const [managejobpop, setManagejobpop] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const openJobPopup = (job) => {
        setSelectedJob(job);
        setManagejobpop(true);
    };

    const closeJobPopup = () => {
        setManagejobpop(false);
        setSelectedJob(null);
    };


    const [jobeditpop, setJobeditpop] = useState(false);
    const [jobupdate, setJobupdate] = useState({});

    const jobupdatehandle = async (id) => {
        const payload = {
            id: id,
            role: jobupdate.role,
            location: jobupdate.location,
            jobtype: jobupdate.jobtype,
            employementtype: jobupdate.employementtype,
            experience: jobupdate.experience,
            status: jobupdate.status,
            salary: jobupdate.salary,
            skills: jobupdate.skills,
            vacancies: jobupdate.vacancies,
            deadline: jobupdate.deadline,
            jobdescribtion: jobupdate.jobdescribtion
        }
        console.log(payload);
        try {
            const res = await api.put("/auth/jobupdate", payload);
            if (res.data == "job updated") {
                setJobeditpop(false);
                getjobhandle();
            }
        } catch (error) {
            console.log(error.response.data);
        }

    }

    const handleExport = (data) => {
        if (data == "Candidates") {
            const data = applicantdata.map((application) => ({
                Candidate: application.candidate.user.username || "N/A",
                Email: application.candidate.user.email || "N/A",
                "Role Applied": application.role || "N/A",
                Experience: application.candidate.experience || "N/A",
                Location: application.candidate.city || "N/A",
                Status: application.status || "N/A",
                "Applied On": new Date(application.appliedAt).toLocaleDateString() || "N/A"
            }));

            const headers = Object.keys(data[0]);

            const csv = [
                headers.join(","),
                ...data.map(row =>
                    headers.map(header =>
                        `"${String(row[header]).replace(/"/g, '""')}"`
                    ).join(",")
                )
            ].join("\n");

            const blob = new Blob([csv], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "applicants.csv";

            link.click();

            URL.revokeObjectURL(url);
        }
        else {
            const data = recruiterList.map((recruiter) => ({
                Recruiter: recruiter.user.username || "N/A",
                Email: recruiter.user.email || "N/A",
                "Designation": recruiter.designation || "N/A",
                Experience: recruiter.experience || "N/A",
                Location: recruiter.location || "N/A",
                "Last Active": recruiter.lastActive || "N/A",
                "Phone": recruiter.phone || "N/A"
            }));

            const headers = Object.keys(data[0]);

            const csv = [
                headers.join(","),
                ...data.map(row =>
                    headers.map(header =>
                        `"${String(row[header]).replace(/"/g, '""')}"`
                    ).join(",")
                )
            ].join("\n");

            const blob = new Blob([csv], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "Recruiters.csv";

            link.click();

            URL.revokeObjectURL(url);
        }
    }

    const recruiterhandle = async () => {
        const res = await api.get(`/auth/recruiterlist/${employerId}`);
        console.log(res.data);
        setRecruiterList(res.data);
    }

    const recruiterdelete=async(id)=>{
        try{
        const res=await api.delete(`/auth/delete_user/${id}`);
        console.log(res.data);
        recruiterhandle();
        }catch(error){
            console.log(error.response.data);
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
    }


    return (

        <div className="employer">
            {jobeditpop &&
                <div className="candidate-popup-overlay" onClick={() => setJobeditpop(false)}>
                    <div className="candidate-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="candidate-popup-header">
                            <button type="button" className="candidate-back-btn" onClick={() => setJobeditpop(false)}>
                                ← Back to Applications
                            </button>
                            <h2>Job </h2>
                        </div>
                        <section className="post-job-content">
                            <div className="page-header">
                                <h1>Update Job</h1>
                                <p>Fill in the details below to update job listing.</p>
                            </div>

                            <form className="job-form" onSubmit={(e) => { e.preventDefault(); jobupdatehandle(jobupdate.id) }} >
                                <div className="field-grid">
                                    <div className="input-group">
                                        <label htmlFor="jobTitle">Job Title </label>
                                        <input id="jobTitle" type="text" readOnly placeholder="e.g. Java Developer" value={jobupdate.role} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="jobType">Job Type <span className="required">*</span></label>
                                        <select id="jobType" value={jobupdate.jobtype} onChange={(e) => { setJobupdate(prev => ({ ...prev, jobtype: e.target.value })) }}>
                                            <option value="" disabled>Select job type</option>
                                            <option>Full Time</option>
                                            <option>Part Time</option>
                                            <option>Contract</option>
                                            <option>Remote</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="jobDescription">Job Description <span className="required">*</span></label>
                                        <textarea
                                            id="jobDescription"
                                            placeholder="Describe the role, responsibilities, and what you're looking for..." value={jobupdate.jobdescribtion} required onChange={(e) => { setJobupdate(prev => ({ ...prev, jobdescribtion: e.target.value })) }}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="employmentType">Employment Type <span className="required">*</span></label>
                                        <select id="employmentType" value={jobupdate.employementtype} required onChange={(e) => { setJobupdate(prev => ({ ...prev, employementtype: e.target.value })) }}>
                                            <option value="" disabled>Select employment type</option>
                                            <option>Full Time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                            <option>Remote</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="location">Location <span className="required">*</span></label>
                                        <input id="location" type="text" value={jobupdate.location} placeholder="e.g. Bangalore, Remote" required onChange={(e) => { setJobupdate(prev => ({ ...prev, location: e.target.value })) }} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="openings">No. of Openings <span className="required">*</span></label>
                                        <input id="openings" type="number" value={jobupdate.vacancies} required onChange={(e) => { setJobupdate(prev => ({ ...prev, vacancies: e.target.value })) }} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="requiredSkills">Required Skills <span className="required">*</span></label>
                                        <input id="requiredSkills" value={jobupdate.skills} required type="text" placeholder="e.g. Java, Spring Boot, MySQL (comma separated)" onChange={(e) => { setJobupdate(prev => ({ ...prev, skills: e.target.value })) }} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="deadline">Application Deadline <span className="required">*</span></label>
                                        <div className="date-field">
                                            <input id="deadline" type="date" value={jobupdate.deadline} required onChange={(e) => { setJobupdate(prev => ({ ...prev, deadline: e.target.value })) }} />
                                            <span className="cal-icon" aria-hidden="true">📅</span>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Experience (Years) <span className="required">*</span></label>
                                        <div className="experience-field">
                                            <select value={jobupdate.experience} required onChange={(e) => { setJobupdate(prev => ({ ...prev, experience: e.target.value })) }}>
                                                <option value="" disabled>Minimum</option>
                                                <option>0</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>

                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Status</label>
                                        <select value={jobupdate.status} required onChange={(e) => { setJobupdate(prev => ({ ...prev, status: e.target.value })) }}>
                                            <option value="" disabled>Active</option>
                                            <option>Active</option>
                                            <option>Draft</option>
                                            <option>Closed</option>
                                        </select>
                                    </div>

                                    <div className="input-group salary-group">
                                        <label>Salary Range</label>
                                        <div className="salary-field">
                                            <input type="text" value={jobupdate.salary} required placeholder="e.g. 5" onChange={(e) => { setJobupdate(prev => ({ ...prev, salary: e.target.value })) }} />

                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="primary-btn" >Update Job</button>

                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            }
            {managejobpop && selectedJob && (
                <div className="job-view-popup-overlay" onClick={closeJobPopup}>
                    <div className="job-view-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="job-view-header">
                            <button type="button" className="job-view-back" onClick={closeJobPopup}>
                                ← Back to My Jobs
                            </button>
                            <span className="job-view-id">Job #{selectedJob.job.id || 53}</span>
                        </div>

                        <div className="job-view-body">
                            <div className="job-view-title-row">
                                <h2>{selectedJob.job.role || "AI Developer"}</h2>
                                <span className="job-view-status">[ {selectedJob.job.status || "ACTIVE"} ]</span>
                            </div>

                            <div className="job-view-meta">
                                <span>📍 {selectedJob.job.location || "Mumbai"}</span>
                                <span className="meta-dot">•</span>
                                <span>{selectedJob.job.jobtype || "Contract"}</span>
                                <span className="meta-dot">•</span>
                                <span>Posted {selectedJob.job.appliedAt ? new Date(selectedJob.job.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Sep 14, 2026"}</span>
                            </div>

                            <div className="job-view-divider" />

                            <div className="job-view-section">
                                <h3>Job Overview</h3>
                                <div className="job-view-grid">
                                    <div className="job-view-item">
                                        <span className="job-view-label">💰 Salary</span>
                                        <strong>{selectedJob.job.salary || "N/A"}</strong>
                                    </div>
                                    <div className="job-view-item">
                                        <span className="job-view-label">💼 Job Type</span>
                                        <strong>{selectedJob.job.jobtype || "N/A"}</strong>
                                    </div>
                                    <div className="job-view-item">
                                        <span className="job-view-label">📍 Location</span>
                                        <strong>{selectedJob.job.location || "N/A"}</strong>
                                    </div>
                                    <div className="job-view-item">
                                        <span className="job-view-label">🕐 Experience</span>
                                        <strong>{selectedJob.job.experience || "N/A"}</strong>
                                    </div>
                                    <div className="job-view-item">
                                        <span className="job-view-label">Openings</span>
                                        <strong>{selectedJob.job.vacancies || "N/A"}</strong>
                                    </div>
                                    <div className="job-view-item">
                                        <span className="job-view-label">🕐 Status</span>
                                        <strong>{selectedJob.job.status || "N/A"}</strong>
                                    </div>
                                </div>
                                <div className="job-view-item single-row">
                                    <span className="job-view-label">📅 Application Deadline</span>
                                    <strong>{selectedJob.job.deadline ? new Date(selectedJob.job.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "September 30, 2026"}</strong>
                                </div>
                            </div>

                            <div className="job-view-divider" />

                            <div className="job-view-section">
                                <h3>Required Skills</h3>
                                <div className="job-skill-list">
                                    {(typeof selectedJob.job.skills === "string"
                                        ? selectedJob.job.skills.split(",")
                                        : ["Java", "Spring Boot", "React", "MySQL"]
                                    ).map((skill) => skill.trim()).filter(Boolean).slice(0, 4).map((skill) => (
                                        <span key={skill} className="job-skill-pill">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="job-view-divider" />

                            <div className="job-view-section">
                                <h3>Job Description</h3>
                                <div className="job-description-box">
                                    {selectedJob.job.jobdescribtion || "We are looking for an experienced AI Developer to join our development team. The candidate will work on building intelligent systems and collaborating with cross-functional teams to deliver impactful solutions."}
                                </div>
                            </div>

                            <div className="job-view-section application-section">
                                <h3>Applications</h3>
                                <div className="job-applicants-text">👥 {selectedJob.applicationCount || 0} Applicants</div>
                            </div>
                        </div>

                        <div className="job-view-actions">
                            <button type="button" className="job-view-btn primary" onClick={() => { setManagejobpop(false); setJobeditpop(true); setJobupdate(selectedJob.job); }}>Edit Job</button>

                        </div>
                    </div>
                </div>
            )}


            {applicantpop &&
                <div className="candidate-popup-overlay" onClick={() => setApplicantpop(false)}>
                    <div className="candidate-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="candidate-popup-header">
                            <button type="button" className="candidate-back-btn" onClick={() => setApplicantpop(false)}>
                                ← Back to Applications
                            </button>
                            <h2>Application </h2>
                        </div>

                        <div className="candidate-summary-card">
                            <div className="candidate-summary-avatar">S</div>
                            <div className="candidate-summary-info">
                                <h3>{candidateinfo.candidate.user.username || N / A}</h3>
                                <p>{candidateinfo.candidate.user.email}</p>
                                <span>📍 {candidateinfo.candidate.city || "N/A"}</span>
                            </div>
                        </div>

                        <div className="candidate-status-row">
                            <span>Candidate Status:</span>
                            <span className="candidate-status-badge">[ {candidateinfo.status || "N/A"} ]</span>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Applied For</h4>
                            <div className="candidate-job-box">
                                <div className="candidate-job-title">{candidateinfo.role || "N/A"}</div>
                                <div className="candidate-job-meta">{candidateinfo.jobtype} • {candidateinfo.location} • {candidateinfo.salary}</div>
                            </div>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Candidate Information</h4>
                            <div className="candidate-info-box">
                                <div className="candidate-info-row">
                                    <span className="label">Experience</span>
                                    <span className="value">{candidateinfo.candidate.experience || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Skills</span>
                                    <span className="value">{candidateinfo.candidate.skills || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Education</span>
                                    <span className="value">{candidateinfo.candidate.education || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Location</span>
                                    <span className="value">{candidateinfo.candidate.city || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Resume</h4>
                            <div className="candidate-file-box">
                                <span className="file-name">
                                    📄 Resume.pdf
                                </span>

                                <div className="file-actions">
                                    <button
                                        type="button"
                                        className="file-action-btn"
                                        onClick={viewResume}
                                    >
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        className="file-action-btn"
                                        onClick={downloadResume}
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Cover Letter</h4>
                            <div className="candidate-cover-box">
                                I am interested in this position because...
                            </div>
                        </div>

                        <div className="candidate-action-row">
                            <button type="button" className="candidate-action reject" onClick={() => { statushandle({ userId: candidateinfo.candidate.user.id, jobId: candidateinfo.jobid, status: "Under Review" }); setApplicantpop(false) }}>Under Review</button>
                            <button type="button" className="candidate-action shortlist" onClick={() => { statushandle({ userId: candidateinfo.candidate.user.id, jobId: candidateinfo.jobid, status: "Shortlist" }); setApplicantpop(false) }}>Shortlist</button>
                            <button type="button" className="candidate-action selected" onClick={() => { statushandle({ userId: candidateinfo.candidate.user.id, jobId: candidateinfo.jobid, status: "Selected" }); setApplicantpop(false) }}>Select</button>
                            <button type="button" className="candidate-action reject" onClick={() => { statushandle({ userId: candidateinfo.candidate.user.id, jobId: candidateinfo.jobid, status: "Rejected" }); setApplicantpop(false) }}>Reject</button>
                        </div>
                    </div>
                </div>
            }
            {recruiterpop &&
                <div className="candidate-popup-overlay" onClick={() => setRecruiterpop(false)}>
                    <div className="candidate-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="candidate-popup-header">
                            <button type="button" className="candidate-back-btn" onClick={() => setRecruiterpop(false)}>
                                ← Back to Applications
                            </button>
                            <h2>Recruiter </h2>
                        </div>

                        <div className="candidate-summary-card">
                            <div className="candidate-summary-avatar">{recruiterinfo.user.username.charAt(0).toUpperCase()}</div>
                            <div className="candidate-summary-info">
                                <h3>{recruiterinfo.user.username || N / A}</h3>
                                <p>{recruiterinfo.user.email}</p>
                                <span>📍 {recruiterinfo.location || "N/A"}</span>
                            </div>
                        </div>

                        <div className="candidate-status-row">
                            <span>Designation :</span>
                            <span className="candidate-status-badge">[ {recruiterinfo.designation || "N/A"} ]</span>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Member In</h4>
                            <div className="candidate-job-box">
                                <div className="candidate-job-title">{recruiterinfo.companyname || "N/A"}</div>
                                <div className="candidate-job-meta">{recruiterinfo.jobtype} • {recruiterinfo.employer.location} • {recruiterinfo.salary}</div>
                            </div>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Recruiter Information</h4>
                            <div className="candidate-info-box">
                                <div className="candidate-info-row">
                                    <span className="label">Experience</span>
                                    <span className="value">{recruiterinfo.experience || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Contact</span>
                                    <span className="value">{recruiterinfo.phone || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Location</span>
                                    <span className="value">{recruiterinfo.location || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Social Media URL</span>
                                    <span className="value">{recruiterinfo.website || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            }


            {candidatepop && (
                <div className="candidate-popup-overlay" onClick={() => setCandidatepop(false)}>
                    <div className="candidate-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="candidate-popup-header">
                            <button type="button" className="candidate-back-btn" onClick={() => setCandidatepop(false)}>
                                ← Back to Applications
                            </button>
                            <h2>Application </h2>
                        </div>

                        <div className="candidate-summary-card">
                            <div className="candidate-summary-avatar">S</div>
                            <div className="candidate-summary-info">
                                <h3>{candidateinfo.candidate.user.username || N / A}</h3>
                                <p>{candidateinfo.candidate.user.email}</p>
                                <span>📍 {candidateinfo.candidate.city || "N/A"}</span>
                            </div>
                        </div>

                        <div className="candidate-status-row">
                            <span>Application Status:</span>
                            <span className="candidate-status-badge">[ {candidateinfo.job.status || "N/A"} ]</span>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Applied For</h4>
                            <div className="candidate-job-box">
                                <div className="candidate-job-title">{candidateinfo.job.jobs.role || "N/A"}</div>
                                <div className="candidate-job-meta">{candidateinfo.job.jobs.jobtype} • {candidateinfo.job.jobs.location} • {candidateinfo.job.jobs.salary}</div>
                            </div>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Candidate Information</h4>
                            <div className="candidate-info-box">
                                <div className="candidate-info-row">
                                    <span className="label">Experience</span>
                                    <span className="value">{candidateinfo.candidate.experience || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Skills</span>
                                    <span className="value">{candidateinfo.candidate.skills || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Education</span>
                                    <span className="value">{candidateinfo.candidate.education || "N/A"}</span>
                                </div>
                                <div className="candidate-info-row">
                                    <span className="label">Location</span>
                                    <span className="value">{candidateinfo.candidate.city || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Resume</h4>
                            <div className="candidate-file-box">
                                <span className="file-name">
                                    📄 Resume.pdf
                                </span>

                                <div className="file-actions">
                                    <button
                                        type="button"
                                        className="file-action-btn"
                                        onClick={viewResume}
                                    >
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        className="file-action-btn"
                                        onClick={downloadResume}
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="candidate-detail-block">
                            <h4>Cover Letter</h4>
                            <div className="candidate-cover-box">
                                I am interested in this position because...
                            </div>
                        </div>

                        <div className="candidate-action-row">
                            <button type="button" className="candidate-action reject" onClick={() => { statushandle({ userId: candidateinfo.candidate.user.id, jobId: candidateinfo.job.jobs.id, status: "Under Review" }); setCandidatepop(false) }}>Under Review</button>
                            <button type="button" className="candidate-action shortlist" onClick={() => { statushandle({ userId: candidateinfo.candidate.user.id, jobId: candidateinfo.job.jobs.id, status: "Shortlist" }); setCandidatepop(false); }}>Shortlist</button>
                            <button type="button" className="candidate-action selected" onClick={() => { statushandle({ userId: candidateinfo.candidate.user.id, jobId: candidateinfo.job.jobs.id, status: "Selected" }); setCandidatepop(false); }}>Select</button>
                            <button type="button" className="candidate-action reject" onClick={() => { statushandle({ userId: candidateinfo.candidate.user.id, jobId: candidateinfo.job.jobs.id, status: "Rejected" }); setCandidatepop(false); }}>Reject</button>
                        </div>
                    </div>
                </div>
            )}
            {profileedit && (
                <div className="profile-edit-overlay" role="dialog" aria-modal="true">
                    <div className="profile-edit-modal">
                        <div className="profile-edit-header">
                            <h3>Complete your company profile</h3>
                        </div>

                        <form onSubmit={saveProfile}>
                            <div className="profile-edit-form">
                                <div className="profile-edit-field">
                                    <label htmlFor="companyname">Company Name</label>
                                    <input
                                        id="companyname"
                                        name="companyname"
                                        type="text"
                                        value={profileForm.companyname}
                                        onChange={handleProfileInputChange}
                                        placeholder="Enter company name"
                                        required
                                    />
                                </div>

                                <div className="profile-edit-field">
                                    <label htmlFor="industry">Industry</label>
                                    <input
                                        id="industry"
                                        name="industry"
                                        type="text"
                                        value={profileForm.industry}
                                        onChange={handleProfileInputChange}
                                        placeholder="Enter industry"
                                        required
                                    />
                                </div>

                                <div className="profile-edit-field">
                                    <label htmlFor="companysize">Company Size</label>
                                    <input
                                        id="companysize"
                                        name="companysize"
                                        type="text"
                                        value={profileForm.companysize}
                                        onChange={handleProfileInputChange}
                                        placeholder="e.g. 100-500"
                                        required
                                    />
                                </div>

                                <div className="profile-edit-field">
                                    <label htmlFor="website">Website</label>
                                    <input
                                        id="website"
                                        name="website"
                                        type="url"
                                        value={profileForm.website}
                                        onChange={handleProfileInputChange}
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="profile-edit-field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        value={profileForm.email}
                                        onChange={handleProfileInputChange}
                                        placeholder="e.g: abc@gmail.com"
                                    />
                                </div>
                                <div className="profile-edit-field">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="number"
                                        value={profileForm.phone}
                                        onChange={handleProfileInputChange}
                                        placeholder="91+"
                                    />
                                </div>

                                <div className="profile-edit-field full-width">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={profileForm.location}
                                        onChange={handleProfileInputChange}
                                        placeholder="Enter company location"
                                        required
                                    />
                                </div>

                                <div className="profile-edit-field full-width">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={profileForm.description}
                                        onChange={handleProfileInputChange}
                                        placeholder="Tell us about your company"
                                        required
                                    />
                                </div>
                            </div>

                            {profileError && <p className="profile-form-error">{profileError}</p>}

                            <div className="profile-edit-actions">
                                <button type="submit" className="primary-btn" disabled={isSavingProfile}>
                                    {isSavingProfile ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <aside className="topbar-left" aria-label="Main navigation">
                <h2 className="brand">JobPortal</h2>
                <nav>
                    <ul className="menu">
                        {menuItems.map(({ label, icon }) => {
                            const isActive =
                                (label === "Dashboard" && dashboard) ||
                                (label === "Post Job" && Postjob) ||
                                (label === "Manage Jobs" && managejob) ||
                                (label === "Applicants" && applicant) ||
                                (label === "Profile" && profile) ||
                                (label === "Settings" && setting);

                            return (
                                <li key={label}>
                                    <button
                                        type="button"
                                        className={`menu-item ${isActive ? "active" : ""}`}
                                        onClick={() => switchcomp(label)}
                                    >
                                        <span className="menu-icon" aria-hidden="true">{icon}</span>
                                        <span>{label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            <main className="main-panel">
                {dashboard && (
                    <div className="dashboard">
                        <header className="topbar-right dashboard-topbar">
                            <div className="company-top">
                                <div className="company-label">{companyname}</div>
                                <div className="user-profile" aria-live="polite">

                                    <div className="user-avatar" aria-hidden="true">{companyname.charAt(0).toUpperCase()}</div>
                                    <div className="user-meta">
                                        <span className="user-name">Hello, {username}!</span>
                                        <span className="user-role">Employer</span>
                                    </div>

                                </div>
                            </div>
                        </header>

                        <section className="dash-comp">
                            <div className="dashboard-header">
                                <h1>Dashboard</h1>
                                <p>Here&apos;s an overview of your recruitment activity.</p>
                            </div>

                            <div className="dash-top-item">
                                {[
                                    {
                                        title: "Jobs Posted",
                                        value: employerjobs.length || 0,
                                        desc: "Total jobs posted so far",
                                        icon: "💼",
                                        color: "blue",
                                    },
                                    {
                                        title: "Active Jobs",
                                        value: activejob,
                                        desc: "Currently active jobs",
                                        icon: "📄",
                                        color: "green",
                                    },
                                    {
                                        title: "Applications",
                                        value: recentApplications.length || 0,
                                        desc: "Total applications received",
                                        icon: "👥",
                                        color: "purple",
                                    },
                                    {
                                        title: "Selected",
                                        value: selected,
                                        desc: "Candidates selected",
                                        icon: "✅",
                                        color: "red",
                                    },
                                ].map((c) => (
                                    <article className={`stat-card stat-${c.color}`} key={c.title}>
                                        <div className="stat-left">
                                            <div className="stat-icon" aria-hidden>
                                                {c.icon}
                                            </div>
                                        </div>
                                        <div className="stat-right">
                                            <div className="stat-title">{c.title}</div>
                                            <div className="stat-value">{c.value}</div>
                                            <div className="stat-desc">{c.desc}</div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="recent-applications-section">
                                <div className="recent-header-row">
                                    <h2>Recent Applications</h2>
                                    <button type="button" className="view-all-button">View All</button>
                                </div>

                                <div className="applications-table-wrap">
                                    <table className="applications-table">
                                        <thead>
                                            <tr>
                                                <th>Candidate</th>
                                                <th>Job</th>
                                                <th>Applied Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentApplications.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td className="candidate-cell">
                                                        <div className="candidate-profile">
                                                            <span className={`candidate-avatar avatar-${item.user.username.charAt(0).toLowerCase()}`}>
                                                                {item.user.username.charAt(0)}
                                                            </span>
                                                            <div className="candidate-meta">
                                                                <span className="candidate-name">{item.user.username}</span>
                                                                <span className="candidate-email">{item.user.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{item.jobs.role}</td>
                                                    <td>{new Date(item.appliedAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`table-status status-${item.status.toLowerCase().trim().replace(/\s+/g, '-')}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button type="button" className="table-action-btn" onClick={() => { candidatepophandle(item) }}>View</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {Postjob && (
                    <div className="post-job-view">
                        <header className="topbar-right dashboard-topbar">
                            <div className="company-top">
                                <div className="company-label">{companyname}</div>
                                <div className="user-profile" aria-live="polite">

                                    <div className="user-avatar" aria-hidden="true">{companyname.charAt(0).toUpperCase()}</div>
                                    <div className="user-meta">
                                        <span className="user-name">Hello, {username}!</span>
                                        <span className="user-role">Employer</span>
                                    </div>

                                </div>
                            </div>
                        </header>

                        <section className="post-job-content">
                            <div className="page-header">
                                <h1>Post a New Job</h1>
                                <p>Fill in the details below to create a new job listing.</p>
                            </div>

                            <form className="job-form" onSubmit={postjob}>
                                <div className="field-grid">
                                    <div className="input-group">
                                        <label htmlFor="jobTitle">Job Title <span className="required">*</span></label>
                                        <input id="jobTitle" type="text" placeholder="e.g. Java Developer" required onChange={(e) => { setJobpostdata(prev => ({ ...prev, role: e.target.value })) }} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="jobType">Job Type <span className="required">*</span></label>
                                        <select id="jobType" defaultValue="" required onChange={(e) => { setJobpostdata(prev => ({ ...prev, jobtype: e.target.value })) }}>
                                            <option value="" disabled>Select job type</option>
                                            <option>Full Time</option>
                                            <option>Part Time</option>
                                            <option>Contract</option>
                                            <option>Remote</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="jobDescription">Job Description <span className="required">*</span></label>
                                        <textarea
                                            id="jobDescription"
                                            placeholder="Describe the role, responsibilities, and what you're looking for..." required onChange={(e) => { setJobpostdata(prev => ({ ...prev, jobdescribtion: e.target.value })) }}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="employmentType">Employment Type <span className="required">*</span></label>
                                        <select id="employmentType" defaultValue="" required onChange={(e) => { setJobpostdata(prev => ({ ...prev, employementtype: e.target.value })) }}>
                                            <option value="" disabled>Select employment type</option>
                                            <option>Full Time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                            <option>Remote</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="location">Location <span className="required">*</span></label>
                                        <input id="location" type="text" placeholder="e.g. Bangalore, Remote" required onChange={(e) => { setJobpostdata(prev => ({ ...prev, location: e.target.value })) }} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="openings">No. of Openings <span className="required">*</span></label>
                                        <input id="openings" type="number" defaultValue={1} required onChange={(e) => { setJobpostdata(prev => ({ ...prev, vacancies: e.target.value })) }} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="requiredSkills">Required Skills <span className="required">*</span></label>
                                        <input id="requiredSkills" required type="text" placeholder="e.g. Java, Spring Boot, MySQL (comma separated)" onChange={(e) => { setJobpostdata(prev => ({ ...prev, skills: e.target.value })) }} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="deadline">Application Deadline <span className="required">*</span></label>
                                        <div className="date-field">
                                            <input id="deadline" type="date" required onChange={(e) => { setJobpostdata(prev => ({ ...prev, deadline: e.target.value })) }} />
                                            <span className="cal-icon" aria-hidden="true">📅</span>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Experience (Years) <span className="required">*</span></label>
                                        <div className="experience-field">
                                            <select defaultValue="" required onChange={(e) => { setJobpostdata(prev => ({ ...prev, experience: e.target.value })) }}>
                                                <option value="" disabled>Minimum</option>
                                                <option>0</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>

                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Status</label>
                                        <select defaultValue="" required onChange={(e) => { setJobpostdata(prev => ({ ...prev, status: e.target.value })) }}>
                                            <option value="" disabled>Active</option>
                                            <option>Active</option>
                                            <option>Draft</option>
                                            <option>Closed</option>
                                        </select>
                                    </div>

                                    <div className="input-group salary-group">
                                        <label>Salary Range</label>
                                        <div className="salary-field">
                                            <input type="text" required placeholder="e.g. 5" onChange={(e) => { setJobpostdata(prev => ({ ...prev, salary: e.target.value })) }} />

                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="primary-btn" >Post Job</button>

                                </div>
                            </form>
                        </section>
                    </div>
                )}

                {managejob && (
                    <div className="manage-job-view">
                        <header className="topbar-right dashboard-topbar">
                            <div className="company-top">
                                <div className="company-label">{companyname}</div>
                                <div className="user-profile" aria-live="polite">

                                    <div className="user-avatar" aria-hidden="true">{companyname.charAt(0).toUpperCase()}</div>
                                    <div className="user-meta">
                                        <span className="user-name">Hello, {username}!</span>
                                        <span className="user-role">Employer</span>
                                    </div>

                                </div>
                            </div>
                        </header>

                        <section className="manage-job-content">
                            <div className="manage-header-row">
                                <div className="manage-header-copy">
                                    <h1>My Jobs</h1>
                                    <p>Manage all your job postings in one place.</p>
                                </div>
                                <button type="button" className="primary-btn manage-post-btn" onClick={() => { switchcomp("Post Job") }}>+ Post New Job</button>
                            </div>

                            <div className="job-tabs" aria-label="Job status tabs">
                                <button type="button" className="tab-btn active">All Jobs <span>{employerjobs.length || 0}</span></button>

                            </div>

                            <div className="jobs-table-wrap">
                                <table className="jobs-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Job Title</th>
                                            <th>Location</th>
                                            <th>Applicants</th>
                                            <th>Status</th>
                                            <th>Posted On</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {visibleJobs.map((job, index) => (
                                            <tr key={`${job.role}-${index}`}>
                                                <td>{startIndex + index + 1}</td>
                                                <td>
                                                    <div className="job-name">{job.job.role}</div>
                                                    <div className="job-type">{job.job.jobtype}</div>
                                                </td>
                                                <td><span className="loc-cell">📍</span> {job.job.location}</td>
                                                <td><span className="people-icon">👥</span> {job.applicationCount}</td>
                                                <td><span className={`table-status status-${job.job.status.toLowerCase().trim().replace(/\s+/g, '-')}`}>{job.job.status}</span></td>
                                                <td>{job.job.appliedAt}</td>
                                                <td className="actions-cell">
                                                    <button type="button" className="table-btn view-btn" onClick={() => openJobPopup(job)}>View</button>
                                                    <button type="button" className="table-btn edit-btn" onClick={() => { setJobeditpop(true); setJobupdate(job.job); }}>Edit</button>
                                                    <div className="menu-wrapper">
                                                        <button type="button" className="menu-dots" aria-label="More actions" onClick={() => setOpenMenuJobId(openMenuJobId === job.job.id ? null : job.job.id)}>⋮</button>
                                                        {openMenuJobId === job.job.id && (
                                                            <div className="action-menu" onClick={(e) => e.stopPropagation()}>
                                                                <button type="button" className="action-menu-item delete" onClick={() => handleDeleteJob(job.job.id)}>Delete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>))}


                                    </tbody>
                                </table>
                            </div>

                            <div className="jobs-footer">
                                <span>
                                    {employerjobs.length === 0
                                        ? "No jobs found"
                                        : `Showing ${showingStart} to ${showingEnd} of ${employerjobs.length} jobs`}
                                </span>
                                <div className="pagination">
                                    <button
                                        type="button"
                                        className="page-btn"
                                        aria-label="Previous page"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        ‹
                                    </button>
                                    <span className="page-indicator">{currentPage} / {totalPages}</span>
                                    <button
                                        type="button"
                                        className="page-btn"
                                        aria-label="Next page"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage >= totalPages}
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {applicant && (
                    <div className="applicant-view">
                        <header className="topbar-right dashboard-topbar">
                            <div className="company-top">
                                <div className="company-label">{companyname}</div>
                                <div className="user-profile" aria-live="polite">

                                    <div className="user-avatar" aria-hidden="true">{companyname.charAt(0).toUpperCase()}</div>
                                    <div className="user-meta">
                                        <span className="user-name">Hello, {username}!</span>
                                        <span className="user-role">Employer</span>
                                    </div>

                                </div>
                            </div>
                        </header>

                        <section className="manage-job-content applicant-content">
                            <div className="manage-header-row">
                                <div className="manage-header-copy">
                                    <h1>Applicants & Recruiters</h1>
                                    <p>Track candidates and recruiters in one professional hiring dashboard.</p>
                                </div>
                                <button type="button" className="primary-btn manage-post-btn" onClick={() => { handleExport(activeApplicantTab) }}>Export</button>
                            </div>

                            <div className="job-tabs applicant-tabs" aria-label="Applicant filters">
                                <button
                                    type="button"
                                    className={`tab-btn ${activeApplicantTab === "Candidates" ? "active" : ""}`}
                                    onClick={() => setActiveApplicantTab("Candidates")}
                                >
                                    Candidates <span>{recentApplications.length}</span>
                                </button>
                                <button
                                    type="button"
                                    className={`tab-btn ${activeApplicantTab === "Recruiters" ? "active" : ""}`}
                                    onClick={() => { setActiveApplicantTab("Recruiters") }}
                                >
                                    Recruiters <span>{recruiterList.length}</span>
                                </button>
                            </div>

                            {activeApplicantTab === "Candidates" ? (
                                <>
                                    <div className="jobs-table-wrap">
                                        <table className="jobs-table applicants-table">
                                            <thead>
                                                <tr>
                                                    <th>Candidate</th>
                                                    <th>Role Applied</th>
                                                    <th>Experience</th>
                                                    <th>Location</th>
                                                    <th>Status</th>
                                                    <th>Applied On</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleApplicants.map((item, index) => (
                                                    <tr key={index}>
                                                        <td >
                                                            <div className="candidate-cell">
                                                                <div className="candidate-avatar">AR</div>
                                                                <div>
                                                                    <div className="candidate-name">{item.candidate.user.username}</div>
                                                                    <div className="candidate-email">{item.candidate.user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{item.role}</td>
                                                        <td>{item.candidate.experience}</td>
                                                        <td>{item.candidate.city}</td>
                                                        <td><span className={`table-status status-${item.status.toLowerCase().trim().replace(/\s+/g, '-')}`}>{item.status}</span></td>
                                                        <td>{new Date(item.appliedAt).toLocaleDateString()}</td>
                                                        <td className="actions-cell">
                                                            <button type="button" className="table-btn view-btn" onClick={() => { applicantpophandle(item) }}>View</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="jobs-footer">
                                        <span>
                                            {recentApplications.length === 0
                                                ? "No applicants found"
                                                : `Showing ${applicantStartIndex + 1} to ${Math.min(applicantStartIndex + applicantsPerPage, recentApplications.length)} of ${recentApplications.length} applicants`}
                                        </span>
                                        <div className="pagination">
                                            <button
                                                type="button"
                                                className="page-btn"
                                                aria-label="Previous page"
                                                onClick={() => setApplicantPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={applicantPage === 1}
                                            >
                                                ‹
                                            </button>
                                            <button type="button" className="page-btn active-page" aria-label="Current page">
                                                {applicantPage}
                                            </button>
                                            <button
                                                type="button"
                                                className="page-btn"
                                                aria-label="Next page"
                                                onClick={() => setApplicantPage((prev) => Math.min(prev + 1, totalApplicantPages))}
                                                disabled={applicantPage >= totalApplicantPages}
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="jobs-table-wrap">
                                        <table className="jobs-table applicants-table">
                                            <thead>
                                                <tr>
                                                    <th>Recruiter</th>
                                                    <th>Specialty</th>
                                                    <th>Company</th>
                                                    <th>Location</th>
                                                    <th>Last Active</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recruiterList.map((recruiter) => (
                                                    <tr key={recruiter.id}>
                                                        <td>
                                                            <div className="candidate-cell">
                                                                <div className="candidate-avatar">{recruiter.user.username.charAt(0)}</div>
                                                                <div>
                                                                    <div className="candidate-name">{recruiter.user.username}</div>
                                                                    <div className="candidate-email">{recruiter.user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{recruiter.designation}</td>
                                                        <td>{recruiter.companyname}</td>
                                                        <td>{recruiter.location}</td>
                                                        <td>{new Date(recruiter.lastActive).toLocaleDateString()}</td>
                                                        <td className="actions-cell">
                                                            <button type="button" className="table-btn view-btn" onClick={() => { recruiterpophandle(recruiter) }}>View</button>
                                                            <button type="button" className="action-menu-item delete" onClick={()=>{recruiterdelete(recruiter.user.id)}}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="jobs-footer">
                                        <span>{recruiterList.length} recruiters in your network</span>
                                        <div className="pagination">
                                            <button type="button" className="page-btn active-page" aria-label="Recruiter summary">
                                                1
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                )}

                {profile && (
                    <div className="profile-page">
                        <header className="topbar-right dashboard-topbar">
                            <div className="company-top">
                                <div className="company-label">{companyname}</div>
                                <div className="user-profile" aria-live="polite">

                                    <div className="user-avatar" aria-hidden="true">{companyname.charAt(0).toUpperCase()}</div>
                                    <div className="user-meta">
                                        <span className="user-name">Hello, {username}!</span>
                                        <span className="user-role">Employer</span>
                                    </div>

                                </div>
                            </div>
                        </header>

                        <section className="profile-content">
                            <div className="profile-header-row">
                                <div>
                                    <h1>Company Profile</h1>
                                    <p>Manage your company details and public information.</p>
                                </div>
                                <button type="button" className="primary-btn edit-profile-btn" onClick={() => { setProfileupdate(true) }}>Edit Profile</button>
                            </div>

                            <div className="profile-summary-card">
                                <div className="profile-brand-box">
                                    <div className="company-logo">{companyname.charAt(0).toUpperCase()}</div>
                                    <div>
                                        <h2>{profiledata.companyname}</h2>
                                        <p>{profiledata.industry}</p>
                                    </div>
                                </div>
                                <div className="profile-meta-inline">
                                    <span>{profiledata.companysize} employees</span>
                                    <span>{profiledata.location}</span>
                                    <a href={profiledata.website} target="_blank" rel="noreferrer">{profiledata.website}</a>
                                </div>
                            </div>

                            <div className="profile-card-grid">
                                <div className="profile-info-card">
                                    <h3>Company Information</h3>
                                    <div className="profile-grid-row">
                                        <div className="profile-field">
                                            <label>Company Name</label>
                                            <p>{profiledata.companyname}</p>
                                        </div>
                                        <div className="profile-field">
                                            <label>Company Size</label>
                                            <p>{profiledata.companysize}</p>
                                        </div>
                                        <div className="profile-field">
                                            <label>Industry</label>
                                            <p>{profiledata.industry}</p>
                                        </div>
                                        <div className="profile-field">
                                            <label>Location</label>
                                            <p>{profiledata.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-info-card">
                                    <h3>Contact Details</h3>
                                    <div className="profile-grid-row">
                                        <div className="profile-field">
                                            <label>Email</label>
                                            <p>{profiledata.email}</p>
                                        </div>
                                        <div className="profile-field">
                                            <label>Phone</label>
                                            <p>{profiledata.phone}</p>
                                        </div>
                                        <div className="profile-field">
                                            <label>Website</label>
                                            <p><a href={profiledata.website} target="_blank" rel="noreferrer">{profiledata.website}</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-info-card full-width">
                                <h3>About the Company</h3>
                                <p className="profile-description">{profiledata.description}</p>
                            </div>
                        </section>
                    </div>
                )}
                {setting && (
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
            {profileupdate && <div className="profile-edit-overlay" role="dialog" aria-modal="true">
                <div className="profile-edit-modal">
                    <div className="profile-edit-header">
                        <h3>Update your company profile</h3>
                    </div>

                    <form onSubmit={updateProfile}>
                        <div className="profile-edit-form">

                            <div className="profile-edit-field">
                                <label htmlFor="industry">Industry</label>
                                <input
                                    id="industry"
                                    name="industry"
                                    type="text"
                                    value={profileForm.industry}
                                    onChange={handleProfileInputChange}
                                    placeholder="Enter industry"

                                />
                            </div>

                            <div className="profile-edit-field">
                                <label htmlFor="companysize">Company Size</label>
                                <input
                                    id="companysize"
                                    name="companysize"
                                    type="text"
                                    value={profileForm.companysize}
                                    onChange={handleProfileInputChange}
                                    placeholder="e.g. 100-500"

                                />
                            </div>

                            <div className="profile-edit-field">
                                <label htmlFor="website">Website</label>
                                <input
                                    id="website"
                                    name="website"
                                    type="url"
                                    value={profileForm.website}
                                    onChange={handleProfileInputChange}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="profile-edit-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    value={profileForm.email}
                                    onChange={handleProfileInputChange}
                                    placeholder="e.g: abc@gamil.com"
                                />
                            </div>
                            <div className="profile-edit-field">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="number"
                                    value={profileForm.phone}
                                    onChange={handleProfileInputChange}
                                    placeholder="91+"
                                />
                            </div>

                            <div className="profile-edit-field full-width">
                                <label htmlFor="location">Location</label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={profileForm.location}
                                    onChange={handleProfileInputChange}
                                    placeholder="Enter company location"

                                />
                            </div>

                            <div className="profile-edit-field full-width">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={profileForm.description}
                                    onChange={handleProfileInputChange}
                                    placeholder="Tell us about your company"

                                />
                            </div>
                        </div>

                        {profileError && <p className="profile-form-error">{profileError}</p>}

                        <div className="profile-edit-actions">
                            <button type="submit" className="primary-btn" disabled={isSavingProfile}>
                                {isSavingProfile ? "Saving..." : "Save Profile"}
                            </button>
                            <button onClick={() => { setProfileupdate(false) }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>}
            {successfully && (
                <div className="success-popup-overlay">
                    <div className="success-popup">
                        <button
                            type="button"
                            className="success-popup-close"
                            onClick={() => { setSuccessfully(false), setSuccessfullydata("") }}
                            aria-label="Close success popup"
                        >
                            ×
                        </button>
                        <p className="success-popup-title">{successfullydata}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Employer;