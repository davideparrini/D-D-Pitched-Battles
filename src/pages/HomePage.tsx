// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1>D&D Map</h1>
        <p>
          Prepara, esplora e personalizza le tue mappe per sessioni di Dungeons & Dragons. Etichetta
          i terreni, posiziona le pedine e analizza automaticamente la difficoltà delle aree.
        </p>

        <div className="home-buttons">
          <Link to="/editor" className="start-button">
            🛠 Crea o modifica una mappa
          </Link>
          <Link to="/setup" className="start-button secondary">
            🎮 Avvia una sessione di gioco
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
