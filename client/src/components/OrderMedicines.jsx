import React, { useEffect, useState } from 'react';
import '../styles/OrderMedicines.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import medicines from './data.json';

// Set the app element for react-modal
Modal.setAppElement(document.body);

const OrderMedicines = ({ isAuthenticated }) => {
    const [unauthorized, setUnauthorized] = useState(false);
    const [IsOpenPopup, setIsOpenPopup] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        quantity: 1,
        totalPrice: 0,
        shippingAddress: '',
    });

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

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
        else {
            window.scrollTo(0, 0);
        }
    }, [isAuthenticated]);

    //Show Modal when button is clicked
    const handleClick = (medicine) => {
        setFormData({
            ...formData,
            name: medicine.medicineName,
            price: medicine.price,
            quantity: 1,
            totalPrice: medicine.price * 1
        });
        setIsOpenPopup(true);
    };

    //Close Modal
    const handleModalClose = () => {
        setIsOpenPopup(false);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0) {
            setFormData({
                ...formData,
                quantity: newQuantity,
                totalPrice: formData.price * newQuantity,
            });
        };
    };

    const handlePayment = async () => {
        try {
            const userData = JSON.parse(Cookies.get('userData'));
            const data = {
                id: userData._id,
                name: formData.name,
                unit_amount: formData.price * 100,
                quantity: formData.quantity,
                address: formData.shippingAddress,
            }
            const res = await axios.post('/create-checkout-session', data);
            if (res.status === 200) {
                window.location.href = res.data.url;
            }
        } catch (error) {
            console.log('Error in Stripe: ', error);
            window.alert('Stripe Error!');
        }
    };

    return (
        <div>
            <Modal
                className="modal-4"
                overlayClassName="modal-overlay"
                isOpen={IsOpenPopup}
                onRequestClose={handleModalClose}>
                <FaTimes size={25} onClick={handleModalClose} className='cross-icon' />
                <div className="modal-main">
                    <h1>Buy Medicine</h1>
                    <div><b>Medicine: </b>{formData.name}</div>
                    <div><b>Cost per Item: </b>{formData.price}$</div>
                    <div><b>Quantity: </b>
                        <button className='quantity-btn' onClick={(e) => { handleQuantityChange(formData.quantity - 1) }}>-</button>
                        {formData.quantity}
                        <button className='quantity-btn' onClick={(e) => { handleQuantityChange(formData.quantity + 1) }}>+</button>
                    </div>
                    <div><b>Total Price: </b>{formData.totalPrice}$</div>
                    <div><b>Shipping Address: </b><input type='text' value={formData.shippingAddress} onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })} /></div>
                    <div className="btn-div">
                        <button className="btn" onClick={handlePayment} >Confirm and Continue</button>
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
                <div className='order-medicines'>
                    <h1 className='title'>Medicines</h1>
                    {medicines ?
                        <div className='row mt-5 mb-5'>
                            {medicines.map(medicine => (
                                <div key={medicine.id} className="col-md-3 mb-4">
                                    <div className="card card2 p-3">
                                        <div className="card-body text-center">
                                            <img width='150px' height='100px' src={medicine.medicineImage} />
                                            <p className="card-text">{medicine.medicineName}</p>
                                            <p className="card-text">{medicine.chemicalFormula}</p>
                                            <p className="card-text">{medicine.company}</p>
                                            <p className="card-text">{medicine.price}$</p>
                                            <div className='btn-div'>
                                                <button id="btn-1" className="btn" onClick={(e) => handleClick(medicine)}>Purchase Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                        :
                        <div className='para'>No medicines yet.</div>
                    }
                </div>
            }
        </div>
    );
}

export default OrderMedicines;