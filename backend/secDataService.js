const axios = require('axios');

const SEC_HEADERS = {
  'User-Agent': 'financial-analysis-app/1.0 student-project contact@example.com',
  'Accept': 'application/json'
};

const EURONEXT_HEADERS = {
  'User-Agent': 'financial-analysis-app/1.0 student-project contact@example.com',
  'Accept': 'text/csv,application/json,text/plain,*/*'
};

const SEC_DIRECTORY_URL = 'https://www.sec.gov/files/company_tickers_exchange.json';
const SEC_COMPANY_FACTS_URL = 'https://data.sec.gov/api/xbrl/companyfacts/CIK';
const SEC_COMPANY_SUBMISSIONS_URL = 'https://data.sec.gov/submissions/CIK';
const EURONEXT_DIRECTORY_URL = 'https://live.euronext.com/pd_es/data/stocks/download?mics=dm_all_stock';
const DIRECTORY_TTL_MS = 24 * 60 * 60 * 1000;
const FACTS_TTL_MS = 6 * 60 * 60 * 1000;

let secDirectoryCache = {
  loadedAt: 0,
  companies: [],
  byId: new Map()
};

let euronextDirectoryCache = {
  loadedAt: 0,
  companies: [],
  byId: new Map()
};

const factsCache = new Map();
const EURONEXT_MARKET_PRIORITY = [
  'Euronext Paris',
  'Euronext Brussels',
  'Euronext Amsterdam',
  'Euronext Lisbon',
  'Euronext Milan',
  'Euronext Dublin',
  'Euronext Growth Paris',
  'Euronext Growth',
  'Euronext Global Equity Market',
  'EuroTLX',
  'Trading After Hours'
];

function normalizeId(value) {
  return String(value || '').trim().toLowerCase();
}

function padCik(cik) {
  return String(cik).padStart(10, '0');
}

function isFresh(timestamp, ttl) {
  return Date.now() - timestamp < ttl;
}

function parseDelimitedLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ';' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function toNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).replace(/\s/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function getEuronextMarketRank(exchange) {
  const index = EURONEXT_MARKET_PRIORITY.indexOf(exchange);
  return index === -1 ? EURONEXT_MARKET_PRIORITY.length : index;
}

async function loadSecDirectory() {
  if (secDirectoryCache.companies.length > 0 && isFresh(secDirectoryCache.loadedAt, DIRECTORY_TTL_MS)) {
    return secDirectoryCache;
  }

  const response = await axios.get(SEC_DIRECTORY_URL, { headers: SEC_HEADERS, timeout: 30000 });
  const payload = response.data;
  const fields = payload.fields || [];
  const data = payload.data || [];

  const companies = data
    .map((row) => {
      const record = Object.fromEntries(fields.map((field, index) => [field, row[index]]));
      const ticker = String(record.ticker || '').trim();
      const name = String(record.name || '').trim();
      if (!ticker || !name) {
        return null;
      }

      return {
        id: normalizeId(ticker),
        source: 'sec',
        cik: String(record.cik),
        name,
        ticker,
        exchange: String(record.exchange || '').trim() || 'Unknown'
      };
    })
    .filter(Boolean);

  secDirectoryCache = {
    loadedAt: Date.now(),
    companies,
    byId: new Map(companies.map((company) => [company.id, company]))
  };

  return secDirectoryCache;
}

async function loadEuronextDirectory() {
  if (euronextDirectoryCache.companies.length > 0 && isFresh(euronextDirectoryCache.loadedAt, DIRECTORY_TTL_MS)) {
    return euronextDirectoryCache;
  }

  const response = await axios.get(EURONEXT_DIRECTORY_URL, { headers: EURONEXT_HEADERS, timeout: 30000 });
  const csvText = Buffer.from(response.data, 'utf8').toString('utf8').replace(/^\uFEFF/, '');
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  const headerIndex = lines.findIndex((line) => line.startsWith('Name;ISIN;Symbol;Market;Currency;'));
  const dataLines = lines.slice(headerIndex + 1).filter((line) => line.includes(';'));

  const companies = dataLines
    .map((line) => {
      const [
        name,
        isin,
        symbol,
        market,
        currency,
        openPrice,
        highPrice,
        lowPrice,
        lastPrice,
        lastTradeMicTime,
        timeZone,
        volume,
        turnover,
        closingPrice,
        closingPriceDateTime
      ] = parseDelimitedLine(line);

      if (!name || !isin || !symbol || !market) {
        return null;
      }

      return {
        id: `euronext:${normalizeId(isin)}`,
        source: 'euronext',
        isin,
        name,
        ticker: symbol,
        exchange: market,
        currency,
        openPrice: toNumber(openPrice),
        highPrice: toNumber(highPrice),
        lowPrice: toNumber(lowPrice),
        lastPrice: toNumber(lastPrice),
        lastTradeMicTime,
        timeZone,
        volume: toNumber(volume),
        turnover: toNumber(turnover),
        closingPrice: toNumber(closingPrice),
        closingPriceDateTime
      };
    })
    .filter(Boolean);

  const preferredCompanies = new Map();
  for (const company of companies) {
    const existing = preferredCompanies.get(company.id);
    if (!existing || getEuronextMarketRank(company.exchange) < getEuronextMarketRank(existing.exchange)) {
      preferredCompanies.set(company.id, company);
    }
  }

  euronextDirectoryCache = {
    loadedAt: Date.now(),
    companies,
    byId: preferredCompanies
  };

  return euronextDirectoryCache;
}

function getFactItems(facts, taxonomy, key) {
  const fact = facts?.[taxonomy]?.[key];
  if (!fact || !fact.units) {
    return [];
  }

  return Object.values(fact.units).flat();
}

function sortByEndDesc(items) {
  return [...items].sort((a, b) => new Date(b.end) - new Date(a.end));
}

function pickLatestValue(items, filterFn = () => true) {
  return sortByEndDesc(items).find(filterFn)?.val ?? null;
}

function pickAnnualSeries(items) {
  return sortByEndDesc(items).filter((item) => {
    const form = String(item.form || '');
    const fp = String(item.fp || '');
    return ['10-K', '10-K/A', '20-F', '20-F/A', '40-F', '40-F/A'].includes(form) && fp === 'FY';
  });
}

function getLatestFactValue(facts, taxonomy, keys, options = {}) {
  const { annualOnly = false } = options;

  for (const key of keys) {
    const items = getFactItems(facts, taxonomy, key);
    if (items.length === 0) {
      continue;
    }

    if (annualOnly) {
      const annualItems = pickAnnualSeries(items);
      if (annualItems.length > 0) {
        return annualItems[0].val;
      }
    }

    const latestValue = pickLatestValue(items);
    if (latestValue !== null) {
      return latestValue;
    }
  }

  return null;
}

function getRevenueGrowth(facts) {
  const revenueKeys = [
    'RevenueFromContractWithCustomerExcludingAssessedTax',
    'RevenueFromContractWithCustomerIncludingAssessedTax',
    'Revenues',
    'SalesRevenueNet'
  ];

  for (const key of revenueKeys) {
    const annualItems = pickAnnualSeries(getFactItems(facts, 'us-gaap', key));
    const uniqueByYear = [];
    const seenYears = new Set();

    for (const item of annualItems) {
      const yearKey = `${item.fy}-${item.end}`;
      if (seenYears.has(yearKey)) {
        continue;
      }
      seenYears.add(yearKey);
      uniqueByYear.push(item);
    }

    if (uniqueByYear.length >= 2) {
      const latest = uniqueByYear[0].val;
      const previous = uniqueByYear[1].val;
      if (latest && previous) {
        return Number((((latest - previous) / previous) * 100).toFixed(2));
      }
    }
  }

  return null;
}

function getEmployees(facts) {
  const deiKeys = ['EntityNumberOfEmployees'];
  const usGaapKeys = ['NumberOfEmployees'];

  return (
    getLatestFactValue(facts, 'dei', deiKeys) ??
    getLatestFactValue(facts, 'us-gaap', usGaapKeys)
  );
}

async function getSecCompanyProfile(id) {
  const directory = await loadSecDirectory();
  const company = directory.byId.get(normalizeId(id));
  if (!company) {
    return null;
  }

  const cacheKey = company.id;
  const cached = factsCache.get(cacheKey);
  if (cached && isFresh(cached.loadedAt, FACTS_TTL_MS)) {
    return cached.profile;
  }

  const cik = padCik(company.cik);
  const [factsResponse, submissionsResponse] = await Promise.all([
    axios.get(`${SEC_COMPANY_FACTS_URL}${cik}.json`, { headers: SEC_HEADERS, timeout: 30000 }),
    axios.get(`${SEC_COMPANY_SUBMISSIONS_URL}${cik}.json`, { headers: SEC_HEADERS, timeout: 30000 })
  ]);

  const factsPayload = factsResponse.data;
  const submissionsPayload = submissionsResponse.data;
  const facts = factsPayload.facts || {};

  const revenue = getLatestFactValue(facts, 'us-gaap', [
    'RevenueFromContractWithCustomerExcludingAssessedTax',
    'RevenueFromContractWithCustomerIncludingAssessedTax',
    'Revenues',
    'SalesRevenueNet'
  ], { annualOnly: true });

  const netIncome = getLatestFactValue(facts, 'us-gaap', ['NetIncomeLoss'], { annualOnly: true });
  const totalAssets = getLatestFactValue(facts, 'us-gaap', ['Assets']);
  const totalLiabilities = getLatestFactValue(facts, 'us-gaap', ['Liabilities']);
  const rnd = getLatestFactValue(facts, 'us-gaap', ['ResearchAndDevelopmentExpense'], { annualOnly: true });
  const employees = getEmployees(facts);
  const recentGrowth = getRevenueGrowth(facts);

  const profile = {
    id: company.id,
    source: 'sec',
    cik,
    name: submissionsPayload.name || company.name,
    ticker: company.ticker,
    exchange: company.exchange,
    revenue,
    netIncome,
    totalAssets,
    totalLiabilities,
    employees,
    marketCap: null,
    recentGrowth,
    rnd
  };

  factsCache.set(cacheKey, { loadedAt: Date.now(), profile });
  return profile;
}

async function getEuronextCompanyProfile(id) {
  const directory = await loadEuronextDirectory();
  const company = directory.byId.get(normalizeId(id));
  if (!company) {
    return null;
  }

  return {
    id: company.id,
    source: 'euronext',
    isin: company.isin,
    name: company.name,
    ticker: company.ticker,
    exchange: company.exchange,
    currency: company.currency,
    revenue: null,
    netIncome: null,
    totalAssets: null,
    totalLiabilities: null,
    employees: null,
    marketCap: null,
    recentGrowth: null,
    rnd: null,
    marketSnapshot: {
      lastPrice: company.lastPrice,
      closingPrice: company.closingPrice,
      turnover: company.turnover,
      volume: company.volume,
      currency: company.currency
    }
  };
}

async function getCompanyProfile(id) {
  const normalized = normalizeId(id);
  if (normalized.startsWith('euronext:')) {
    return getEuronextCompanyProfile(normalized);
  }

  return getSecCompanyProfile(normalized);
}

async function loadCompanyDirectory() {
  const [secDirectory, euronextDirectory] = await Promise.all([
    loadSecDirectory(),
    loadEuronextDirectory()
  ]);

  return {
    companies: [...secDirectory.companies, ...euronextDirectory.companies]
  };
}

async function searchCompanies(query) {
  const normalized = normalizeId(query);
  if (!normalized) {
    return [];
  }

  const [secDirectory, euronextDirectory] = await Promise.all([
    loadSecDirectory(),
    loadEuronextDirectory()
  ]);

  const merged = [...secDirectory.companies, ...euronextDirectory.companies]
    .filter((company) =>
      company.name.toLowerCase().includes(normalized) ||
      company.ticker.toLowerCase().includes(normalized) ||
      company.exchange.toLowerCase().includes(normalized) ||
      String(company.isin || '').toLowerCase().includes(normalized)
    )
    .sort((left, right) => {
      const leftName = left.name.toLowerCase();
      const rightName = right.name.toLowerCase();
      const leftTicker = left.ticker.toLowerCase();
      const rightTicker = right.ticker.toLowerCase();

      const leftExact = Number(leftTicker === normalized || leftName === normalized);
      const rightExact = Number(rightTicker === normalized || rightName === normalized);
      if (leftExact !== rightExact) {
        return rightExact - leftExact;
      }

      const leftStarts = Number(leftTicker.startsWith(normalized) || leftName.startsWith(normalized));
      const rightStarts = Number(rightTicker.startsWith(normalized) || rightName.startsWith(normalized));
      if (leftStarts !== rightStarts) {
        return rightStarts - leftStarts;
      }

      if (left.source !== right.source) {
        if (left.source === 'sec' && right.source !== 'sec') {
          return -1;
        }
        if (right.source === 'sec' && left.source !== 'sec') {
          return 1;
        }
      }

      return getEuronextMarketRank(left.exchange) - getEuronextMarketRank(right.exchange);
    });

  const deduped = [];
  const seen = new Set();

  for (const company of merged) {
    const key = company.source === 'euronext'
      ? `euronext:${normalizeId(company.isin)}`
      : `sec:${company.id}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(company);

    if (deduped.length >= 10) {
      break;
    }
  }

  return deduped;
}

module.exports = {
  getCompanyProfile,
  loadCompanyDirectory,
  searchCompanies
};
