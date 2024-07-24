import React from 'react';

const About = () => {
    return (
        <div>
            <section id="about">
                <div className='container my-5 py-4 '>
                    <div className='row'>
                        <div className='col-md-6'>
                            <img src="/assets/about1.jpg" alt="About" className='w-75 mt-5 '/>
                        </div>

                        <div className="col-md-6">
                            <h3 className="fs-5 mb-0 ">About Us</h3>
                            <h1 className="display-6 mb-2 ">Who <b>We</b> Are</h1>
                            <hr className='w-50'/>
                            <p className="lead mb-4 "> Itis a window into our commitment to patient-centric healthcare. 
                            We take pride in our team of dedicated medical professionals who offer compassionate and personalized care.
                             On this page, you'll discover our clinic's rich history, our core values, and our mission to provide 
                             high-quality, accessible healthcare services. It's your introduction to the heart of our healthcare family, 
                             where your well-being is our foremost priority.</p>
                            <button className='btn btn-primary rounded-pill px-4 py-2 '>Get Started</button>
                            <button className='btn btn-outline-primary rounded-pill px-4 py-2 ms-2 '>Contact Us</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;