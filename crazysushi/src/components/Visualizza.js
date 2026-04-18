import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const Visualizza = () => {
    const [encryptedUid] = useState(window.localStorage.getItem('encryptedUid'));
    const [idOrdine] = useState(window.localStorage.getItem('idOrdine'));
    const [meals, setMeals] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const wsUrl = API_URL.replace('http://', 'ws://').replace('https://', 'wss://');

    const toggleRow = (dishCode) => {
        setExpandedRows((currentExpandedRows) => ({
            ...currentExpandedRows,
            [dishCode]: !currentExpandedRows[dishCode],
        }));
    };

    const fetchOrder = useCallback(() => {
        const formData = { user: encryptedUid, orderId: idOrdine };

        fetch(`${API_URL}/visualize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                const payload = data.message || [];

                const parsedMeals = payload.map((item) => {
                    if (typeof item === 'string') {
                        const parts = item.split(' ');
                        return {
                            dishCode: parts[0],
                            total: parts[1] || '0',
                            signed: false,
                            breakdown: [],
                        };
                    }

                    return {
                        ...item,
                        signed: Boolean(item.signed),
                    };
                });

                setMeals(parsedMeals);
            })
            .catch((error) => console.error(error));
    }, [encryptedUid, idOrdine]);

    const handleSignedChange = (dishCode, signed) => {
        fetch(`${API_URL}/toggle-arrived`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: encryptedUid,
                orderId: idOrdine,
                idPiatto: dishCode,
                signed,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === '-1') {
                    return;
                }
                fetchOrder();
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    useEffect(() => {
        if (!idOrdine) {
            return;
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: 'subscribe-order',
                    orderId: idOrdine,
                })
            );
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'order-updated' && data.orderId === idOrdine) {
                    fetchOrder();
                }
            } catch (err) {
                console.error(err);
            }
        };

        ws.onerror = (error) => {
            console.error(error);
        };

        return () => {
            ws.close();
        };
    }, [idOrdine, wsUrl, fetchOrder]);

    return (
        <div className="app-card mx-auto mt-8 w-full max-w-2xl">
            <h1 className="text-3xl font-bold text-white">Order {idOrdine}</h1>
            <p className="mt-2 text-sm text-slate-300">Quantity and item details for the current table.</p>

            <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-950/40 p-4">
                {meals.length === 0 && <p className="text-sm text-slate-400">No items in this order yet.</p>}

                <ul className="space-y-3">
                    {meals.map((meal) => (
                        <li
                            key={meal.dishCode}
                            className={meal.signed ? 'rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4' : 'rounded-xl border border-slate-800 bg-slate-900/80 p-4'}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-white">Dish {meal.dishCode}</p>
                                    <p className="mt-1 text-xs text-slate-400">Shared by the table</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200">
                                        <input
                                            type="checkbox"
                                            checked={meal.signed}
                                            onChange={(e) => handleSignedChange(meal.dishCode, e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-500 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        Arrived
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => toggleRow(meal.dishCode)}
                                        className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-500/25"
                                    >
                                        {expandedRows[meal.dishCode] ? 'Hide details' : 'Show details'}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                                <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Total</span>
                                <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-sm font-semibold text-blue-100">
                                    x{meal.total}
                                </span>
                            </div>

                            {meal.signed && (
                                <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100">
                                    Signed as arrived
                                </div>
                            )}

                            {expandedRows[meal.dishCode] && meal.breakdown && meal.breakdown.length > 0 && (
                                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {meal.breakdown.map((share) => (
                                        <div
                                            key={`${meal.dishCode}-${share.user}`}
                                            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                                        >
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">User</p>
                                            <p className="mt-1 text-sm font-medium text-slate-100">{share.user}</p>
                                            <div className="mt-2 inline-flex rounded-md bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200">
                                                x{share.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {expandedRows[meal.dishCode] && (!meal.breakdown || meal.breakdown.length === 0) && (
                                <p className="mt-4 text-sm text-slate-400">No user breakdown available for this dish.</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-5">
                <Link to="/" className="ghost-btn inline-block">Return Home</Link>
            </div>
        </div>
    );
};

export default Visualizza;