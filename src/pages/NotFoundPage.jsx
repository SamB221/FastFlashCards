import React from 'react';
import {Link} from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <>
            <img id="img404" src="../../../public/404.svg" />
            <Link id="back" to="/">Click here to return home</Link>
        </>
    );
};

export default NotFoundPage;