import React from 'react';
import { useNavigate } from "react-router-dom";
import './LowerRightOption.css';

const LowerRightOption = () => {
    const navigate = useNavigate();
    function removeSet(e) {
        e.preventDefault();
        localStorage.removeItem("set");
        localStorage.removeItem("setName");
        navigate("/upload");
    };
    return (
        <form id="resetbutton">
            <input id="reset" type="button" value="Replace set" onClick={removeSet}/>
        </form>
    );
};

export default LowerRightOption;