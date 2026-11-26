import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSun, FaMoon, FaUser } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const NavBar = () => {
    const { user, login, logout, isAuthenticated, isLoading } = useAuth();

    let darkmode = localStorage.getItem('darkmode');

    const enableDarkMode = () => {
        document.body.classList.add('darkmode');
        localStorage.setItem('darkmode', 'active');
    };

    const disableDarkMode = () => {
        document.body.classList.remove('darkmode');
        localStorage.removeItem('darkmode');
    };

    if (darkmode === 'active') enableDarkMode();

    function darkLightSwitcher() {
        darkmode = localStorage.getItem('darkmode');
        darkmode !== 'active' ? enableDarkMode() : disableDarkMode();
    }

    async function handleLogin() {
        try {
            await login();
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <div className="navbar alwaysWhite">
            <div id="leftSide">
                <NavLink
                    id="link"
                    aria-label="Go to homepage"
                    className={({ isActive }) => isActive ? 'activeNav' : ''}
                    to="/">
                    <FaHome className="inlineIcon" />
                    <div className="hideMobile">Home</div>
                </NavLink>
            </div>

            <div id="websitename">
                <NavLink id="name" to="/">
                    <h1 id="websiteTitle">FlashCards</h1>
                </NavLink>
                <img id="websiteImage" src="../../../slidefavicon.svg" />
            </div>

            <div id="rightSide">
                {!isLoading && (
                    user ? (
                        <button
                            id="link"
                            onClick={handleLogout}
                            title={`Signed in as ${user.email}. Click to log out.`}
                            aria-label="Log out"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "fit-content",
                                flex: "0 0 auto",
                                gap: "10px",
                                padding: "8px 12px"
                            }}
                        >
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        minWidth: "32px",
                                        maxWidth: "32px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        flexShrink: 0,
                                        margin: 0
                                    }}
                                />
                            ) : (
                                <FaUser className="inlineIcon" />
                            )}

                            <div
                                className="hideMobile"
                                style={{
                                    textAlign: "left",
                                    lineHeight: "1.2",
                                    width: "auto",
                                    margin: 0
                                }}
                            >
                                <div style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 500
                                }}>
                                    {user.displayName || user.email || "Account"}
                                </div>

                                <div style={{
                                    fontSize: "0.7rem",
                                    opacity: 0.65
                                }}>
                                    Click to log out
                                </div>
                            </div>
                        </button>
                    ) : (
                        <button id="link" onClick={handleLogin}>
                            <FaUser className="inlineIcon" />
                            <div className="hideMobile">Log In</div>
                        </button>
                    )
                )}

                <button id="themeSwitch" onClick={darkLightSwitcher}>
                    <FaSun />
                    <FaMoon />
                </button>
            </div>
        </div>
    );
};

export default NavBar;
