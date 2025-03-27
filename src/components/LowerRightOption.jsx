import React from 'react';
import './LowerRightOption.css';

const LowerRightOption = () => {
    function removeSet(e) {
        e.preventDefault();
        localStorage.removeItem("set");
        localStorage.removeItem("setName");
        window.location.reload();
    };
    return (
        <form id="resetbutton">
            <input id="reset" type="button" value="Replace set" onClick={removeSet}/>
        </form>
    );
};

export default LowerRightOption;