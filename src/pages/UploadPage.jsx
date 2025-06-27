import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';

const UploadPage = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const selectedFile = fileInputRef.current.files[0];
        storeFile(selectedFile);
    };
  
    function storeFile(formData) {
        var inputFile = formData;
        var reader = new FileReader();
        reader.readAsText(inputFile, "UTF-8");
    
        reader.onload = function (evt) {
            var input = evt.target.result.split('\n');
            var inputLength = input.length;
            var set = new Array(inputLength);
            var fileName = inputFile.name.substring(0, inputFile.name.length-4);
            for (let i = 0; i < inputLength; i++) {
                var currentString = split(input[i]); //UPDATE LATER: escape quotes
                var currentCard = new Object();
                currentCard.Term = parseString(currentString[0]);
                currentCard.Definition = parseString(currentString[1]);
                currentCard.Mastery = 0;
                set[i] = currentCard;
            }
            localStorage.setItem(fileName, JSON.stringify({set}));
            navigate("/");
        }
    
        reader.onerror = function () {
            document.getElementById("fileContents").innerHTML = "error reading file";
        }
    }

    function split(s) {
        let returnVal = [];
        let inQuotes = false;
        let startIndex = 0;
        for (let i = 0; i < s.length; i++) {
            if (s.charAt(i) == '"') inQuotes = !inQuotes;
            if (!inQuotes && s.charAt(i) == ',') {
                returnVal.push(s.substring(startIndex, i));
                startIndex = i+1;
            }
        }

        returnVal.push(s.substring(startIndex, s.length));
        return returnVal;
    }
  
    function parseString(s) {
        if (s.charAt(0) == '"' && s.charAt(s.length-1) == '"') {
            return s.substring(1, s.length-2);
        } else {
            return s;
        }
    }
  
    return (
        <>
            <Title title="Upload" back="true" />
            <div id="uploadcontainer" className="middleBox">
                <div id="uploadtext">
                <h1>Upload a CSV</h1>
                    <p>Use the following format: Term,Definition <br /> 
                        If a comma is used in a definition, be sure to <br /> 
                        surround the definition with quotation marks.
                    </p>
                </div>
                <form id="uploadform" onSubmit={handleSubmit}>
                    <input id="fileupload" className="fileUpload" name="file" type="file" accept=".csv,.txt" ref={fileInputRef} />
                    <br />
                    <button id="uploaded" className="uploadButton">Upload</button>
                </form>
            </div>
        </>
    );
};

export default UploadPage;