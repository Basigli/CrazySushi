import '../styles/App.css';
import React, { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import axios from "axios";

const Login = () => {

    const [mostraUnisciti, setMostraUnisciti] = useState(true);

    const [link, setLink] = useState('../');
    const [idOrdine, setIdOrdine] = useState('');

    const handleCreaTavolo = (e) => {
        // il pulsante crea tavolo è stato premuto
        // mando una richiesta al server di creare un tavolo 
        setMostraUnisciti(false);
        

        
        let formData = {user: window.localStorage.getItem('encryptedUid')}
      

        fetch("http://192.168.1.22:3001/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setIdOrdine(data.message); 
            console.log(data.message)
            window.localStorage.setItem('idOrdine', data.message);
            var html = '<h3>Tavolo creato: ' + data.message + '</h3\n';
            html += '<h3> Mostra questo codice ai tuoi amici! </h3>';
            document.getElementById('_creaTavolo').innerHTML = html;

          })
          .catch((error) => console.error(error));
    }
    
   
    return(
        <div className="Login">
            <h1>CrazySushi</h1>
            <div id='_creaTavolo'></div>
            <div id='_uniscitiTavolo'></div>
            {mostraUnisciti && <p><Link to="../unisciti"><button>Unisciti a un tavolo</button></Link></p>}
            {mostraUnisciti && <p><button onClick={handleCreaTavolo}>Crea tavolo</button></p>}
            {!mostraUnisciti && <p><Link to="../"><button>Avanti</button></Link></p>}
            
            
        </div>
    );
}

export default Login;