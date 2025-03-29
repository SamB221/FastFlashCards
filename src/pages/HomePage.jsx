import React from 'react';
import HomeCards from '../components/HomeCards';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';
import LowerRightOption from '../components/LowerRightOption';

const HomePage = () => {
    const navigate = useNavigate();
    if (window.localStorage.length == 0) {
        navigate("/upload");
    } 

    return (
        <>
            <Title title={"Your Sets"} />
            <HomeCards />
            <LowerRightOption />
        </>
    );
};

export default HomePage;