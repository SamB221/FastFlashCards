import React from 'react';
import {Link} from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <>
            <img id="img404" className="centerImage" src="../../../404.svg" />
            <Link id="back" className="grnBtn centerBtn" to="/">Click here to return home</Link>
        </>
    );
};

export default NotFoundPage;