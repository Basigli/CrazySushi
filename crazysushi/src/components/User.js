import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const User = () => {
    const [user, setUser] = useState('');
    const [registered, setRegistered] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const encryptedUid = CryptoJS.AES.encrypt(
            user,
            'rTCIWU3RYT23r8gcr3rU32TYRVdshfkjfhs32w4Y3'
        ).toString();
        window.localStorage.setItem('encryptedUid', encryptedUid);
        setRegistered(true);
    };

    return (
        <div className="app-card mx-auto mt-10 w-full max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-100/80">Welcome</p>
            <h1 className="mt-1 text-4xl font-extrabold text-white">CrazySushi</h1>
            <h3 className="mt-4 text-lg text-slate-200">What should we call you?</h3>

            <form className="mt-4" onSubmit={handleSubmit}>
                <input
                    required
                    type="text"
                    className="input-field"
                    name="_userId"
                    maxLength="20"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Your nickname"
                />
                {!registered && <button className="primary-btn mt-4">Register</button>}
            </form>

            {registered && (
                <div className="mt-6">
                    <Link to="/login" className="primary-btn inline-block">Continue</Link>
                </div>
            )}
        </div>
    );
};


export default User;