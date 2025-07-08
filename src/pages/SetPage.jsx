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

    function editSet(e) {
        e.preventDefault();
        navigate("edit");
    };

    return (
        <>
            <Title title={id} back="true" />
            <SetCards setname={id} />

            <button className="redBtn lowerLeft" onClick={editSet}>Edit</button>
            <div className="dropUp alwaysWhite">
                <button className="dropBtn grnBtn alwaysWhite">Start</button>
                <div className="dropupContent">
                    <Link to="match">Match</Link>
                    <Link to="master">Master</Link>
                    <Link to="basic">Basic</Link>
                </div>
            </div>
        </>
    );
};

export default SetPage;