import React from 'react';
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
    return (
        <>
            <h1 className="centerText">Welcome to Fast FlashCards!</h1>
            <div className="dualBox">
                <NavLink className="leftDualBox" to="/upload">
                    <p>Upload from a CSV (recommended)</p>
                    <img id="uploadIcon" src="../../../uploadIcon.png" />
                </NavLink>
                <NavLink className="rightDualBox" to="/create">
                    <p>Create set manually</p>
                    <img id="manualIcon" src="../../../manualIcon.svg" />
                </NavLink>
            </div>
        </>
    );
};

export default LandingPage;