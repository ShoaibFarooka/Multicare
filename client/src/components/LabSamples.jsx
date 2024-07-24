import React, { useEffect, useState } from 'react';
import '../styles/LabSamples.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

// Set the app element for react-modal
Modal.setAppElement(document.body);

const LabSamples = ({ isAuthenticated }) => {
    const [samples, setSamples] = useState([]);
    const [unauthorized, setUnauthorized] = useState(false);
    const [IsOpenPopup, setIsOpenPopup] = useState(false);
    const [IsOpenPopup2, setIsOpenPopup2] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
        email: "",
        date: "",
        time: "",
        feedback: "",
    });

    const fetchSamples = async () => {
        try {
            const res = await axios.get(`/fetch-samples`);
            if (res.status === 200) {
                setSamples(res.data);
            }
        } catch (error) {
            console.log('Error while fetching samples: ', error);
            if (error.response.status === 404) {
                window.alert('samples not found!');
            }
            else {
                window.alert('Unable to fetch samples!');
            }
        }
    };
    useEffect(() => {
        const userData = Cookies.get('userData');
        if (!userData) {
            window.alert('Please Login First');
            navigate('/login');
        }
        else {
            const user = JSON.parse(userData);
            if (user.role !== 'lab') {
                setUnauthorized(true);
            }
            else {
                fetchSamples();
            }
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    const handleAccept = async (sample) => {
        try {
            const res = await axios.put('/accept-sample', {
                id: sample._id,
                email: sample.user.email
            });
            if (res.status === 200) {
                fetchSamples();
            }
        } catch (error) {
            console.log('Error while accepting sample: ', error);
        }
    };

    const handleSchedule = async () => {
        try {
            const res = await axios.put('/reschedule-sample', formData);
            if (res.status === 200) {
                handleModalClose();
                handleModalClose2();
                fetchSamples();
            }
        } catch (error) {
            console.log('Error while rescheduling: ', error);
        }
    };

    //Show Modal when button is clicked
    const handleClick = (sample) => {
        const date = new Date(sample.date);
        const isoFormattedDate = date.toISOString().split('T')[0];
        setFormData({
            id: sample._id,
            date: isoFormattedDate,
            time: sample.time,
            email: sample.user.email
        });
        setIsOpenPopup(true);
    };

    //Show Modal2 when button is clicked
    const handleClick2 = (sample) => {
        setFormData({
            ...formData,
            id: sample._id,
            feedback: "",
        });
        setIsOpenPopup2(true);
    };

    //Close Modal
    const handleModalClose = () => {
        // setFormData('');
        setIsOpenPopup(false);
    };

    //Close Modal2
    const handleModalClose2 = () => {
        setIsOpenPopup2(false);
    };

    const generateTimeSlots = () => {
        const timeSlots = [];
        let time = new Date("2000-01-01T09:00");

        while (time <= new Date("2000-01-01T17:00")) {
            timeSlots.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
            time.setMinutes(time.getMinutes() + 30);
        }

        return timeSlots;
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitReport = async () => {
        try {
            const data = {
                id: formData.id,
                feedback: formData.feedback
            }
            const res = await axios.put('/sample-feedback', data);
            if (res.status === 200) {
                handleModalClose();
                handleModalClose2();
                fetchSamples();
            }
        } catch (error) {
            console.log('Error while adding feedback: ', error);
            window.alert('Unable to add feedback!');
        }
    };

    return (
        <div>
            <Modal
                className="modal-2"
                overlayClassName="modal-overlay"
                isOpen={IsOpenPopup}
                onRequestClose={handleModalClose}>
                <FaTimes size={25} onClick={handleModalClose} className='cross-icon' />
                <div className="modal-main">
                    <h1>Reschedule Sample</h1>
                    <div className="mb-3">
                        <label htmlFor="date" className="">
                            Date
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            name="date"
                            min={getCurrentDate()}
                            onChange={handleInputChange}
                            value={formData.date}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="time" className="">
                            Time (9:00 AM - 5:00 AM)
                        </label>
                        <select
                            className="form-control"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a Time</option>
                            {generateTimeSlots().map((timeSlot, index) => (
                                <option key={index} value={timeSlot}>
                                    {timeSlot}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="btn-div">
                        <button className="btn" onClick={handleSchedule}>Update</button>
                    </div>
                </div>
            </Modal>
            <Modal
                className="modal-3"
                overlayClassName="modal-overlay"
                isOpen={IsOpenPopup2}
                onRequestClose={handleModalClose2}>
                <FaTimes size={25} onClick={handleModalClose2} className='cross-icon' />
                <div className="modal-main">
                    <h1>Test Report</h1>
                    <div className="mb-3">
                        <label htmlFor="feedback" className="">
                            Feedback:
                        </label>
                        <textarea
                            rows={10}
                            className="form-control"
                            id="feedback"
                            name="feedback"
                            onChange={handleInputChange}
                            value={formData.feedback}
                        />
                    </div>
                    <div className="btn-div">
                        <button className="btn" onClick={handleSubmitReport}>Submit Report</button>
                    </div>
                </div>
            </Modal>
            {unauthorized ?
                <div className='unauthorized-container'>
                    <div>
                        <h2 className='status'>401</h2>
                        <h2 className='text'>Unauthorized User</h2>
                    </div>
                </div>
                :
                <div className='user-samples'>
                    <h1 className='title'>Samples</h1>
                    {samples.length !== 0 ?
                        <div className='row mt-5 mb-5'>
                            {samples.map(sample => (
                                <div key={sample._id} className="col-md-4 mb-4">
                                    <div className="card card2 p-3">
                                        <div className="card-body text-center">
                                            <i className="fa fa-flask fa-4x mb-4 text-primary"></i>
                                            <h5 className="card-title mb-3 fs-4 fw-bold">Patient Sample</h5>
                                            <p className="card-text"><b>Patient Name: </b>{sample.user.name}</p>
                                            <p style={{fontSize: '14px'}} className="card-text"><b>Email: </b>{sample.user.email}</p>
                                            <p className="card-text"><b>Address: </b>{sample.address}</p>
                                            <p className="card-text"><b>Date: </b>{new Date(sample.date).toLocaleDateString()}</p>
                                            <p className="card-text"><b>Time: </b>{sample.time}</p>
                                            <p className="card-text"><b>Status: </b>{sample.status}</p>
                                            {sample.status === 'pending' &&
                                                <div className='btn-div'>
                                                    <button id="btn-1" className="btn" onClick={(e) => handleAccept(sample)}>Accept</button>
                                                    <button id="btn-2" className="btn" onClick={(e) => handleClick(sample)}>Reschedule</button>
                                                </div>
                                            }
                                            {sample.status !== 'pending' &&
                                                <>
                                                    {!sample.report ?
                                                        <div>
                                                            <button id="btn-1-1" className="btn" onClick={(e) => handleClick2(sample)}>Submit Report</button>
                                                        </div>
                                                        :
                                                        <div>
                                                            <p className="card-text"><b>Feedback: </b>{sample.report}</p>
                                                        </div>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <div className='para'>No samples yet.</div>
                    }
                </div>
            }
        </div>
    );
}

export default LabSamples;