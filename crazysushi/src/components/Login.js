import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const Login = () => {
  const [mostraUnisciti, setMostraUnisciti] = useState(true);
  const [createdTableId, setCreatedTableId] = useState('');

  const handleCreateTable = () => {
    setMostraUnisciti(false);

    const formData = { user: window.localStorage.getItem('encryptedUid') };

    fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        window.localStorage.setItem('idOrdine', data.message);
        setCreatedTableId(data.message);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="app-card mx-auto mt-8 w-full max-w-xl">
      <h1 className="text-4xl font-extrabold text-white">Table Setup</h1>
      <p className="mt-2 text-sm text-slate-300">Choose how you want to start your shared order.</p>

      {createdTableId && (
        <div className="mt-6 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4 text-teal-100">
          <p className="text-sm">Table created successfully.</p>
          <p className="mt-1 text-lg font-semibold">Code: {createdTableId}</p>
          <p className="mt-1 text-xs text-teal-200/80">Share this code with your friends.</p>
        </div>
      )}

      {mostraUnisciti && (
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link to="/unisciti" className="secondary-btn text-center">Join a Table</Link>
          <button className="primary-btn" onClick={handleCreateTable}>Create Table</button>
        </div>
      )}

      {!mostraUnisciti && (
        <div className="mt-6">
          <Link to="/" className="primary-btn inline-block">Continue</Link>
        </div>
      )}
    </div>
  );
};

export default Login;