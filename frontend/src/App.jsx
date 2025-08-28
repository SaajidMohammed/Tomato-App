import React, { useState, useContext } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Placeorder from './pages/Placeorder/Placeorder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';

// --- Add these two imports ---
import { StoreContext } from './context/StoreContext.jsx';
import MyOrders from './pages/MyOrders/MyOrders.jsx';

// --- Add this small test component ---
const ContextTester = () => {
    const contextValue = useContext(StoreContext);
    console.log("--- DIRECT CONTEXT TEST ---");
    console.log("Value from useContext:", contextValue);
    return null; // This component renders nothing.
};

const App = () => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <ContextTester /> {/* We add the test component here */}
            {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
            <div className='app'>
                <Navbar setShowLogin={setShowLogin} />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/order' element={<Placeorder />} />
                    <Route path='/verify' element={<Verify />} />
                    <Route path='/myorders' element={<MyOrders />}/>
                </Routes>
            </div>
            <Footer />
        </>
    );
};

export default App;