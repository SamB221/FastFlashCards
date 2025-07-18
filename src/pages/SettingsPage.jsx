import React from 'react';
import Color from 'color';

const SettingsPage = () => {
    var root = document.querySelector(':root');
    var rs = getComputedStyle(root);
    var darkMode = document.querySelector('.darkmode');

    function setColor(e) {
        e.preventDefault();
        const color = document.getElementById('accentColor').value;
        const secondColor = Color(color).darken(0.2).hex();
        const thirdColor = Color(color).darken(0.4).hex();
        root.style.setProperty('--primary', color);
        root.style.setProperty('--secondary', secondColor);
        root.style.setProperty('--ternary', thirdColor);
        if (darkMode) {
            darkMode.style.setProperty('--primary', color);
            darkMode.style.setProperty('--secondary', secondColor);
            darkMode.style.setProperty('--ternary', thirdColor);
        }
    }

    return (
        <div className="middleBox">
            <div className="flex pad5">
                <label htmlFor="accentColor">Select an accent color:</label>
                <input type="color" 
                    id="accentColor" name="favcolor" 
                    defaultValue={rs.getPropertyValue('--primary')} 
                    onChange={setColor} />
                <p>More settings coming soon...</p>
            </div>
        </div>
    );
};

export default SettingsPage;