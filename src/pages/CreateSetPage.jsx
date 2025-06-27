import React from 'react';
import Title from '../components/Title';

const CreateSetPage = () => {
    const handleSubmit = (event) => {
        alert("hi");
        event.preventDefault();
        const selectedFile = fileInputRef.current.files[0];
        storeFile(selectedFile);
    };

    return (
        <>
            <Title title="Create a set" back="true" />
            <form id="setBuilder" onSubmit={handleSubmit}>
                <div id="setBuildingBox">
                    <label htmlFor="setName"><p>Enter the set name</p></label>
                    <input type="text" id="setName" name="firstname" placeholder="Set name..."></input>
                    
                    <div id="cardBuilders">
                        <div className="cardBuilder">
                            <div className="smallerBox">
                                <div className="flex">
                                    <label htmlFor="term1"><p>Enter a term</p></label>
                                    <input type="text" id="term1" name="firstname" placeholder="Term..."></input>
                                </div>
                                <label htmlFor="def2"><p>Enter a definition</p></label>
                                <input type="text" id="def2" name="firstname" placeholder="Definition..."></input>
                            </div>
                        </div>

                        <div className="cardBuilder">
                            <div className="smallerBox">
                                <div className="flex">
                                    <label htmlFor="term1"><p>Enter a term</p></label>
                                    <input type="text" id="term1" name="firstname" placeholder="Term..."></input>
                                </div>
                                <label htmlFor="def2"><p>Enter a definition</p></label>
                                <input type="text" id="def2" name="firstname" placeholder="Definition..."></input>
                            </div>
                        </div>
                    </div>
                </div>
                <form className="lowerRight grnBtn" onClick={handleSubmit}>
                    <input type="button" value="Done"/>
                </form>
            </form>
        </>
    );
};

export default CreateSetPage;