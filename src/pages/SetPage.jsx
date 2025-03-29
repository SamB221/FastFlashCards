import React from 'react';
import SetCards from '../components/SetCards';
import { useNavigate } from "react-router-dom";
import {useParams} from 'react-router-dom';
import UIBar from '../components/UIBar';
import PlayButton from '../components/UIBarButton';

const SetPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (window.localStorage.length == 0) {
        navigate("/upload");
    } 

    return (
        <>
            <UIBar title={"Set: " + id} option="Basic Flashcards" location="basic"/>
            <SetCards setname={id} />
        </>
    );
};

export default SetPage;