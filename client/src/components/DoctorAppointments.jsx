import React, { useEffect, useState } from 'react';
import '../styles/DoctorAppointments.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

// Set the app element for react-modal
Modal.setAppElement(document.body);

const DoctorAppointments = ({ isAuthenticated }) => {
    const [appointments, setAppointments] = useState([]);
    const [unauthorized, setUnauthorized] = useState(false);
    const [IsOpenPopup, setIsOpenPopup] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
        email: "",
        date: "",
        time: "",
    });

    const fetchAppointments = async () => {
        const id = JSON.parse(Cookies.get('userData'))._id;
        try {
            const res = await axios.get(`/fetch-appointments/${id}`);
            if (res.status === 200) {
                setAppointments(res.data);
            }
        } catch (error) {
            console.log('Error while fetching appointments: ', error);
            if (error.response.status === 404) {
                window.alert('Appointments not found!');
            }
            else {
                window.alert('Unable to fetch appointments!');
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
            if (user.role !== 'doctor') {
                setUnauthorized(true);
            }
            else {
                fetchAppointments();
            }
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    const handleAccept = async (appointment) => {
        try {
            const res = await axios.put('/accept-appointment', {
                id: appointment._id,
                email: appointment.email
            });
            if (res.status === 200) {
                fetchAppointments();
            }
        } catch (error) {
            console.log('Error while accepting appointment: ', error);
        }
    };

    const handleSchedule = async () => {
        try {
            const res = await axios.put('/reschedule-appointment', formData);
            if (res.status === 200) {
                handleModalClose();
                fetchAppointments();
            }
        } catch (error) {
            console.log('Error while rescheduling: ', error);
        }
    };

    //Show Modal when button is clicked
    const handleClick = (appointment) => {
        const date = new Date(appointment.date);
        const isoFormattedDate = date.toISOString().split('T')[0];
        setFormData({
            id: appointment._id,
            date: isoFormattedDate,
            time: appointment.time,
            email: appointment.email
        });
        setIsOpenPopup(true);
    };

    //Close Modal
    const handleModalClose = () => {
        // setFormData('');
        setIsOpenPopup(false);
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

    return (
        <div>
            <Modal
                className="modal-1"
                overlayClassName="modal-overlay"
                isOpen={IsOpenPopup}
                onRequestClose={handleModalClose}>
                <FaTimes size={25} onClick={handleModalClose} className='cross-icon' />
                <div className="modal-main">
                    <h1>Reschedule Appointment</h1>
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
            {unauthorized ?
                <div className='unauthorized-container'>
                    <div>
                        <h2 className='status'>401</h2>
                        <h2 className='text'>Unauthorized User</h2>
                    </div>
                </div>
                :
                <div className='doctor-appointments'>
                    <h1 className='title'>Appointments</h1>
                    {appointments.length !== 0 ?
                        <div className='row mt-5 mb-5'>
                            {appointments.map(appointment => (
                                <div key={appointment._id} className="col-md-4 mb-4">
                                    <div className="card card2 p-3">
                                        <div className="card-body text-center">
                                            <i className="fa fa-calendar-check-o fa-4x mb-4 text-primary"></i>
                                            <h5 className="card-title mb-3 fs-4 fw-bold">Patient Appointment</h5>
                                            <p className="card-text"><b>Patient Name: </b>{appointment.name}</p>
                                            <p className="card-text"><b>Problem: </b>{appointment.reason}</p>
                                            <p className="card-text"><b>Date: </b>{new Date(appointment.date).toLocaleDateString()}</p>
                                            <p className="card-text"><b>Time: </b>{appointment.time}</p>
                                            <p className="card-text"><b>Status: </b>{appointment.status}</p>
                                            {appointment.status === 'pending' &&
                                                <div className='btn-div'>
                                                    <button id="btn-1" className="btn" onClick={(e) => handleAccept(appointment)}>Accept</button>
                                                    <button id="btn-2" className="btn" onClick={(e) => handleClick(appointment)}>Reschedule</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <div className='para'>No Appointments yet.</div>
                    }
                </div>
            }
        </div>
    );
}

export default DoctorAppointments;