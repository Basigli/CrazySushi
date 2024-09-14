import '../styles/Rimuovi.css';
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Rimuovi = () => {
    const [idPiatto, setIdPiatto] = useState('');
    const [qta, setQta] = useState('1');
    const [encryptedUid, setEncryptedUid] = useState(window.localStorage.getItem('encryptedUid'));
    const [idOrdine, setIdOrdine] = useState(window.localStorage.getItem('idOrdine'));


    const handleSubmit = (e) => {
        e.preventDefault();

            
        let formData = {
            idPiatto: idPiatto,
            qta: qta,
            encryptedUid: encryptedUid,
            idOrdine: idOrdine
        }
        console.log(JSON.stringify(formData)); 


        fetch("http://192.168.1.22:3001/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
           
            console.log(data.message)

            if(document.getElementsByClassName("fade-out")) {
                document.getElementsByClassName("fade-out").innerHTML = '<p> <div class="fade-out"></div></p>';
            }

          })
          .catch((error) => console.error(error));
                
        setIdPiatto('');
        setQta('1');
    }
    //-------------------------------------------------------------------------
    // codice eseguito una volta renderizzato il componente
    // viene eseguito una sola volta 
    useEffect(() => {

        let formData = {user: encryptedUid, orderId: idOrdine};

        fetch("http://192.168.1.237:3001/get-meals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            console.log(data.message);
            let menu = data.message;
            var list = '<datalist id="piatti_list">';
            menu.forEach((n, i) => {  list += '<option value="'+ n + '"></option>';});
            list += '</datalist>';
            if(document.getElementById("list")) {
                document.getElementById("list").innerHTML = list;
            }
        })
        .catch((error) => console.error(error));        
    }, []);

    //---------------------------------------------------------------------
    


    //variabili da inserire 
    return(
        <div className="Rimuovi">
            <h1>Rimuovi piatti</h1>
            <form onSubmit={handleSubmit}>
                <p>
                    <input required type="text" className="TextContainer" name="_idPiatto" maxLength="4" size="7" list="piatti_list" placeholder="num" value={idPiatto} onChange={(e) => setIdPiatto(e.target.value)}></input>
                    <input type="number" className="TextContainer" name="_qta" maxLength="2" size="7" placeholder="qta" min="1" max="99" value={qta} onChange={(e) => setQta(e.target.value)}></input>
                </p>
                <button>Rimuovi</button>
                <div id="list"></div>
            </form>
            <p><Link to="/"><button>&larr;</button></Link></p>
            <div className="fade-out"></div>

        </div>
        );

}

export default Rimuovi;