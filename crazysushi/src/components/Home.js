import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const Home = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [tableId, setTableId] = useState('');

    useEffect(() => {
        const encryptedUid = window.localStorage.getItem('encryptedUid');
        const orderId = window.localStorage.getItem('idOrdine') || 'Not set';

        if (!encryptedUid) {
            navigate('/user');
            return;
        }

        const uid = CryptoJS.AES.decrypt(
            encryptedUid,
            'rTCIWU3RYT23r8gcr3rU32TYRVdshfkjfhs32w4Y3'
        ).toString(CryptoJS.enc.Utf8);

        setUserName(uid || 'Guest');
        setTableId(orderId);
    }, [navigate]);

    return (
        <div className="app-card mx-auto mt-6 w-full max-w-2xl">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-brand-100/90">Shared Order</p>
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">CrazySushi</h1>
            <p className="mt-4 text-lg text-slate-200">Welcome back, <span className="font-semibold text-brand-100">{userName}</span>.</p>
            <p className="mt-1 text-sm text-slate-300">Table code: <span className="rounded-lg bg-slate-800 px-2 py-1 font-semibold text-white">{tableId}</span></p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link to="/dishes?mode=add" className="primary-btn text-center">Add Dishes</Link>
                <Link to="/visualizza" className="secondary-btn text-center">View Order</Link>
                <Link to="/cancella" className="ghost-btn text-center">Reset Table</Link>
            </div>
        </div>
    );
};

export default Home;