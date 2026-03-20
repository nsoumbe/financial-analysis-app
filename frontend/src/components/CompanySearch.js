import React, { useState } from 'react';
import './CompanySearch.css';

function CompanySearch({ onGenerateReport, loading, onBackHome }) {
  const [acquirerInput, setAcquirerInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [acquirerSuggestions, setAcquirerSuggestions] = useState([]);
  const [targetSuggestions, setTargetSuggestions] = useState([]);
  const [selectedAcquirer, setSelectedAcquirer] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showAcquirerSuggestions, setShowAcquirerSuggestions] = useState(false);
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false);

  const shouldShowNoResults = (input, suggestions, selectedCompany, showSuggestions) =>
    showSuggestions && input.trim().length >= 2 && suggestions.length === 0 && !selectedCompany;

  const searchCompanies = async (query, setSuggestions) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error searching companies:', error);
    }
  };

  const handleAcquirerInputChange = (e) => {
    const value = e.target.value;
    setAcquirerInput(value);
    setSelectedAcquirer(null);
    setShowAcquirerSuggestions(true);
    if (value.length > 0) {
      searchCompanies(value, setAcquirerSuggestions);
    } else {
      setAcquirerSuggestions([]);
    }
  };

  const handleTargetInputChange = (e) => {
    const value = e.target.value;
    setTargetInput(value);
    setSelectedTarget(null);
    setShowTargetSuggestions(true);
    if (value.length > 0) {
      searchCompanies(value, setTargetSuggestions);
    } else {
      setTargetSuggestions([]);
    }
  };

  const handleSelectAcquirer = (company) => {
    setSelectedAcquirer(company);
    setAcquirerInput(company.name);
    setShowAcquirerSuggestions(false);
  };

  const handleSelectTarget = (company) => {
    setSelectedTarget(company);
    setTargetInput(company.name);
    setShowTargetSuggestions(false);
  };

  const handleGenerateReport = () => {
    if (selectedAcquirer && selectedTarget) {
      if (selectedAcquirer.id === selectedTarget.id) {
        alert('Veuillez sélectionner deux entreprises différentes');
        return;
      }
      onGenerateReport(selectedAcquirer, selectedTarget);
    }
  };

  return (
    <div className="search-container">
      <button className="btn btn-secondary back-btn" onClick={onBackHome}>
        ← Retour
      </button>

      <div className="search-card">
        <h2>Sélectionnez les entreprises</h2>

        <div className="search-grid">
          <div className="search-group">
            <label>Entreprise acquéreuse (qui achète)</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Tapez le nom de l'entreprise acquéreuse..."
                value={acquirerInput}
                onChange={handleAcquirerInputChange}
                onFocus={() => setShowAcquirerSuggestions(true)}
                className="search-input"
              />
              {showAcquirerSuggestions && acquirerSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {acquirerSuggestions.map((company) => (
                    <li
                      key={company.id}
                      onClick={() => handleSelectAcquirer(company)}
                      className="suggestion-item"
                    >
                      <strong>{company.name}</strong>
                      <span className="ticker">{company.ticker}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {shouldShowNoResults(acquirerInput, acquirerSuggestions, selectedAcquirer, showAcquirerSuggestions) && (
              <p className="search-hint">
                Aucune entreprise cotée correspondante n'a été trouvée. Les sociétés non cotées ne sont pas prises en charge.
              </p>
            )}
            {selectedAcquirer && (
              <div className="selected-company">
                <span className="checkmark">✓</span>
                {selectedAcquirer.name} ({selectedAcquirer.ticker})
              </div>
            )}
          </div>

          <div className="search-group">
            <label>Entreprise cible (à acquérir)</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Tapez le nom de l'entreprise cible..."
                value={targetInput}
                onChange={handleTargetInputChange}
                onFocus={() => setShowTargetSuggestions(true)}
                className="search-input"
              />
              {showTargetSuggestions && targetSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {targetSuggestions.map((company) => (
                    <li
                      key={company.id}
                      onClick={() => handleSelectTarget(company)}
                      className="suggestion-item"
                    >
                      <strong>{company.name}</strong>
                      <span className="ticker">{company.ticker}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {shouldShowNoResults(targetInput, targetSuggestions, selectedTarget, showTargetSuggestions) && (
              <p className="search-hint">
                Aucune entreprise cotée correspondante n'a été trouvée. Les sociétés non cotées ne sont pas prises en charge.
              </p>
            )}
            {selectedTarget && (
              <div className="selected-company">
                <span className="checkmark">✓</span>
                {selectedTarget.name} ({selectedTarget.ticker})
              </div>
            )}
          </div>
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={handleGenerateReport}
          disabled={!selectedAcquirer || !selectedTarget || loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Génération en cours...
            </>
          ) : (
            '📊 Générer le Rapport d\'Analyse'
          )}
        </button>

        {loading && (
          <div className="loading-message">
            <p>Analyse en cours... Cela peut prendre quelques secondes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanySearch;
