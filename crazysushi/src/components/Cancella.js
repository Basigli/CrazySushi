import React from 'react';
import { Link } from 'react-router-dom';

const Cancella = () => {
    const handleReset = () => {
        window.localStorage.removeItem('idOrdine');
        window.localStorage.removeItem('encryptedUid');
    };

    return (
        <div className="app-card mx-auto mt-10 w-full max-w-xl">
            <h1 className="text-3xl font-bold text-white">Reset Table Session</h1>
            <p className="mt-3 text-sm text-slate-300">
                This will clear your local user and table data from this browser.
            </p>

            <div className="mt-7">
                <Link to="/user" className="primary-btn inline-block" onClick={handleReset}>Start Again</Link>
            </div>
        </div>
    );
};

export default Cancella;