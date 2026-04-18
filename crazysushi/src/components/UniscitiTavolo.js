import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const UniscitiTavolo = () => {
  const [idOrdine, setIdOrdine] = useState('');
  const [message, setMessage] = useState('');
  const [idSetted, setIdSetted] = useState(false);

  const handleJoinTable = () => {
    const formData = {
      user: window.localStorage.getItem('encryptedUid'),
      orderId: idOrdine
    };

    fetch(`${API_URL}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === '-1') {
          setMessage('Table code not found. Please try again.');
        } else {
          setIdOrdine(data.message);
          window.localStorage.setItem('idOrdine', data.message);
          setIdSetted(true);
          setMessage('You have successfully joined the table.');
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="app-card mx-auto mt-8 w-full max-w-xl">
      <h1 className="text-4xl font-extrabold text-white">Join a Table</h1>
      {!idSetted && <p className="mt-2 text-sm text-slate-300">Enter a table code to join your friends.</p>}

      {message && (
        <p className="mt-4 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
          {message}
        </p>
      )}

      {!idSetted && (
        <div className="mt-5 space-y-3">
          <input
            required
            type="text"
            className="input-field"
            name="_idOrdine"
            maxLength="20"
            value={idOrdine}
            onChange={(e) => setIdOrdine(e.target.value)}
            placeholder="Table code"
          />
          <button name="idOrdineSubmit" className="primary-btn" onClick={handleJoinTable}>Join</button>
        </div>
      )}

      {idSetted && (
        <div className="mt-5">
          <Link to="/" className="primary-btn inline-block">Continue</Link>
        </div>
      )}
    </div>
  );
};


export default UniscitiTavolo;