import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Appointment = ({ isAuthenticated, doctor, setDoctor }) => {
    const user = JSON.parse(Cookies.get('userData'));
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        date: "",
        time: "",
        reason: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    let navigate = useNavigate();

    useEffect(() => {
        if (doctor === '') {
            window.alert('Please Select Doctor for appointment!');
            navigate('/showdoctors');
        }
        else {
            window.scrollTo(0, 0);
        }
        return () => {
            setDoctor('');
        };
    }, []);

    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [name]: value });
        // Clear validation error when the user starts typing again
        setValidationErrors({ ...validationErrors, [name]: "" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isAuthenticated) {
            return window.alert('Please Login First!');
        }
        else if (doctor === '') {
            window.alert('Please Select Doctor for appointment!');
            navigate('/showdoctors');
            return;
        }
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            const userData = JSON.parse(Cookies.get('userData'));
            const data = {
                ...formData,
                user: userData._id,
                doctor: doctor._id,
            }
            try {
                // Make a POST request to your backend API
                const res = await fetch('/create-appointment', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (res.status === 400 || !res) {
                    window.alert("Not submitted");
                } else {
                    window.alert("Appointment booked");
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            setValidationErrors(errors);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = "Name is required";
        }
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!isValidEmail(formData.email)) {
            errors.email = "Invalid email format";
        }
        if (!formData.contact) {
            errors.contact = "Contact is required";
        } else if (!isValidPhoneNumber(formData.contact)) {
            errors.contact = "Contact must be a 10-digit number";
        }
        if (!formData.date) {
            errors.date = "Date is required";
        } else if (!isFutureDate(formData.date)) {
            errors.date = "Date must be in the future";
        }
        if (!formData.time) {
            errors.time = "Time is required";
        }
        if (!formData.reason) {
            errors.reason = "Reason for appointment is required";
        }
        return errors;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegex.test(email);
    };

    const isValidPhoneNumber = (input) => {
        const phoneNumberPattern = /^\d{10}$/;
        return phoneNumberPattern.test(input);
    };

    const isFutureDate = (date) => {
        return new Date(date) > new Date();
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

    return (
        <div>
            <div className="container shadow my-5">
                <div className="row justify-content-end">
                    <div className="col-md-5 d-flex flex-column align-items-center text-black justify-content-center order">
                        <h1 className="display-4 fw-bolder">Hello</h1>
                        <img src="/assets/appointment.jpg" alt="Contact" className="w-75 img-fluid   " />
                        <p className="lead text-center">Enter Your Details To Get an Appointment</p>
                    </div>
                    <div className="col-md-6 p-5">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    onChange={handleInputChange}
                                    value={formData.name}
                                    disabled
                                />
                                {validationErrors.name && (
                                    <div className="text-danger">{validationErrors.name}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="name@example.com"
                                    id="email"
                                    name="email"
                                    onChange={handleInputChange}
                                    value={formData.email}
                                    disabled
                                />
                                {validationErrors.email && (
                                    <div className="text-danger">{validationErrors.email}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="contact" className="form-label">
                                    Contact
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="contact"
                                    name="contact"
                                    onChange={handleInputChange}
                                    value={formData.contact}
                                    disabled
                                />
                                {validationErrors.contact && (
                                    <div className="text-danger">{validationErrors.contact}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">
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
                                {validationErrors.date && (
                                    <div className="text-danger">{validationErrors.date}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="time" className="form-label">
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
                                {validationErrors.time && (
                                    <div className="text-danger">{validationErrors.time}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reason" className="form-label">
                                    Reason for Appointment
                                </label>
                                <textarea
                                    className="form-control"
                                    id="reason"
                                    name="reason"
                                    rows="4"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                />
                                {validationErrors.reason && (
                                    <div className="text-danger">{validationErrors.reason}</div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-outline-primary w-100 mt-4 rounded-pill">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Appointment;
