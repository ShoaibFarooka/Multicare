import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Footer = () => {
    const userData = Cookies.get('userData');
    const role = userData ? JSON.parse(userData).role : null;

    return (
        <div>
            <footer className='footer text-white '>
                <div className="container">
                    <footer className="py-4">
                        <div className="row">
                            <div className="col-3">
                                <h2>Multicare</h2>
                            </div>

                            <div className='col-2'>
                                <h5>Company</h5>
                                <ul className="nav flex-column">
                                    <li className="nav-item mb-2 ">
                                        <Link to="#" className="nav-linl p-0 text-white">Home</Link></li>
                                    {(!role || role === 'user') &&
                                        <li className="nav-item mb-2 ">
                                            <Link to="#" className="nav-linl p-0 text-white">About</Link></li>
                                    }
                                    <li className="nav-item mb-2 ">
                                        <Link to="#" className="nav-linl p-0 text-white">Services</Link></li>
                                    {(!role || role === 'user') &&
                                        <li className="nav-item mb-2 ">
                                            <Link to="#" className="nav-linl p-0 text-white">Contact Us</Link></li>
                                    }
                                </ul>
                            </div>
                            {(!role || role === 'user') &&
                                <div className='col-2'>
                                    <h5>Menu</h5>
                                    <ul className="nav flex-column">
                                        <li className="nav-item mb-2 ">
                                            <Link to="#" className="nav-linl p-0 text-white">Book Appointment</Link></li>
                                        <li className="nav-item mb-2 ">
                                            <Link to="#" className="nav-linl p-0 text-white">Order Medicine</Link></li>
                                        <li className="nav-item mb-2 ">
                                            <Link to="#" className="nav-linl p-0 text-white">Sample Collection</Link></li>
                                        <li className="nav-item mb-2 ">
                                            <Link to="#" className="nav-linl p-0 text-white">Specialists doctor</Link></li>
                                        <li className="nav-item mb-2 ">
                                            <Link to="#" className="nav-linl p-0 text-white">Health Clinics</Link></li>
                                    </ul>
                                </div>
                            }
                            {(!role || role === 'user') &&
                                <div className="col-4 offset-1 ">
                                    <form>
                                        <h5>Subscribe to our newsletter</h5>
                                        <p>Monthly news of whats new and exciting from us.</p>
                                        <div className="d-flex w-100 gap-2">
                                            <label htmlFor='newsletter1' className='visually-hidden'>Email address</label>
                                            <input id="newsletter1" type="text" className='form-control' placeholder='Email Address' />
                                            <button className='btn btn-primary rounded-pill px-4' type="button">Subscribe</button>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>

                        <div className='d-flex justify-content-between pt-4  mt-4 border-top'>
                            <p>&#169; 2023 Project20 Company, Inc. All rights reserved.</p>
                            <ul className="list-unstyled d-flex">
                                <li className="ms-3">
                                    <Link className="link-light" to="#">
                                        <i className='fa fa-facebook fa-2x'>
                                        </i></Link>
                                </li>
                                <li className="ms-3">
                                    <Link className="link-light" to="#">
                                        <i className='fa fa-instagram fa-2x'>
                                        </i></Link>
                                </li>
                                <li className="ms-3">
                                    <Link className="link-light" to="#">
                                        <i className='fa fa-twitter fa-2x'>
                                        </i></Link>
                                </li>
                            </ul>

                        </div>
                    </footer>
                </div>
            </footer>
        </div>
    );
}

export default Footer;