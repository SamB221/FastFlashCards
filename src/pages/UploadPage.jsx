import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './UploadPage.css';

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
                var currentString = input[i].split(",");
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
  
      function parseString(s) {
        if (s.charAt(0) == '"' && s.charAt(s.length) == '"') {
          return s.substring(1, s.length-1);
        } else {
          return s;
        }
    }
  
    return (
        <>
            <div id="uploadcontainer">
                <div id="uploadtext">
                <h1>Upload a CSV</h1>
                    <p>Use the following format: Term,Definition <br /> 
                        If a comma is used in a definition, be sure to <br /> 
                        surround the definition with quotation marks.
                    </p>
                </div>
                <form id="uploadform" onSubmit={handleSubmit}>
                    <input id="fileupload" name="file" type="file" accept=".csv,.txt" ref={fileInputRef} />
                    <br />
                    <button id="uploaded">Upload</button>
                </form>
            </div>
        </>
    );
};

export default UploadPage;