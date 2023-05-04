import '../styles/Rimuovi.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, redirect } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const User = () => {

    const [user, setUser] = useState('');
    const [registrato, setRegistrato] = useState(false);
    const [link, setLink] = useState('../login');
    
    const handleSubmit = (e) => {
        e.preventDefault();

        // cifro i parametri
        const encryptedUid = CryptoJS.AES.encrypt(user, 'rTCIWU3RYT23r8gcr3rU32TYRVdshfkjfhs32w4Y3').toString();
        window.localStorage.setItem('encryptedUid', encryptedUid);
        setRegistrato(true);
        

    }

    
    return(
        <div className='User'>
            <h1>CrazySushi</h1>
            <h3>Come ti chiami?</h3>
            <form onSubmit={handleSubmit}>
                <p>
                    <input required type="text" className="TextContainer" name="_userId" maxLength="20" size="15" value={user} onChange={(e) => setUser(e.target.value)}></input>
                </p>
                {!registrato && <button>Registrati</button>}
            </form>
            {registrato && <Link to={link}><button>Avanti</button></Link>}
        </div>
        
    );


}


export default User;