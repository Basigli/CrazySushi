import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const Visualizza = () => {
    const [encryptedUid] = useState(window.localStorage.getItem('encryptedUid'));
    const [idOrdine] = useState(window.localStorage.getItem('idOrdine'));
    const [meals, setMeals] = useState([]);
    const wsUrl = API_URL.replace('http://', 'ws://').replace('https://', 'wss://');

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
                const parsedMeals = (data.message || []).map((item) => {
                    const parts = item.split(' ');
                    return {
                        quantity: parts[0],
                        label: parts.slice(1).join(' '),
                    };
                });
                setMeals(parsedMeals);
            })
            .catch((error) => console.error(error));
    }, [encryptedUid, idOrdine]);

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

                <ul className="space-y-2">
                    {meals.map((meal) => (
                        <li key={`${meal.quantity}-${meal.label}`} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-3">
                            <span className="rounded-md bg-brand-500/20 px-2 py-1 text-xs font-semibold text-brand-100">x{meal.quantity}</span>
                            <span className="ml-4 text-sm text-slate-100">{meal.label}</span>
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