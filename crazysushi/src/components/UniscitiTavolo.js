import '../styles/App.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';


const UniscitiTavolo = () => {

  const [idOrdine, setIdOrdine] = useState('');
  const [message, setMessage] = useState('');
  const [idSetted, setIdSetted] = useState(false);

  const handleUniscitiTavolo = (e) => {
    let formData = {
      user: window.localStorage.getItem('encryptedUid'),
      orderId: idOrdine
    };


    fetch(`${API_URL}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "-1") {
          setMessage("Ordine inesistente!");
          console.log("Ordine inesistente!");
        } else {
          setIdOrdine(data.message);
          console.log(data.message);
          window.localStorage.setItem('idOrdine', data.message);
          setIdSetted(true);
          setMessage("Unione al tavolo effettuata con successo!");
        }
      })
      .catch((error) => console.error(error));


  }



  return (
    <div className='UniscitiTavolo'>
      <h1>CrazySushi</h1>
      {!idSetted && <p> Immetti un codice tavolo per unirti</p>}
      <p> {message} </p>
      {!idSetted && <input required type="text" className="TextContainer" name="_idOrdine" maxLength="20" size="15" value={idOrdine} onChange={(e) => setIdOrdine(e.target.value)}></input>}
      <p>{!idSetted && <button name="idOrdineSubmit" onClick={handleUniscitiTavolo}>Unisciti</button>}</p>
      <p>{idSetted && <Link to="../"><button>Avanti</button></Link>}</p>
      <form>

      </form>
    </div>
  );
}


export default UniscitiTavolo;