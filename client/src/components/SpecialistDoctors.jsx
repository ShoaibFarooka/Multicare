import React, { useEffect, useState } from 'react';
import '../styles/SpecialistDoctors.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SpecialistDoctors = ({ isAuthenticated, setDoctor }) => {
    const [doctors, setDoctors] = useState('');
    const navigate = useNavigate();

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('http://localhost:3001/fetch-doctors');
            if (res.status === 200) {
                setDoctors(res.data);
            }
        } catch (error) {
            console.log('Error while fetching doctors: ', error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDoctors();
    }, []);

    const handleBook = (doctor) => {
        if (!isAuthenticated) {
            window.alert('Please Login First!');
            navigate('/login');
        }
        else {
            setDoctor(doctor);
            navigate('/appointment');
        }
    };

    return (
        <div>
            <div className="profiles-container">
                {doctors ? doctors.map((doctor, index) => (
                    <div key={index} className='profile-card'>
                        <img className='image' src={doctor.image} alt="Doctor's pic" />
                        <div className="name">
                            {doctor.name}
                        </div>
                        <div className='specialty'>
                            {doctor.specialty}
                        </div>
                        <div className="btn-container">
                            <button onClick={() => handleBook(doctor)} className="btn btn1">
                                Book Doctor
                            </button>
                        </div>
                    </div>
                ))
                    :
                    <div>
                        No Doctor Found!
                    </div>
                }
            </div>

        </div>
    );
}

export default SpecialistDoctors;