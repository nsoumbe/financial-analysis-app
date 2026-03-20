import json
import os
import sys

from anthropic import Anthropic
from google import genai


def format_currency(amount):
    """Format large numbers as currency."""
    if amount is None:
        return "N/A"
    if amount >= 1_000_000_000:
        return f"${amount / 1_000_000_000:.2f}B"
    if amount >= 1_000_000:
        return f"${amount / 1_000_000:.2f}M"
    return f"${amount:,.0f}"


def format_number(amount):
    if amount is None:
        return "N/A"
    return f"{amount:,}"


def format_percentage(value):
    if value is None:
        return "N/A"
    return f"{value}%"


def calculate_financial_metrics(company):
    """Calculate key financial metrics."""
    revenue = company.get('revenue', 0)
    net_income = company.get('netIncome', 0)
    total_assets = company.get('totalAssets', 0)
    total_liabilities = company.get('totalLiabilities', 0)

    if None in (revenue, net_income, total_assets, total_liabilities):
        return {
            'profitMargin': 0,
            'roa': 0,
            'roe': 0,
            'debtRatio': 0,
            'assetTurnover': 0
        }

    return {
        'profitMargin': (net_income / revenue * 100) if revenue > 0 else 0,
        'roa': (net_income / total_assets * 100) if total_assets > 0 else 0,
        'roe': (net_income / (total_assets - total_liabilities) * 100)
        if (total_assets - total_liabilities) > 0 else 0,
        'debtRatio': (total_liabilities / total_assets * 100) if total_assets > 0 else 0,
        'assetTurnover': (revenue / total_assets) if total_assets > 0 else 0
    }


def get_provider_config():
    provider = os.getenv('AI_PROVIDER', 'gemini').strip().lower()

    if provider == 'anthropic':
        return {
            'provider': 'anthropic',
            'display_name': 'Anthropic Claude',
            'api_key': os.getenv('ANTHROPIC_API_KEY', '').strip(),
            'model': os.getenv('ANTHROPIC_MODEL', 'claude-3-5-sonnet-20241022').strip()
        }

    return {
        'provider': 'gemini',
        'display_name': 'Google Gemini',
        'api_key': os.getenv('GEMINI_API_KEY', '').strip(),
        'model': os.getenv('GEMINI_MODEL', 'gemini-2.5-flash').strip()
    }


def build_prompt(acquirer, target, acquirer_metrics, target_metrics):
    return f"""
Vous êtes un expert en analyse financière et en fusions-acquisitions.
Analysez cette acquisition potentielle et générez uniquement un JSON valide.

ENTREPRISE ACQUÉREUSE:
- Nom: {acquirer['name']} ({acquirer['ticker']})
- Revenu annuel: {format_currency(acquirer['revenue'])}
- Bénéfice net: {format_currency(acquirer['netIncome'])}
- Actifs totaux: {format_currency(acquirer['totalAssets'])}
- Passifs totaux: {format_currency(acquirer['totalLiabilities'])}
- Nombre d'employés: {format_number(acquirer.get('employees'))}
- Capitalisation boursière: {format_currency(acquirer['marketCap'])}
- Croissance récente: {format_percentage(acquirer.get('recentGrowth'))}
- R&D: {format_currency(acquirer['rnd'])}
- Marge bénéficiaire: {acquirer_metrics['profitMargin']:.2f}%
- ROE: {acquirer_metrics['roe']:.2f}%
- Ratio de dette: {acquirer_metrics['debtRatio']:.2f}%

ENTREPRISE CIBLE:
- Nom: {target['name']} ({target['ticker']})
- Revenu annuel: {format_currency(target['revenue'])}
- Bénéfice net: {format_currency(target['netIncome'])}
- Actifs totaux: {format_currency(target['totalAssets'])}
- Passifs totaux: {format_currency(target['totalLiabilities'])}
- Nombre d'employés: {format_number(target.get('employees'))}
- Capitalisation boursière: {format_currency(target['marketCap'])}
- Croissance récente: {format_percentage(target.get('recentGrowth'))}
- R&D: {format_currency(target['rnd'])}
- Marge bénéficiaire: {target_metrics['profitMargin']:.2f}%
- ROE: {target_metrics['roe']:.2f}%
- Ratio de dette: {target_metrics['debtRatio']:.2f}%

Structure attendue:
{{
  "title": "Rapport d'Analyse de Fusion-Acquisition",
  "summary": "Résumé exécutif...",
  "comparison": {{
    "strengths_acquirer": ["force 1", "force 2"],
    "strengths_target": ["force 1", "force 2"],
    "risks": ["risque 1", "risque 2"]
  }},
  "financial_analysis": {{
    "valuation": "...",
    "syncergies": ["synergie 1", "synergie 2"],
    "roi_projection": "..."
  }},
  "recommendation": "...",
  "conclusion": "..."
}}
"""


def call_model(provider_config, prompt):
    api_key = provider_config['api_key']
    if not api_key or api_key.startswith('your_'):
        raise RuntimeError(
            f"Missing API key for {provider_config['display_name']}. "
            "Please update your .env file."
        )

    if provider_config['provider'] == 'anthropic':
        client = Anthropic(api_key=api_key)
        message = client.messages.create(
            model=provider_config['model'],
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=provider_config['model'],
        contents=prompt
    )
    return response.text


def parse_analysis_response(response_text):
    try:
        json_start = response_text.find('{')
        json_end = response_text.rfind('}') + 1
        if json_start != -1 and json_end > json_start:
            return json.loads(response_text[json_start:json_end])
    except json.JSONDecodeError:
        pass

    return {
        "title": "Rapport d'Analyse Financière",
        "summary": response_text,
        "comparison": {},
        "financial_analysis": {},
        "recommendation": "",
        "conclusion": ""
    }


def generate_financial_analysis(data):
    """Generate comprehensive financial analysis using the configured AI provider."""
    acquirer = data['acquirer']
    target = data['target']

    acquirer_metrics = calculate_financial_metrics(acquirer)
    target_metrics = calculate_financial_metrics(target)
    provider_config = get_provider_config()
    prompt = build_prompt(acquirer, target, acquirer_metrics, target_metrics)
    response_text = call_model(provider_config, prompt)
    analysis = parse_analysis_response(response_text)

    analysis['acquirer'] = {
        'name': acquirer['name'],
        'ticker': acquirer['ticker'],
        'financials': {
            'revenue': format_currency(acquirer['revenue']),
            'netIncome': format_currency(acquirer['netIncome']),
            'marketCap': format_currency(acquirer['marketCap'])
        },
        'metrics': {key: f"{value:.2f}" for key, value in acquirer_metrics.items()}
    }

    analysis['target'] = {
        'name': target['name'],
        'ticker': target['ticker'],
        'financials': {
            'revenue': format_currency(target['revenue']),
            'netIncome': format_currency(target['netIncome']),
            'marketCap': format_currency(target['marketCap'])
        },
        'metrics': {key: f"{value:.2f}" for key, value in target_metrics.items()}
    }

    analysis['provider'] = provider_config['provider']
    analysis['provider_display_name'] = provider_config['display_name']

    return analysis


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No data provided"}))
        return

    try:
        data = json.loads(sys.argv[1])
        analysis = generate_financial_analysis(data)
        print(json.dumps(analysis))
    except Exception as error:
        print(json.dumps({"error": str(error)}))


if __name__ == "__main__":
    main()
