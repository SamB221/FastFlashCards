import React from 'react';
import SetCards from '../components/SetCards';
import { useNavigate } from "react-router-dom";
import {useParams} from 'react-router-dom';
import UIBar from '../components/UIBar';
import PlayButton from '../components/PlayButton';

const SetPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (window.localStorage.length == 0) {
        navigate("/upload");
    } 

    return (
        <>
            <UIBar title={"Set: " + id} />
            <SetCards setname={id} />
        </>
    );
};

export default SetPage;