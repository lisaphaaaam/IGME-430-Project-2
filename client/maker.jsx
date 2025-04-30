/* create the job application in html */

const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleJob = (e, onJobAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#jobTitle').value;
    const company = e.target.querySelector('#company').value;
    const pay = e.target.querySelector('#pay').value;
    const type = e.target.querySelector('#jobType').value;
    const applied = e.target.querySelector('#applied').value;
    const status = e.target.querySelector('#status').value;

    if (!title || !company || !pay) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { title, company, pay, type, applied, status }, onJobAdded);
    return false;
}

const JobForm = (props) => {
    return (
        <form id="jobForm"
            onSubmit={(e) => handleJob(e, props.triggerReload)}
            name="jobForm"
            action="/maker"
            method="POST"
            className="jobForm"
        >
            <input id="jobTitle" type="text" name="title" placeholder="Job Title" />

            <input id="company" type="text" name="company" placeholder="Job Company" />

            <input id="pay" type="number" min="0" name="pay" placeholder="Pay" />

            <div className="formRow">
                <label htmlFor="type">Job Type: </label>
                <select name="type" id="jobType">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="volunteer">Volunteer</option>
                </select>
            </div>

            <div className="formRow">

                <label htmlFor="applied">Applied?: </label>
                <select name="applied" id="applied">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div className="formRow">

                <label htmlFor="status">Status: </label>
                <select name="status" id="status">
                    <option value="waiting">Waiting</option>
                    <option value="rejected">Rejected</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="accepted">Accepted</option>
                </select>
            </div>

            <input className="makeJobSubmit" type="submit" value="Make Job" />
        </form>

    );
};

const deleteJob = async (id, onDeleted) => {
    const response = await fetch(`/deleteJob`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (result.error) {
        helper.handleError(result.error);
    } else {
        onDeleted();
    }
};


const JobList = (props) => {
    const [jobs, setJobs] = useState([]);

    const triggerReload = () => {
        if (typeof props.reloadJobs === 'function') {
            props.reloadJobs();
        } else {
            setJobs([]);
        }
    };

    const deleteAndUpdate = async (id) => {
        await deleteJob(id, () => {
            setJobs(prev => prev.filter(d => d._id !== id));
        });
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch('/updateStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status: newStatus }),
            });

            const result = await response.json();

            if (result.error) {
                helper.handleError(result.error);
            } else {
                setJobs(prevJobs =>
                    prevJobs.map(job =>
                        job._id === id ? { ...job, status: newStatus } : job
                    )
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleNotes = async (id, newNotes) => {
        try {
            const response = await fetch('/updateNotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, notes: newNotes }),
            });

            const result = await response.json();

            if (result.error) {
                helper.handleError(result.error);
            } else {
                setJobs(prevJobs =>
                    prevJobs.map(job =>
                        job._id === id ? { ...job, notes: newNotes } : job
                    )
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const loadJobsFromServer = async () => {
            const response = await fetch('/getJobs');
            const data = await response.json();
            setJobs(data.jobs);
        };
        loadJobsFromServer();
    }, [props.reloadJobs]);

    if (jobs.length === 0) {
        return (
            <div id="jobs">
                {jobs.length === 0 ? (
                    <div className="emptyJobWrapper">
                        <h3 className="emptyJob">No Job Apps Yet!</h3>
                    </div>
                ) : (
                    <div className="jobList">
                        {/* render jobs here */}
                    </div>
                )}
            </div>
        );
    }

    const sortedJobs = [...jobs].sort((a, b) => {
        const payA = Number(a.pay);
        const payB = Number(b.pay);

        if (props.sortBy === 'low-high') {
            return payA - payB;
        } else {
            return payB - payA;
        }
    });

    const jobNodes = sortedJobs.map(job => {
        return (
            <div key={job._id} className="job">
                <div className='jobHeader'>
                    <img src="/assets/img/job.png" alt="job" className="jobApp" style={{ width: '25%', height: 'auto' }} />

                    <div className='jobMain'>
                        <h3 className="jobTitle">{job.title}</h3>
                        <h3 className="jobCompany">{job.company}</h3>
                    </div>
                </div>

                <h3 className="jobPay">Hourly Pay: {job.pay}</h3>
                <h3 className="jobType">Type: {job.type}</h3>
                <h3 className="jobApplied">Applied: {job.applied}</h3>
                <div className='statusWrapper'>
                    <h3 className="jobStatus">Status: </h3>
                    <select
                        className='statusSelect'
                        value={job.status}
                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                    >
                        <option value="waiting">Waiting</option>
                        <option value="rejected">Rejected</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="accepted">Accepted</option>
                    </select>
                </div>

                {props.premium && (
                    <div className="jobNotes">
                        <label htmlFor={`notes-${job._id}`}>Notes:</label>
                        <textarea
                            id={`notes-${job._id}`}
                            defaultValue={job.notes || ''}
                            onChange={(e) => handleNotes(job._id, e.target.value)}
                            placeholder="Enter your notes here!"
                        />
                    </div>
                )}

                <button onClick={() => deleteAndUpdate(job._id)}
                    style={{
                        marginTop: '10px',
                        width: '80px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}>
                    Delete
                </button>
            </div>
        );
    });

    return (
        <div className="jobList">
            {jobNodes}
        </div>
    );
};

const App = () => {
    const [reloadJobs, setReloadJobs] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [account, setAccount] = useState({ username: '', count: 0 });

    const [premium, setPremium] = useState(false);

    const [sortBy, setSortBy] = useState('high-low');

    const fetchAccountInfo = async () => {
        const response = await fetch('/accountInfo');
        const data = await response.json();
        // console.log("Fetched account info:", data);
        setAccount(data);
    };

    useEffect(() => {
        fetchAccountInfo();
    }, []);

    return (
        <div>

            <div className="topControls">
                <h2>Username: {account.username}</h2>

                {!premium && (
                    <img className="ad" src="/assets/img/placeholder.svg" alt="ad placeholder" />
                )}

                <div className="premium-toggle">
                    <span>Premium</span>
                    <label className="switch">
                        <input type="checkbox"
                            checked={premium}
                            onChange={() => setPremium(!premium)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <label htmlFor="sortBy">
                    Sort Pay by:
                    <select
                        name="sortBy"
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="high-low">High-Low</option>
                        <option value="low-high">Low-High</option>
                    </select>
                </label>

            </div>

            <div id="jobs">
                <JobList reloadJobs={reloadJobs} sortBy={sortBy} premium={premium} />
            </div>

            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999,
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        maxWidth: '500px',
                        width: '90%',
                    }}>
                        <JobForm triggerReload={() => {
                            setReloadJobs(!reloadJobs);
                            setShowForm(false);
                        }} />
                        <button onClick={() => setShowForm(false)} style={{
                            marginTop: '10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <footer style={{ marginTop: '2rem', textAlign: 'center', position: 'sticky' }}>
                {!showForm && (
                    < button
                        onClick={() => setShowForm(true)}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: '#fb9bf0',
                            color: 'white',
                            fontSize: '32px',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            cursor: 'pointer',
                            zIndex: 1000,
                        }}
                    >
                        +
                    </button>

                )}

                {!premium && (
                    <img className="ad" src="/assets/img/placeholder.svg" alt="ad placeholder" />
                )}
            </footer>
        </div >
    );
};


const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;