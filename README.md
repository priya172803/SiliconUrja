# SiliconUrja — Unified Energy Grid & Consumer Intelligence Platform

SiliconUrja integrates domestic consumers, commercial facilities, heavy industrial plants, and state energy policy administrators into a single unified virtual smart-meter bridge platform for Bengaluru.

---

## 🚀 Quick Start

From this directory (`SiliconUrja-Final`):

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🎯 Dual Operating Modes

### 1. DEMO MODE (For Hackathon Judges)
* **Instant Evaluation**: Judges can select any predefined persona pill on the login screen or click **"Instant Launch Dashboard"** for zero-friction access without credentials.
* **Predefined Sample Datasets**: Renders complete live load curves, appliance breakdowns, harmonics analysis, SCADA telemetry, and policy simulation models.
* **Judge Quick Evaluation Bar**: A floating switcher on the bottom right and top navigation allows judges to effortlessly switch between all 4 dashboards and personas during live presentation.

| Persona | Sector | Name | Credentials | Sanctioned Load | Tariff |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Domestic Consumer** | Domestic | Priyanshu K. | `priyanshu.k@siliconurja.io` / `Domestic@123` | 3.5 kW | LT-2(a) Domestic |
| **Commercial Manager**| Commercial | Sunita Rao | `sunita.rao@ecospaceblr.com` / `Commercial@123` | 150 kW | LT-3 Commercial TOD |
| **Industrial Head** | Industrial | Ramesh Hegde | `r.hegde@peenyaprecision.in` / `Industrial@123` | 850 kVA | HT-2(a) Industrial |
| **Govt Policy Admin** | Admin / Grid | Dr. Ramesh Rao, IAS | `ramesh.rao@karnataka.gov.in` / `GovtPolicy2026@Secure` | 3,842 MW Grid | SLDC Command Center |

### 2. ACTUAL USER MODE (Supabase Authenticated)
* Authenticates directly with the project's Supabase backend.
* Queries the `profiles` table to retrieve user credentials, `account_type`, `bescom_id`, `grid_zone`, and `connected_load`.
* Dynamically routes the user to their designated dashboard with live user identity headers and database sync.
* New users can register via the multi-step **Registration Portal**, which provisions an account and profile in Supabase.

---

## 🏗️ Integrated Modules & Features

### 1. Domestic Consumer Dashboard (`DomesticPortal`)
* **Real-time Consumption**: Current load, projected monthly billing, and tariff bracket tracking.
* **Electricity Bill OCR Scanner**: Upload or drag-and-drop bill simulation with automatic extraction of units, amount, and meter details.
* **Appliance Breakdown**: Interactive energy breakdown across HVAC, refrigeration, lighting, and standby loss with smart-plug optimization toggles.
* **Green Credits & Rewards**: Points tracking, eco-badges, and redeemable BESCOM electricity bill rebate coupons.
* **Urja AI Copilot**: Intelligent conversational assistant providing personalized energy-saving insights and tariff explanations.

### 2. Commercial Enterprise Dashboard (`CommercialPortal`)
* **Power Demand Profile**: 24-hour load curve, peak-demand indicators, and solar irradiance overlay.
* **HVAC Pre-Cooling Simulator**: Model off-peak thermal pre-cooling to shave high-tariff peak demand hours.
* **Tenant Sub-Metering**: Real-time tenant allocation, energy share percentages, and ESG compliance tracking.
* **ESG Report Generator**: On-demand BRSR & BEE compliance PDF report generation.

### 3. Industrial Operations Dashboard (`IndustrialPortal`)
* **HT Equipment SCADA Monitoring**: Live tracking for Electric Arc Furnace #1, Heavy Rolling Mill, HP Rotary Compressors, and Induction Furnaces.
* **Peak Load Shift Algorithm**: Automated calculations for shifting energy-intensive melt batches to off-peak night windows with projected cost and CO2 savings.
* **Power Quality Analysis**: Real-time Harmonic Distortion (THD < 3%) and Power Factor (0.995 pf) compensation monitoring.

### 4. Admin & State Policy Command Center (`AdminPortal`)
* **SLDC Bengaluru Command Center**: Real-time grid frequency (50.02 Hz), peak demand, and reserve margin indicators.
* **Interactive Bengaluru Grid Maps**: Zone map and schematic distribution map covering HSR, Peenya, Whitefield, ORR, Hebbal, and Central Bengaluru.
* **Sectoral Compliance Audit**: Live compliance scores, penalty assessments, and audit tracking across sectors.
* **Policy Sandbox Simulator**: Interactive policy modeling sliders (Carbon Tax, RE Subsidies, Peak Penalty Multipliers) with dynamic calculation of Grid Stability Index, Emission Reductions, and Revenue Shift.
* **Gazette Policy Dossier Export**: Generate and download official PDF briefings for the Energy Department.

---

## 📁 Project Structure

```
SiliconUrja-Final/
├── .env.local
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── lib/
    │   └── supabaseClient.js
    ├── data/
    │   └── demoPersonas.js
    └── components/
        ├── common/
        │   ├── UnifiedNavbar.jsx
        │   └── JudgeQuickBar.jsx
        ├── auth/
        │   ├── LoginGateway.jsx
        │   ├── EmailPasswordForm.jsx
        │   ├── BescomIdForm.jsx
        │   ├── OfficialLogin.jsx
        │   ├── OfficerRegistration.jsx
        │   ├── RegistrationPortal.jsx
        │   └── PersonaSwitcher.jsx
        ├── domestic/
        ├── commercial/
        ├── industrial/
        └── admin/
```
