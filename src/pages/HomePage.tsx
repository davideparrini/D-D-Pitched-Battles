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

        <Link to="/editor" className="start-button">
          🎲 Inizia a creare la tua mappa
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
