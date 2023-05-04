import '../styles/Visualizza.css';
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Visualizza = () => {

    const [encryptedUid, setEncryptedUid] = useState(window.localStorage.getItem('encryptedUid'));
    const [idOrdine, setIdOrdine] = useState(window.localStorage.getItem('idOrdine'));

    useEffect(() => {

        let formData = {user: encryptedUid, orderId: idOrdine};

        fetch("http://192.168.1.243:3001/visualize", {
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
            var list = '<ul>';
            menu.forEach((n, i) => {  
                let splittedString = n.split(' ');
                list += '<li ind="';
                list += splittedString[0] + '">';
                splittedString = splittedString.slice(1);
                list += splittedString.join(' ');
                list += '</li>';

            });
            list += '</ul>';
            
            
            

            if(document.getElementById("list")) {
                document.getElementById("list").innerHTML = list;
            }
        })
        .catch((error) => console.error(error));    
    }, []);

    
        //variabili da inserire 
    return(
        <div className="Visualizza">
            <h1>Ordine {idOrdine} </h1>

                Numero    &rarr;     Qta.
                <div id="list"></div>

            <p><Link to="/"><button>&larr;</button></Link></p>
        </div>
    );
    
}

export default Visualizza;