import '../styles/Visualizza.css';
import React from 'react';
import { Link } from 'react-router-dom';

class Visualizza extends React.Component {

    render() {
        //variabili da inserire 
        return(
            <div className="Visualizza">
               <h1>Ordine</h1>
               <p><Link to="/"><button>&larr;</button></Link></p>
            </div>
        );
    }
}

export default Visualizza;