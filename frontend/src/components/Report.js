import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './Report.css';

function Report({ report, onBackHome }) {
  const [expandedSection, setExpandedSection] = useState('summary');
  const providerLabel = report.provider_display_name || 'IA';

  const addWrappedText = (doc, text, x, y, maxWidth, lineHeight = 7) => {
    const lines = doc.splitTextToSize(text || '', maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };

  const addListSection = (doc, title, items, x, y, maxWidth) => {
    if (!items || items.length === 0) {
      return y;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, x, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    items.forEach((item) => {
      y = addWrappedText(doc, `- ${item}`, x + 2, y, maxWidth - 2, 6);
      y += 2;
    });

    return y + 4;
  };

  const ensurePageSpace = (doc, y, neededHeight = 20) => {
    if (y > 270 - neededHeight) {
      doc.addPage();
      return 20;
    }
    return y;
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 15;
    const pageWidth = 210 - (margin * 2);
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    y = addWrappedText(doc, report.title || 'Rapport d\'Analyse Financiere', margin, y, pageWidth, 9);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Genere avec ${providerLabel} - ${new Date().toLocaleDateString('fr-FR')}`, margin, y);
    y += 10;

    y = ensurePageSpace(doc, y, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Resume Executif', margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    y = addWrappedText(doc, report.summary || 'Aucun resume disponible.', margin, y, pageWidth, 6);
    y += 6;

    y = ensurePageSpace(doc, y, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Comparaison des Entreprises', margin, y);
    y += 8;

    const companySections = [
      { label: 'Acquereuse', company: report.acquirer },
      { label: 'Cible', company: report.target }
    ];

    companySections.forEach(({ label, company }) => {
      y = ensurePageSpace(doc, y, 35);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${label}: ${company?.name || 'N/A'} (${company?.ticker || 'N/A'})`, margin, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const rows = [
        `Revenu: ${company?.financials?.revenue || 'N/A'}`,
        `Benefice net: ${company?.financials?.netIncome || 'N/A'}`,
        `Capitalisation: ${company?.financials?.marketCap || 'N/A'}`
      ];

      rows.forEach((row) => {
        doc.text(row, margin + 2, y);
        y += 6;
      });

      if (company?.metrics) {
        Object.entries(company.metrics).forEach(([key, value]) => {
          y = ensurePageSpace(doc, y, 10);
          doc.text(`${key}: ${value}`, margin + 2, y);
          y += 6;
        });
      }

      y += 4;
    });

    y = ensurePageSpace(doc, y, 25);
    y = addListSection(doc, 'Forces de l\'Acquereuse', report.comparison?.strengths_acquirer, margin, y, pageWidth);
    y = ensurePageSpace(doc, y, 25);
    y = addListSection(doc, 'Forces de la Cible', report.comparison?.strengths_target, margin, y, pageWidth);
    y = ensurePageSpace(doc, y, 25);
    y = addListSection(doc, 'Risques Identifies', report.comparison?.risks, margin, y, pageWidth);

    if (report.financial_analysis?.valuation) {
      y = ensurePageSpace(doc, y, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Analyse Financiere', margin, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Evaluation', margin, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      y = addWrappedText(doc, report.financial_analysis.valuation, margin, y, pageWidth, 6);
      y += 6;
    }

    y = ensurePageSpace(doc, y, 25);
    y = addListSection(doc, 'Synergies Potentielles', report.financial_analysis?.syncergies, margin, y, pageWidth);

    if (report.financial_analysis?.roi_projection) {
      y = ensurePageSpace(doc, y, 25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Projection ROI', margin, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      y = addWrappedText(doc, report.financial_analysis.roi_projection, margin, y, pageWidth, 6);
      y += 6;
    }

    if (report.recommendation) {
      y = ensurePageSpace(doc, y, 25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Recommandation', margin, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      y = addWrappedText(doc, report.recommendation, margin, y, pageWidth, 6);
      y += 6;
    }

    if (report.conclusion) {
      y = ensurePageSpace(doc, y, 25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Conclusion', margin, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      addWrappedText(doc, report.conclusion, margin, y, pageWidth, 6);
    }

    doc.save(`rapport-analyse-${report.acquirer?.ticker || 'acquirer'}-${report.target?.ticker || 'target'}.pdf`);
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <button className="btn btn-secondary" onClick={onBackHome}>
          ← Nouvelle Analyse
        </button>
        <button className="btn btn-primary" onClick={downloadAsPDF}>
          Télécharger en PDF
        </button>
      </div>

      <div className="report-card">
        <h1>{report.title || 'Rapport d\'Analyse Financière'}</h1>

        <section className="report-section">
          <h2
            onClick={() => setExpandedSection(expandedSection === 'summary' ? '' : 'summary')}
            className="section-title"
          >
            Résumé Exécutif
          </h2>
          {(expandedSection === 'summary' || expandedSection === '') && (
            <div className="section-content">
              <p>{report.summary || 'Analyse en cours...'}</p>
            </div>
          )}
        </section>

        <section className="report-section">
          <h2
            onClick={() => setExpandedSection(expandedSection === 'comparison' ? '' : 'comparison')}
            className="section-title"
          >
            Comparaison des Entreprises
          </h2>
          {(expandedSection === 'comparison' || expandedSection === '') && (
            <div className="section-content">
              <div className="companies-grid">
                <div className="company-comparison">
                  <h3>Acquéreuse</h3>
                  <p className="company-name">{report.acquirer?.name}</p>
                  <table>
                    <tbody>
                      <tr>
                        <td className="label">Revenu:</td>
                        <td className="value">{report.acquirer?.financials?.revenue}</td>
                      </tr>
                      <tr>
                        <td className="label">Bénéfice Net:</td>
                        <td className="value">{report.acquirer?.financials?.netIncome}</td>
                      </tr>
                      <tr>
                        <td className="label">Cap. Boursière:</td>
                        <td className="value">{report.acquirer?.financials?.marketCap}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h4>Métriques Clés</h4>
                  <table>
                    <tbody>
                      {report.acquirer?.metrics && Object.entries(report.acquirer.metrics).map(([key, value]) => (
                        <tr key={key}>
                          <td className="label">{key}:</td>
                          <td className="value">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="company-comparison">
                  <h3>Cible</h3>
                  <p className="company-name">{report.target?.name}</p>
                  <table>
                    <tbody>
                      <tr>
                        <td className="label">Revenu:</td>
                        <td className="value">{report.target?.financials?.revenue}</td>
                      </tr>
                      <tr>
                        <td className="label">Bénéfice Net:</td>
                        <td className="value">{report.target?.financials?.netIncome}</td>
                      </tr>
                      <tr>
                        <td className="label">Cap. Boursière:</td>
                        <td className="value">{report.target?.financials?.marketCap}</td>
                      </tr>
                    </tbody>
                  </table>
                  <h4>Métriques Clés</h4>
                  <table>
                    <tbody>
                      {report.target?.metrics && Object.entries(report.target.metrics).map(([key, value]) => (
                        <tr key={key}>
                          <td className="label">{key}:</td>
                          <td className="value">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>

        {report.comparison && (
          <section className="report-section">
            <h2
              onClick={() => setExpandedSection(expandedSection === 'analysis' ? '' : 'analysis')}
              className="section-title"
            >
              Analyse Détaillée
            </h2>
            {(expandedSection === 'analysis' || expandedSection === '') && (
              <div className="section-content">
                {report.comparison.strengths_acquirer && (
                  <div className="analysis-subsection">
                    <h4>Forces de l'Acquéreuse</h4>
                    <ul>
                      {report.comparison.strengths_acquirer.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.comparison.strengths_target && (
                  <div className="analysis-subsection">
                    <h4>Forces de la Cible</h4>
                    <ul>
                      {report.comparison.strengths_target.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.comparison.risks && (
                  <div className="analysis-subsection">
                    <h4>Risques Identifiés</h4>
                    <ul>
                      {report.comparison.risks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {report.financial_analysis && (
          <section className="report-section">
            <h2
              onClick={() => setExpandedSection(expandedSection === 'financial' ? '' : 'financial')}
              className="section-title"
            >
              Analyse Financière
            </h2>
            {(expandedSection === 'financial' || expandedSection === '') && (
              <div className="section-content">
                {report.financial_analysis.valuation && (
                  <div className="analysis-subsection">
                    <h4>Évaluation</h4>
                    <p>{report.financial_analysis.valuation}</p>
                  </div>
                )}

                {report.financial_analysis.syncergies && (
                  <div className="analysis-subsection">
                    <h4>Synergies Potentielles</h4>
                    <ul>
                      {report.financial_analysis.syncergies.map((synergie, idx) => (
                        <li key={idx}>{synergie}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.financial_analysis.roi_projection && (
                  <div className="analysis-subsection">
                    <h4>Projection ROI</h4>
                    <p>{report.financial_analysis.roi_projection}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {report.recommendation && (
          <section className="report-section">
            <h2
              onClick={() => setExpandedSection(expandedSection === 'recommendation' ? '' : 'recommendation')}
              className="section-title"
            >
              Recommandation
            </h2>
            {(expandedSection === 'recommendation' || expandedSection === '') && (
              <div className="section-content">
                <p>{report.recommendation}</p>
              </div>
            )}
          </section>
        )}

        {report.conclusion && (
          <section className="report-section">
            <h2
              onClick={() => setExpandedSection(expandedSection === 'conclusion' ? '' : 'conclusion')}
              className="section-title"
            >
              Conclusion
            </h2>
            {(expandedSection === 'conclusion' || expandedSection === '') && (
              <div className="section-content">
                <p>{report.conclusion}</p>
              </div>
            )}
          </section>
        )}

        <footer className="report-footer">
          <p>Rapport généré avec {providerLabel} - {new Date().toLocaleDateString('fr-FR')}</p>
        </footer>
      </div>
    </div>
  );
}

export default Report;
