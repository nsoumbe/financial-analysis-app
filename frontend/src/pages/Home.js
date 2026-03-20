import React from 'react';
import './Home.css';

function Home({ onStart }) {
  return (
    <div className="home-container">
      <div className="home-card">
        <h2>Bienvenue</h2>
        <p>
          Analysez les fusions et acquisitions entre deux entreprises avec l'aide de l'intelligence artificielle.
        </p>

        <div className="features">
          <div className="feature">
            <span className="icon">📊</span>
            <h3>Analyse Financière</h3>
            <p>Comparez les données financières de deux entreprises</p>
          </div>

          <div className="feature">
            <span className="icon">🤖</span>
            <h3>Analyse Assistée par IA</h3>
            <p>Génération de rapports intelligents en temps réel</p>
          </div>

          <div className="feature">
            <span className="icon">📈</span>
            <h3>Insights Détaillés</h3>
            <p>Recommandations et analyses approfondies</p>
          </div>

          <div className="feature">
            <span className="icon">💻</span>
            <h3>Accessible</h3>
            <p>Application web locale facile à utiliser</p>
          </div>
        </div>

        <button className="btn btn-primary btn-large" onClick={onStart}>
          Commencer l'analyse →
        </button>
      </div>
    </div>
  );
}

export default Home;
