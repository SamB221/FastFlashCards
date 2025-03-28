import React from 'react';
import SetCards from '../components/SetCards';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';
import {useParams} from 'react-router-dom';

const SetPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (window.localStorage.length == 0) {
        navigate("/upload");
    } 

    return (
        <>
            <Title title={"Set: " + id} />
            <SetCards setname={id} />
        </>
    );
};

export default SetPage;