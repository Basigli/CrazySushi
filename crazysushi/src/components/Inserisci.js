import '../styles/Inserisci.css';
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';



const Inserisci = () => {
    const [idPiatto, setIdPiatto] = useState('');
    const [qta, setQta] = useState('1');
    const [encryptedUid, setEncryptedUid] = useState();
    const [idOrdine, setIdOrdine] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    const [params, setParams] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('richiesta aggiunta piatti');
        const request = {idPiatto, qta, encryptedUid, idOrdine};
        console.log(request);
        
        
        setIdPiatto('');
        setQta('1');
    }
    //-------------------------------------------------------------------------
    // codice eseguito una volta renderizzato il componente
    // viene eseguito una sola volta 
    useEffect(() => {
        // richiedo al server la lista di piatti tramite json
        console.log("Carico la lista di piatti");
        var list = '<datalist id="piatti_list">';
        for (var i = 1; i <= 10; i++) {
            list += '<option value="'+ i + '"></option>';
        }
        list += '</datalist>';
        
        // renderizzo la lista dei possibili piatti
        if(document.getElementById("list")) {
            document.getElementById("list").innerHTML = list;
        }
        
        // estraggo i parametri dall'url
        var encryptedUidVar = encodeURIComponent(searchParams.get('uid'));
        var idOrdineVar = searchParams.get('idOrdine');

        
        // controllo dei parametri 
        setEncryptedUid(encryptedUidVar);
        setIdOrdine(idOrdineVar);
        //...
        // codifico i parametri nell'url 
       
        console.log(encryptedUidVar, idOrdineVar);
        setParams('?uid=' + encryptedUidVar + '&idOrdine=' + idOrdineVar);

        console.log('location: inserisci, params: ' + params);

    }, []);
    // setParams('?uid=' + encryptedUid + '&idOrdine=' + idOrdine);

    //-------------------------------------------------------------------------
    return(
        <div className="Inserisci" >
            <h1>Inserisci piatti</h1>
            <form onSubmit={handleSubmit}>
                <p>
                    <input required type="text" className="TextContainer" name="_idPiatto" maxLength="4" size="7" list="piatti_list" placeholder="num" value={idPiatto} onChange={(e) => setIdPiatto(e.target.value)}></input>
                    <input type="number" className="TextContainer" name="_qta" maxLength="2" size="7" placeholder="qta" min="1" max="99" value={qta} onChange={(e) => setQta(e.target.value)}></input>
                </p>
                <button>Aggiungi</button>
                <div id="list"></div>
            </form>
            
            <p><Link to={"/" + params}><button>&larr;</button></Link></p>
        </div>
    );
}

export default Inserisci;