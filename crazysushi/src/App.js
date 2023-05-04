import React from 'react';
import Home from './components/Home.js'
import Inserisci from './components/Inserisci.js';
import Rimuovi from './components/Rimuovi.js';
import Visualizza from './components/Visualizza.js';
import Cancella from './components/Cancella.js';
import Login from './components/Login.js';
import User from './components/User.js';

import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UniscitiTavolo from './components/UniscitiTavolo.js';

class App extends React.Component {
  

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Routes>
              <Route exact path="/user" element={<User/>} />
              <Route exact path="/login" element={<Login/>} />
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/unisciti" element={<UniscitiTavolo/>} />
              <Route exact path="/inserisci" element={<Inserisci/>} />
              <Route exact path="/rimuovi" element={<Rimuovi/>} />
              <Route exact path="/visualizza" element={<Visualizza/>} />
              <Route exact path="/cancella" element={<Cancella/>} />
            </Routes>
          </header>
        </div>
      </Router>
    );
  }

}

export default App;
