import React, { useEffect, useState } from 'react';
import '../styles/TestReports.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const TestReports = ({ isAuthenticated }) => {
    const [reports, setReports] = useState([]);
    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate();

    const fetchReports = async () => {
        const id = JSON.parse(Cookies.get('userData'))._id;
        try {
            const res = await axios.get(`/fetch-reports/${id}`);
            if (res.status === 200) {
                setReports(res.data);
            }
        } catch (error) {
            console.log('Error while fetching reports: ', error);
            if (error.response.status === 404) {
                window.alert('reports not found!');
            }
            else {
                window.alert('Unable to fetch reports!');
            }
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            window.alert('Please Login First');
            navigate('/login');
        }
        else {
            const userData = Cookies.get('userData');
            const user = JSON.parse(userData);
            if (user.role !== 'user') {
                setUnauthorized(true);
            }
            else {
                fetchReports();
            }
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);


    return (
        <div className='test-report'>
            {unauthorized ?
                <div className='unauthorized-container'>
                    <div>
                        <h2 className='status'>401</h2>
                        <h2 className='text'>Unauthorized User</h2>
                    </div>
                </div>
                :
                <div className='test-reports'>
                    <h1 className='title'>Test Reports</h1>
                    {reports.length !== 0 ?
                        <div className='row mt-5 mb-5'>
                            {reports.map(report => (
                                <div key={report._id} className="col-md-4 mb-4">
                                    <div className="card card2 p-3">
                                        <div className="card-body text-center">
                                        <i className="fa fa-user-md fa-4x mb-4 text-primary"></i>
                                            <h5 className="card-title mb-3 fs-4 fw-bold">Test Report</h5>
                                            <p className="card-text"><b>Date: </b>{new Date(report.date).toLocaleDateString()}</p>
                                            <p className="card-text"><b>Time: </b>{report.time}</p>
                                            <p className="card-text"><b>Status: </b>{report.status}</p>
                                            {report.report && <p className="card-text"><b>Result: </b>{report.report}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <div className='para'>No reports yet.</div>
                    }
                </div>
            }
        </div>
    );
};

export default TestReports;