import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API_URL from '../config';

const Inserisci = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'remove' ? 'remove' : 'add';

  const [mode, setMode] = useState(initialMode);
  const [idPiatto, setIdPiatto] = useState('');
  const [qta, setQta] = useState('1');
  const [encryptedUid] = useState(window.localStorage.getItem('encryptedUid'));
  const [idOrdine] = useState(window.localStorage.getItem('idOrdine'));
  const [menu, setMenu] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const isAddMode = mode === 'add';

  const loadDishes = useCallback(() => {
    const endpoint = isAddMode ? 'get-menu' : 'get-meals';
    const formData = isAddMode
      ? { user: encryptedUid }
      : { user: encryptedUid, orderId: idOrdine };

    fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => setMenu(data.message || []))
      .catch((error) => console.error(error));
  }, [isAddMode, encryptedUid, idOrdine]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      idPiatto: idPiatto,
      qta: qta,
      encryptedUid: encryptedUid,
      idOrdine: idOrdine
    };

    fetch(`${API_URL}/${isAddMode ? 'add' : 'remove'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        setConfirmationMessage(isAddMode ? 'Dish added successfully.' : 'Dish removed successfully.');
        loadDishes();
      })
      .catch((error) => console.error(error));

    setIdPiatto('');
    setQta('1');
  };

  useEffect(() => {
    loadDishes();
    setConfirmationMessage('');
  }, [loadDishes]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setSearchParams({ mode: nextMode });
    setIdPiatto('');
    setQta('1');
  };

  const isRemoveDisabled = !isAddMode && menu.length === 0;

  return (
    <div className="app-card mx-auto mt-8 w-full max-w-xl">
      <h1 className="text-3xl font-bold text-white">Manage Dishes</h1>
      <p className="mt-2 text-sm text-slate-300">
        {isAddMode
          ? 'Use a dish code from the menu and set the quantity.'
          : 'Select one of the currently ordered dishes and set the quantity to remove.'}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className={isAddMode ? 'primary-btn w-full' : 'secondary-btn w-full'}
          onClick={() => handleModeChange('add')}
        >
          Add Items
        </button>
        <button
          type="button"
          className={!isAddMode ? 'w-full rounded-lg border border-red-500/60 bg-red-500/20 px-5 py-3 text-sm font-semibold text-red-100 transition-colors duration-200 hover:bg-red-500/30' : 'secondary-btn w-full'}
          onClick={() => handleModeChange('remove')}
        >
          Remove Items
        </button>
      </div>

      {!isAddMode && (
        <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-red-100">Remove Mode</p>
          {menu.length > 0 && (
            <>
              <p className="mt-1 text-xs text-red-200/90">Pick one of your current dish codes or type it manually.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {menu.map((dish) => (
                  <button
                    key={dish}
                    type="button"
                    className="rounded-md border border-red-300/35 px-2 py-1 text-xs text-red-100 hover:bg-red-500/20"
                    onClick={() => setIdPiatto(dish)}
                  >
                    {dish}
                  </button>
                ))}
              </div>
            </>
          )}
          {menu.length === 0 && (
            <p className="mt-1 text-xs text-red-200/90">You have no dishes to remove yet. Add items first.</p>
          )}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            type="text"
            className="input-field"
            name="_idPiatto"
            maxLength="32"
            list="piatti_list"
            placeholder={isAddMode ? 'Dish code' : 'Dish code to remove'}
            value={idPiatto}
            onChange={(e) => setIdPiatto(e.target.value)}
          />
          <input
            type="number"
            className="input-field"
            name="_qta"
            placeholder={isAddMode ? 'Quantity to add' : 'Quantity to remove'}
            min="1"
            max="99"
            value={qta}
            onChange={(e) => setQta(e.target.value)}
          />
        </div>

        <datalist id="piatti_list">
          {menu.map((dish) => (
            <option key={dish} value={dish} />
          ))}
        </datalist>

        <div className="flex items-center gap-3">
          <button
            className={isAddMode ? 'primary-btn' : 'rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-700'}
            disabled={isRemoveDisabled}
          >
            {isAddMode ? 'Add' : 'Remove'}
          </button>
          <Link to="/" className="ghost-btn">Back</Link>
        </div>
      </form>

      {confirmationMessage && (
        <p className="mt-5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {confirmationMessage}
        </p>
      )}
    </div>
  );
};

export default Inserisci;