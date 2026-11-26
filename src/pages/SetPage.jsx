import React, { useState, useEffect } from 'react';
import SetCards from '../components/SetCards';
import { Link, useNavigate, useParams } from "react-router-dom";
import Title from '../components/Title';
import { useAuth } from "../AuthContext";
import editSet from '../functions/editSet';

const SetPage = () => {
    const { id } = useParams();
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    const [setName, setSetName] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLoading) return;

        let cancelled = false;

        setLoaded(false);
        setError("");

        async function fetchData() {
            try {
                const data = await editSet.getSetData(id, user);

                if (cancelled) return;

                if (!data) {
                    navigate("/");
                    return;
                }

                setSetName(data.name);
                setLoaded(true);
            } catch (error) {
                console.error(error);

                if (!cancelled) {
                    setError("Unable to load this set.");
                }
            }
        }

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [id, user, isLoading, navigate]);

    if (error) {
        return (
            <p className="centerText">{error}</p>
        );
    }

    if (!loaded || isLoading) return null;

    return (
        <>
            <Title title={setName} back="true" />

            <SetCards setname={id} animate={true}/>

            <button
                className="redBtn lowerLeft"
                onClick={() => navigate("edit")}
            >
                Edit
            </button>

            <div className="dropUp alwaysWhite">
                <button className="dropBtn grnBtn alwaysWhite">
                    Start
                </button>

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
