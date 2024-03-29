import '../styles/Home.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams, redirect } from 'react-router-dom';
import CryptoJS from 'crypto-js';
const Home = () => {
    
    const location = useLocation();
     
    
    
    
     //-------------------------------------------------------------------------
    // codice eseguito una volta renderizzato il componente
    // viene eseguito una sola volta 
    useEffect(() => {
        var encryptedUid = window.localStorage.getItem('encryptedUid');
   
        var uid = ''; 
        //console.log('user criptato: ' + encryptedUid);
        
        if(encryptedUid) {
            uid = CryptoJS.AES.decrypt(encryptedUid, 'rTCIWU3RYT23r8gcr3rU32TYRVdshfkjfhs32w4Y3').toString(CryptoJS.enc.Utf8);
            // console.log('user: ' + uid);
            document.getElementById("_user").innerHTML = '<h3> Ciao ' + uid +'!</h3>';
        } else {
            // console.log('ti riporto al login va là');
            redirect('./user');
        }

        var idOrdine = window.localStorage.getItem('idOrdine');
       // console.log('id ordine: ' + idOrdine);
        document.getElementById('_idTavolo').innerHTML = '<h3> Tavolo: ' + idOrdine + '</h3>';


    }, []);



    //-------------------------------------------------------------------------


    return(
        <div className="Home">
            <h1>CrazySushi</h1>
            <div id="_user"></div>
            <div id="_idTavolo"></div>
            <Link to="./inserisci"><button>&#x1F35C; Aggiungi piatti &nbsp;&nbsp;&nbsp;</button></Link><br/>
            <Link to="./rimuovi"><button>&#x274C; Rimuovi piatti &nbsp;&nbsp;&nbsp;&nbsp;</button></Link><br/>
            <Link to="./visualizza"><button>&#x1F5D2; Visualizza ordine</button></Link><br/>
            <Link to="./cancella"><button>&#128686; Cancella tavolo&nbsp;</button></Link>
        </div>
    );
}

export default Home;