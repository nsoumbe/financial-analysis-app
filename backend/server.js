const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');
const { getCompanyProfile, searchCompanies, loadCompanyDirectory } = require('./secDataService');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
const hasFrontendBuild = fs.existsSync(frontendBuildPath);

if (hasFrontendBuild) {
  app.use(express.static(frontendBuildPath));
}

// Routes
app.get('/', (req, res) => {
  res.send('Backend server is running. Use /api/health or /api/companies/search');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Search companies by name
app.get('/api/companies/search', async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';

    if (!query || query.length < 1) {
      return res.json([]);
    }

    const results = await searchCompanies(query);
    res.json(results);
  } catch (error) {
    console.error('Error searching companies:', error);
    res.status(500).json({ error: 'Failed to search listed companies' });
  }
});

// Get company details
app.get('/api/companies/:id', async (req, res) => {
  try {
    const company = await getCompanyProfile(req.params.id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found or not listed on a supported exchange' });
    }

    res.json(company);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});

// Generate financial analysis report
app.post('/api/analysis/generate', async (req, res) => {
  try {
    const { acquirer, target } = req.body;

    if (!acquirer || !target) {
      return res.status(400).json({ error: 'Both acquirer and target companies are required' });
    }

    const [acquirerData, targetData] = await Promise.all([
      getCompanyProfile(acquirer),
      getCompanyProfile(target)
    ]);

    if (!acquirerData || !targetData) {
      return res.status(404).json({ error: 'One or both companies are not listed on a supported exchange' });
    }

    // Prepare data for Python service
    const analysisData = {
      acquirer: { id: acquirer.toLowerCase(), ...acquirerData },
      target: { id: target.toLowerCase(), ...targetData }
    };

    // Call Python service to generate analysis
    const options = {
      mode: 'text',
      pythonPath: process.env.PYTHON_PATH || 'python',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname, '..', 'python-service'),
      cwd: path.join(__dirname, '..', 'python-service'),
      env: process.env
    };

    const results = await PythonShell.run('analyzer.py', {
      ...options,
      args: [JSON.stringify(analysisData)]
    });

    const report = JSON.parse(results[0]);
    res.json(report);

  } catch (error) {
    console.error('Error generating analysis:', error);
    res.status(500).json({
      error: 'Failed to generate analysis',
      details: error.message
    });
  }
});

if (hasFrontendBuild) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  loadCompanyDirectory()
    .then(({ companies }) => {
      console.log(`Loaded ${companies.length} listed companies from SEC`);
    })
    .catch((error) => {
      console.error('Unable to preload SEC company directory:', error.message);
    });
});
