import { NavLink } from "react-router-dom";
import Cookies from 'js-cookie';
import { useEffect } from "react";

const Services = ({ isAuthenticated }) => {
    const userData = Cookies.get('userData');
    const role = userData ? JSON.parse(userData).role : null;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            <section id="service">
                <div className="container my-5 py-5">
                    <div className="row">
                        <div className="col-12">
                            <h3 className="fs-5 text-center mb-0">Our Services</h3>
                            <h1 className="display-6 text-center mb-4">Our <b>Awesome</b> Services</h1>
                            <hr className="w-25 mx-auto " />
                        </div>
                        {(role === 'user' || !isAuthenticated) ?
                            <>
                                <div className="row mt-5">
                                    <div className="col-md-4">
                                        <div className="card p-3">
                                            <div className="card-body text-center">
                                                <i className="fa fa-address-card fa-4x mb-4 text-primary"></i>
                                                <NavLink to="/testreports" className="black-link">
                                                    <h5 className="card-title mb-3 fs-4 fw-bold">Test reports</h5>
                                                </NavLink>
                                                <p className="card-text lead">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card p-3">
                                            <div className="card-body text-center">
                                                <i className="fa fa-calendar-check-o fa-4x mb-4 text-primary"></i>
                                                <NavLink to="/Appointment" className="black-link">  {/* Added class for styling */}
                                                    <h5 className="card-title mb-3 fs-4 fw-bold">Book Appointment</h5>
                                                </NavLink>
                                                <p className="card-text lead">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card p-3">
                                            <div className="card-body text-center">
                                                <i className="fa fa-cart-plus fa-4x mb-4 text-primary"></i>
                                                <NavLink to="/ordermedicine" className="black-link">
                                                <h5 className="card-title mb-3 fs-4 fw-bold">Order medicine</h5>
                                                </NavLink>
                                                <p className="card-text lead">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-md-4">
                                        <div className="card p-3">
                                            <div className="card-body text-center">
                                                <i className="fa fa-flask fa-4x mb-4 text-primary"></i>
                                                <NavLink to="/samplecollection" className="black-link">
                                                    <h5 className="card-title mb-3 fs-4 fw-bold">Sample collection</h5>
                                                </NavLink>
                                                <p className="card-text lead">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card p-3">
                                            <div className="card-body text-center">
                                                <i className="fa fa-user-md fa-4x mb-4 text-primary"></i>
                                                <NavLink to="/showdoctors" className="black-link">
                                                    <h5 className="card-title mb-3 fs-4 fw-bold">Specialists doctor</h5>
                                                </NavLink>
                                                <p className="card-text lead">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card p-3">
                                            <div className="card-body text-center">
                                                <i className="fa fa-map-marker fa-4x mb-4 text-primary"></i>
                                                <h5 className="card-title mb-3 fs-4 fw-bold">Health clinic</h5>
                                                <p className="card-text lead">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                            : role === 'doctor' ?
                                <>
                                    <div className="row mt-5">
                                        <div className="col-md-4">
                                            <div className="card p-3">
                                                <div className="card-body text-center">
                                                    <i className="fa fa-calendar-check-o fa-4x mb-4 text-primary"></i>
                                                    <NavLink to="/showappointments" className="black-link">
                                                        <h5 className="card-title mb-3 fs-4 fw-bold">Your Appointments</h5>
                                                    </NavLink>
                                                    <p className="card-text lead">Here is your all appointments which include scheduled appointments and appointments to be approved.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="row mt-5">
                                        <div className="col-md-4">
                                            <div className="card p-3">
                                                <div className="card-body text-center">
                                                    <i className="fa fa-flask fa-4x mb-4 text-primary"></i>
                                                    <NavLink to="/labsamples" className="black-link">
                                                        <h5 className="card-title mb-3 fs-4 fw-bold">Sample Requests</h5>
                                                    </NavLink>
                                                    <p className="card-text lead">Here is your test sample requests which you can accept or reschedule and can also write feedback of test.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;
