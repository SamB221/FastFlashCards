import React from 'react';
import SetCards from '../components/SetCards';
import { Link, useNavigate, useParams } from "react-router-dom";
import Title from '../components/Title';

const SetPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (window.localStorage.length == 0) {
        navigate("/upload");
    } 

    return (
        <>
            <Title title={id} back="true" />
            <SetCards setname={id} />

            <Link className="lowerRightButton" to="basic"> 
                Start
            </Link>
        </>
    );
};

export default SetPage;