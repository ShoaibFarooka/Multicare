import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SampleCollection = ({ isAuthenticated }) => {
  let user = Cookies.get('userData');
  const [unauthorized, setUnauthorized] = useState(false);
  const [formData, setFormData] = useState({
    name: JSON.parse(user)?.name || '',
    email: JSON.parse(user)?.email || '',
    contact: JSON.parse(user)?.contact || '',
    age: JSON.parse(user)?.age || '',
    gender: JSON.parse(user)?.gender || '',
    date: "",
    time: "",
    address: "",
    agree: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    age: "",
    gender: "",
    date: "",
    time: "",
    address: "",
    agree: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

  }, []);
  useEffect(() => {
    if (!isAuthenticated) {
      window.alert('Please Login First');
      navigate('/login');
    }
    else {
      user = JSON.parse(user);
      if (user.role !== 'user') {
        setUnauthorized(true);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = JSON.parse(Cookies.get('userData'));
      const data = {
        userID: userData._id,
        date: formData.date,
        time: formData.time,
        address: formData.address
      }
      try {
        const res = await axios.post('/create-collection-request', data);
        if (res.status === 200) {
          window.alert('Sample Collection Request Sent!');
          navigate('/');
        }
      } catch (error) {
        console.log('Eroor while creating sample collection request: ', error);
        window.alert('Sample Collection Request Failed!');
      }
    }
    else {
      console.log("Form validation failed");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Basic validation rules (you may customize these)
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    } else {
      newErrors.email = "";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Invalid contact number (exactly 10 digits)";
      isValid = false;
    } else {
      newErrors.contact = "";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else if (!isFutureDate(formData.date)) {
      newErrors.date = "Date must be in the future";
    }
    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    // Add more validation rules for other fields if needed

    setErrors(newErrors);
    return isValid;
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
      {unauthorized ?
        <div className='unauthorized-container'>
          <div>
            <h2 className='status'>401</h2>
            <h2 className='text'>Unauthorized User</h2>
          </div>
        </div>
        :
        <section id="samplecollection">
          <div className="container my-5 py-5  ">
            <div className="row mb-5 ">
              <div>
                <h2 className="text-center mb-4">Sample Collection Request</h2>
                <p className="text-center text-end mb-4 text-justify" >We offer high-quality home sample collection services. When it comes
                  to diagnosing a medical condition, blood and urine tests play a pivotal role in determining the patient’s
                  condition. Blood and urine tests help the medical professionals precisely diagnose the patient and plan treatment
                  as per the patient’s medical requirement.However, it may not always be possible for patients to visit the hospital
                  for such tests. Moreover, patients may also need to repeat blood tests every couple of months to know and regulate
                  if their condition is getting better. Such patients may opt for a home sample collection, and results will also
                  be provided to them at their homes. </p>
                <hr className="w-25 mx-auto mb-5" />
              </div>
            </div>
            <div>
              <img src="/assets/sample.png" alt="SampleCollection" className="w-75 rounded mx-auto d-block" />
            </div>
            <div className="row justify-content-end">
              <div className="col-md-5 d-flex flex-column align-items-center text-black justify-content-center order-2 ">
                <h1 className="display-4 fw-bolder">Hello</h1>
                <img src="/assets/sample.jpg" alt="Contact" className="w-75 img-fluid   " />
                <p className="lead text-center">Book your sample collection now</p>
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
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled
                    />
                    <div className="text-danger">{errors.name}</div>
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
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled
                    />
                    <div className="text-danger">{errors.email}</div>
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
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      disabled
                    />
                    <div className="text-danger">{errors.contact}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      type="text" // Changed to type="text" for better pattern validation
                      className="form-control"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      disabled
                    />
                    <div className="text-danger">{errors.age}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <input
                      type="text" // Changed to type="text" for better pattern validation
                      className="form-control"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      disabled
                    />
                    <div className="text-danger">{errors.gender}</div>
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
                      onChange={handleChange}
                      value={formData.date}
                    />
                    {errors.date && (
                      <div className="text-danger">{errors.date}</div>
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
                      onChange={handleChange}
                    >
                      <option value="">Select a Time</option>
                      {generateTimeSlots().map((timeSlot, index) => (
                        <option key={index} value={timeSlot}>
                          {timeSlot}
                        </option>
                      ))}
                    </select>
                    {errors.time && (
                      <div className="text-danger">{errors.time}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    <div className="text-danger">{errors.address}</div>
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                      I Agree to terms and Conditions
                    </label>
                    <div className="text-danger">{errors.agree}</div>
                  </div>
                  <button type="submit" className="btn btn-outline-primary w-100 mt-4 rounded-pill">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      }
    </div>
  );
};

export default SampleCollection;
