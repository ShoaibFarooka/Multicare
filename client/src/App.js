import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Appointment from './components/Appointment';
import SampleCollection from './components/SampleCollection';
import SpecialistDoctors from './components/SpecialistDoctors';
import DoctorAppointments from './components/DoctorAppointments';
import TestReports from './components/TestReports';
import LabSamples from './components/LabSamples';
import OrderMedicines from './components/OrderMedicines';
import Success from './components/Success';
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('userData'));
  const [doctor, setDoctor] = useState('');
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route exact path='/' element={<Home isAuthenticated={isAuthenticated} />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/service' element={<Services isAuthenticated={isAuthenticated} />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route exact path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/appointment' element={<Appointment isAuthenticated={isAuthenticated} doctor={doctor} setDoctor={setDoctor} />} />
        <Route exact path='/samplecollection' element={<SampleCollection isAuthenticated={isAuthenticated}/>} />
        <Route exact path='/showdoctors' element={<SpecialistDoctors isAuthenticated={isAuthenticated} setDoctor={setDoctor} />} />
        <Route exact path='/showappointments' element={<DoctorAppointments isAuthenticated={isAuthenticated} />} />
        <Route exact path='/testreports' element={<TestReports isAuthenticated={isAuthenticated} />} />
        <Route exact path='/labsamples' element={<LabSamples isAuthenticated={isAuthenticated} />} />
        <Route exact path='/ordermedicine' element={<OrderMedicines isAuthenticated={isAuthenticated} />} />
        <Route exact path='/success' element={<Success isAuthenticated={isAuthenticated} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
