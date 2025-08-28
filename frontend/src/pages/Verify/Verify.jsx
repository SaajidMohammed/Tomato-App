import React from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useEffect, useCallback } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = useCallback(async () => {
        try {
            const response = await axios.post(
                `${url}/api/order/verify`,
                { success, orderId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                navigate("/myorders");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Verification API call failed", error);
            navigate("/");
        }
    }, [success, orderId, url, token, navigate]);

    useEffect(() => {
        if (token) {
            verifyPayment();
        }
    }, [token, verifyPayment]);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;