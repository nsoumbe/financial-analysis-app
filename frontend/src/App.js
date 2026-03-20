import React, { useState } from 'react';
import './App.css';
import CompanySearch from './components/CompanySearch';
import Report from './components/Report';
import Home from './pages/Home';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (acquirer, target) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acquirer: acquirer.id,
          target: target.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || 'Failed to generate report');
      }

      const data = await response.json();
      setReport(data);
      setCurrentPage('report');
    } catch (error) {
      alert('Erreur lors de la génération du rapport: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    setCurrentPage('home');
    setReport(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 onClick={handleBackHome} style={{ cursor: 'pointer' }}>
          💼 Analyse Financière - Fusion & Acquisition
        </h1>
      </header>

      <main className="app-main">
        {currentPage === 'home' && (
          <Home onStart={() => setCurrentPage('search')} />
        )}
        {currentPage === 'search' && (
          <CompanySearch
            onGenerateReport={handleGenerateReport}
            loading={loading}
            onBackHome={handleBackHome}
          />
        )}
        {currentPage === 'report' && report && (
          <Report
            report={report}
            onBackHome={handleBackHome}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Application de cours - Gestion Financière | Analyse assistée par IA</p>
      </footer>
    </div>
  );
}

export default App;
