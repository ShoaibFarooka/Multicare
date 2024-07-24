import React, { useEffect, useState } from "react";
import '../styles/Success.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = Cookies.get('userData');
        if (!userData) {
            window.alert('Please Login First');
            navigate('/login');
        }
        else {
            const user = JSON.parse(userData);
            if (user.role !== 'user') {
                setUnauthorized(true);
            }
        }
    }, []);

    return (
        <>
            {unauthorized ?
                <div className='unauthorized-container'>
                    <div>
                        <h2 className='status'>401</h2>
                        <h2 className='text'>Unauthorized User</h2>
                    </div>
                </div>
                :
                <div className="Success">
                    <h1>Thanks for your Payment!</h1>
                </div>
            }
        </>
    );
};

export default Success;