import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';
import { useAuth } from '../AuthContext';
import editSet from '../functions/editSet';

const UploadPage = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();

    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    function selectFile(file) {
        if (!file || isSaving) return;

        if (!/\.(csv|txt)$/i.test(file.name)) {
            setError("Please select a CSV or TXT file.");
            setSelectedFile(null);
            return;
        }

        setError("");
        setSelectedFile(file);
    }

    function handleDragOver(event) {
        event.preventDefault();

        if (!isSaving) {
            setIsDragging(true);
        }
    }

    function handleDragLeave(event) {
        event.preventDefault();

        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
        }
    }

    function handleDrop(event) {
        event.preventDefault();
        setIsDragging(false);

        if (!isSaving) {
            selectFile(event.dataTransfer.files[0]);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isLoading || isSaving) return;

        if (!selectedFile) {
            setError("Please select a file first.");
            return;
        }

        await storeFile(selectedFile);
    }

    async function storeFile(inputFile) {
        setIsSaving(true);
        setError("");

        try {
            const contents = await inputFile.text();

            const input = contents
                .replace(/^\uFEFF/, "")
                .split(/\r?\n/)
                .filter(line => line.trim() !== "");

            const set = [];

            const fileName = inputFile.name
                .replace(/\.[^.]+$/, "")
                .trim();

            if (!fileName) {
                throw new Error("The file must have a valid name.");
            }

            for (let i = 0; i < input.length; i++) {
                const currentString = split(input[i]);

                if (currentString.length !== 2) {
                    throw new Error(
                        `Invalid CSV format on row ${i + 1}.`
                    );
                }

                const currentCard = {
                    Term: parseString(currentString[0]),
                    Definition: parseString(currentString[1]),
                    Mastery: 0
                };

                if (!currentCard.Term || !currentCard.Definition) {
                    throw new Error(
                        `Missing term or definition on row ${i + 1}.`
                    );
                }

                set.push(currentCard);
            }

            if (set.length === 0) {
                throw new Error("The selected file is empty.");
            }

            await editSet.createSet(fileName, set, user);

            navigate("/");
        } catch (error) {
            console.error("Upload failed:", error);

            setError(
                error.message || "Unable to save the flashcard set."
            );
        } finally {
            setIsSaving(false);
        }
    }

    function split(s) {
        const returnVal = [];
        let inQuotes = false;
        let startIndex = 0;

        for (let i = 0; i < s.length; i++) {
            if (s.charAt(i) === '"') {
                inQuotes = !inQuotes;
            }

            if (!inQuotes && s.charAt(i) === ',') {
                returnVal.push(s.substring(startIndex, i));
                startIndex = i + 1;
            }
        }

        if (inQuotes) {
            throw new Error("Unclosed quotation mark in CSV.");
        }

        returnVal.push(s.substring(startIndex));

        return returnVal;
    }

    function parseString(s) {
        s = s.trim();

        if (s.startsWith('"') && s.endsWith('"')) {
            return s.slice(1, -1).replace(/""/g, '"');
        }

        return s;
    }

    return (
        <>
            <Title title="Upload" back="true" />

            <div
                id="uploadcontainer"
                className={`middleBox uploadDropBox ${
                    isDragging ? "dragging" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div id="uploadtext">
                    <h1 className="padBottom">
                        Upload a CSV
                    </h1>

                    <h3>
                        Use the following format: Term,Definition
                        <br />
                        If a comma is used in a definition, surround
                        <br />
                        the definition with quotation marks.
                    </h3>
                </div>

                <form id="uploadform" onSubmit={handleSubmit}>
                    <input
                        id="fileupload"
                        name="file"
                        type="file"
                        accept=".csv,.txt"
                        ref={fileInputRef}
                        disabled={isSaving}
                        onChange={event => {
                            selectFile(event.target.files[0]);
                            event.target.value = "";
                        }}
                        hidden
                    />

                    <button
                        type="button"
                        className="fileDropArea"
                        disabled={isSaving}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <span className="uploadFileIcon">↑</span>

                        {isDragging ? (
                            <strong>Drop your file here!</strong>
                        ) : selectedFile ? (
                            <>
                                <strong>{selectedFile.name}</strong>
                                <small>Click or drop to replace</small>
                            </>
                        ) : (
                            <>
                                <strong>Drag and drop a file</strong>
                                <small>or click to browse</small>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="uploadError" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        id="uploaded"
                        className="uploadButton"
                        disabled={
                            !selectedFile ||
                            isSaving ||
                            isLoading
                        }
                        type="submit"
                    >
                        {isSaving ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default UploadPage;
