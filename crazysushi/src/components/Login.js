import '../styles/App.css';
import React, { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const Login = () => {

    const [mostraUnisciti, setMostraUnisciti] = useState(true);
    const [link, setLink] = useState('../');
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const handleCreaTavolo = (e) => {
        // il pulsante crea tavolo è stato premuto
        // mando una richiesta al server di creare un tavolo 
        // il server risponde con un idOrdine che viene immesso nell'url 
        setMostraUnisciti(false);

        //------------ESEMPIO DI idOrdine-------
        var idOrdine = '6328HY';        // da sostituire con vera chiamata a server 
        //--------------------------------------

        //-----mostro l'id del tavolo-----------
        var html = '<h3>Tavolo creato: ' + idOrdine +'</h3\n';
        html += '<h3> Mostra questo codice ai tuoi amici! </h3>';
        document.getElementById('_creaTavolo').innerHTML = html;
        //--------------------------------------
        
        // rimetto parametri nell'url
        var encryptedUid = encodeURIComponent(searchParams.get('uid'));
        if (encryptedUid == null) {
            // reindirizzo alla pagina di login
        }
        setLink(link + '?uid=' + encryptedUid + '&idOrdine=' + idOrdine);
        
    }

    
    return(
        <div className="Login">
            <h1>CrazySushi</h1>
            {mostraUnisciti && <p><button onClick={handleCreaTavolo}>Crea tavolo</button></p>}
            {mostraUnisciti && <p><Link to="../"><button>Unisciti a un tavolo</button></Link></p>}
            <div id='_creaTavolo'></div>
            {!mostraUnisciti && <p><Link to={link}><button>Avanti</button></Link></p>}
        </div>
    );
}

export default Login;