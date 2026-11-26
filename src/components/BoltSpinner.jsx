import React from 'react';
import '/bolt.svg?url';

const BoltSpinner = () => {
    return (
        <div className="spinner-page">
            <div className="spinner-wrapper">
                <div className="spinner-ring"></div>
                <img src="/bolt.svg" className="lightning-image" />
            </div>
        </div>
    );
};

export default BoltSpinner;
