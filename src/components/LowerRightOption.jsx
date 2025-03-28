import React from 'react';
import { useNavigate } from "react-router-dom";
import './LowerRightOption.css';

const LowerRightOption = () => {
    const navigate = useNavigate();
    function removeSet(e) {
        e.preventDefault();
        navigate("/upload");
    };
    return (
        <form id="resetbutton">
            <input id="reset" type="button" value="Add a set" onClick={removeSet}/>
        </form>
    );
};

export default LowerRightOption;