import React from 'react'

const LowerLeftOption = () => {
    function removeSet(e) {
        e.preventDefault();
        localStorage.removeItem("set");
        localStorage.removeItem("setName");
        window.location.reload();
    };
    return (
        <form>
            <input id="reset" type="button" value="Replace set" onClick={removeSet}/>
        </form>
    )
}

export default LowerLeftOption;