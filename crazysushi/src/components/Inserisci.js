import '../styles/Inserisci.css';
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API_URL from '../config';



const Inserisci = () => {
  const [idPiatto, setIdPiatto] = useState('');
  const [qta, setQta] = useState('1');
  const [encryptedUid, setEncryptedUid] = useState(window.localStorage.getItem('encryptedUid'));
  const [idOrdine, setIdOrdine] = useState(window.localStorage.getItem('idOrdine'));


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('richiesta aggiunta piatti');

    let formData = {
      idPiatto: idPiatto,
      qta: qta,
      encryptedUid: encryptedUid,
      idOrdine: idOrdine
    }
    console.log(JSON.stringify(formData));


    fetch(`${API_URL}/add`, {
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

        if (document.getElementById("confirm")) {
          document.getElementById("confirm").innerHTML = 'piatto aggiunto!';
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
    // richiedo al server la lista di piatti tramigte json
    console.log("Carico la lista di piatti");

    let formData = { user: encryptedUid }


    fetch(`${API_URL}/get-menu`, {
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
        menu.forEach((n, i) => { list += '<option value="' + n + '"></option>'; });
        list += '</datalist>';
        if (document.getElementById("list")) {
          document.getElementById("list").innerHTML = list;
        }
      })
      .catch((error) => console.error(error));
  }, []);

  //-------------------------------------------------------------------------
  return (
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

      <p><Link to="/"><button>&larr;</button></Link></p>
      <div className="fade-out">  <div id="confirm"></div></div>
    </div>
  );
}

export default Inserisci;