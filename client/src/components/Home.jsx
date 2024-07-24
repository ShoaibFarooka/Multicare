import React from 'react';
import About from './About';
import Contact from './Contact';
import Services from './Services';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';

const Home = ({ isAuthenticated }) => {
    const userData = Cookies.get('userData');
    const role = userData ? JSON.parse(userData).role : null;
    console.log(role);
    return (
        <div>
            <section id="home">
                <div className="container">
                    <div className="row justify-content-center ">
                        <div className="col-mod-8 mt-5">
                            <h1 className="display-4 fw-bolder mb-4 text-center text-white">Multicare Medical Clinic</h1>
                            <p className='lead text-center fs-4 mb-5 text-white '>
                                Experience the future of healthcare with Multicare Health's user-friendly website, offering a one-stop destination for personalized care, medical insights, and a healthier, happier you.
                                Discover a world of wellness at your fingertips with Multicare Health's comprehensive website services, providing expert guidance and resources for your holistic health journey
                            </p>
                            <div className='buttons d-flex justify-content-center '>
                                {(!role || role === 'user') && <NavLink to="/contact" className='btn btn-light me-4 rounded-pill px-4 py-2 '>Get Quote</NavLink>}
                                <NavLink to="/service" className='btn btn-outline-light rounded-pill px-4 py-2 '>Our Services</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {(!role || role === 'user') && <About />}
            <Services isAuthenticated={isAuthenticated} />
            {(!role || role === 'user') && <Contact />}
        </div>
    );
}

export default Home;