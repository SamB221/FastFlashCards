import React from 'react';
import '../../public/bolt.svg';

const BoltSpinner = () => {
    return (
        <div className="spinner-page">
            <div className="spinner-wrapper">
                <div className="spinner-ring"></div>
                <img src="/bolt.svg" alt="Loading..." className="lightning-image" />
            </div>
        </div>
    );
};

export default BoltSpinner;