import '../styles/Cancella.css';
import React from 'react';
import { Link } from 'react-router-dom';

const Cancella = () => {
    //variabili da inserire
    return(
        <div className="Cancella">
            <h1>Cancella tavolo</h1>
            <p><Link to="/user"><button>&larr;</button></Link></p>
        </div>
    );
    
}

export default Cancella;