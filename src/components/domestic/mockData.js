// Mock Data for SiliconUrja | State Policy & Grid Command Center

export const INITIAL_MACRO_METRICS = {
  totalCapacityGW: 192.0,
  peakDemandGW: 188.0,
  reserveMarginGW: 4.0,
  renewableSharePct: 46.2,
  gridFrequencyHz: 50.02,
  gridFrequencyStatus: 'Nominal (±0.03 Hz)',
  bengaluruLoadMW: 6840,
  carbonIntensity: 442, // gCO2 / kWh
  realTimeMarginalPrice: 4.85, // ₹/kWh
  statusAlert: 'Tight Reserve (+4 GW)',
  statusLevel: 'warning', // 'nominal' | 'warning' | 'critical'
  lastSyncTime: '14:30:15 IST (KPTCL-SLDC Sync)',
};

// Bengaluru 4-Zone Telemetry
export const BENGALURU_ZONES = [
  {
    id: 'north',
    name: 'North Zone',
    alias: 'Peenya - Yelahanka Industrial Belt',
    peakDemandMW: 2140,
    capacityMW: 2300,
    utilizationPct: 93.0,
    congestionStatus: 'critical', // 'critical' (Red), 'warning' (Orange), 'optimal' (Green)
    color: '#ef4444',
    bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    feedersTotal: 142,
    feedersTripped: 2,
    substationTempC: 69.4,
    solarRooftopMW: 145,
    evChargersOnline: 310,
    majorNodes: ['Peenya 220kV GIS', 'Yelahanka CCPP', 'Hebbal Receiving Station', 'Jalahalli 66kV'],
    primaryLoadType: 'Heavy MSME & Foundry',
    description: 'High thermal stress on Peenya transformer banks during afternoon heavy manufacturing cycle.'
  },
  {
    id: 'south',
    name: 'South Zone',
    alias: 'Electronic City - Jayanagar Corridor',
    peakDemandMW: 1890,
    capacityMW: 2200,
    utilizationPct: 85.9,
    congestionStatus: 'warning',
    color: '#f59e0b',
    bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    feedersTotal: 168,
    feedersTripped: 0,
    substationTempC: 58.2,
    solarRooftopMW: 285,
    evChargersOnline: 620,
    majorNodes: ['Electronic City 220kV', 'Sarakki 66kV', 'Bannerghatta Substation', 'Koramangala Master Control'],
    primaryLoadType: 'IT Campuses & Dense Residential',
    description: 'Moderate congestion driven by corporate AC loads and evening residential EV charging peaks.'
  },
  {
    id: 'east',
    name: 'East Zone',
    alias: 'Whitefield - Mahadevapura Tech Belt',
    peakDemandMW: 1980,
    capacityMW: 2100,
    utilizationPct: 94.3,
    congestionStatus: 'critical',
    color: '#ef4444',
    bgBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    feedersTotal: 155,
    feedersTripped: 3,
    substationTempC: 71.8,
    solarRooftopMW: 210,
    evChargersOnline: 540,
    majorNodes: ['Whitefield 220kV', 'Hoodi 400kV Grid Substation', 'ITPL Receiving Hub', 'KR Puram 66kV'],
    primaryLoadType: 'Tier-4 Data Centers & Tech Parks',
    description: 'Near-critical 94.3% loading on Hoodi-Whitefield transmission lines due to hyperscale server farms.'
  },
  {
    id: 'west',
    name: 'West Zone',
    alias: 'Rajajinagar - Kengeri - Bidadi Belt',
    peakDemandMW: 1420,
    capacityMW: 2050,
    utilizationPct: 69.3,
    congestionStatus: 'optimal',
    color: '#10b981',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    feedersTotal: 130,
    feedersTripped: 0,
    substationTempC: 49.1,
    solarRooftopMW: 190,
    evChargersOnline: 280,
    majorNodes: ['Bidadi 400kV Substation', 'Kengeri 220kV', 'Rajajinagar 66kV', 'Magadi Road Terminal'],
    primaryLoadType: 'Automotive & Metro Rail Depot',
    description: 'Stable operation with ample headroom; provides emergency wheeling capacity to central ring.'
  }
];

// 24-Hour Grid Demand vs Capacity Profile (GW)
export const HOURLY_GRID_CURVE = [
  { hour: '00:00', demand: 148, capacity: 192, solar: 0, wind: 24, hydro: 18, thermal: 106, forecast: 146 },
  { hour: '02:00', demand: 142, capacity: 192, solar: 0, wind: 28, hydro: 14, thermal: 100, forecast: 141 },
  { hour: '04:00', demand: 139, capacity: 192, solar: 0, wind: 31, hydro: 12, thermal: 96, forecast: 138 },
  { hour: '06:00', demand: 154, capacity: 192, solar: 4, wind: 27, hydro: 19, thermal: 104, forecast: 152 },
  { hour: '08:00', demand: 172, capacity: 192, solar: 22, wind: 21, hydro: 22, thermal: 107, forecast: 170 },
  { hour: '10:00', demand: 181, capacity: 192, solar: 48, wind: 16, hydro: 18, thermal: 99, forecast: 180 },
  { hour: '12:00', demand: 184, capacity: 192, solar: 56, wind: 14, hydro: 16, thermal: 98, forecast: 182 },
  { hour: '14:00', demand: 186, capacity: 192, solar: 51, wind: 15, hydro: 18, thermal: 102, forecast: 185 },
  { hour: '16:00', demand: 182, capacity: 192, solar: 32, wind: 20, hydro: 24, thermal: 106, forecast: 181 },
  { hour: '18:00', demand: 188, capacity: 192, solar: 6, wind: 29, hydro: 36, thermal: 117, forecast: 187 }, // PEAK STRESS
  { hour: '20:00', demand: 187, capacity: 192, solar: 0, wind: 32, hydro: 38, thermal: 117, forecast: 186 }, // PEAK STRESS
  { hour: '22:00', demand: 174, capacity: 192, solar: 0, wind: 29, hydro: 28, thermal: 117, forecast: 173 },
];

// Sectoral Power Consumption Breakdown (MW) across Bengaluru
export const SECTORAL_CONSUMPTION = {
  categories: ['Morning (09:00)', 'Afternoon (14:00)', 'Evening Peak (19:30)', 'Night Base (02:00)'],
  industrial: [2870, 3120, 2450, 1680],
  commercial: [2150, 2680, 2420, 940],
  residential: [1280, 1040, 1970, 1580],
};

// Registered High-Draw Facilities / Factories with Carbon Compliance
export const REGISTERED_FACILITIES = [
  {
    id: 'FAC-KA-0941',
    name: 'Peenya Heavy Precision Alloys Ltd',
    zone: 'North Zone',
    category: 'Metallurgical Foundry',
    monthlyCarbonLimit: 3200,
    actualEmissions: 3740,
    variancePct: 16.8,
    status: 'Flagged',
    powerDrawMW: 18.4,
    auditDate: '2026-10-24',
    complianceRating: 'Non-Compliant (Exceeded 16.8%)',
    contactOfficer: 'Dr. R. K. Hegde (Env GM)'
  },
  {
    id: 'FAC-KA-0812',
    name: 'Whitefield Cloud Tier-IV Server Hub',
    zone: 'East Zone',
    category: 'Data Infrastructure',
    monthlyCarbonLimit: 4500,
    actualEmissions: 4380,
    variancePct: -2.7,
    status: 'Compliant',
    powerDrawMW: 24.2,
    auditDate: '2026-11-01',
    complianceRating: 'Compliant (97.3% Quota Used)',
    contactOfficer: 'S. Vishwanath (Operations VP)'
  },
  {
    id: 'FAC-KA-1029',
    name: 'Bidadi Auto Transmission Works',
    zone: 'West Zone',
    category: 'Automotive Casting',
    monthlyCarbonLimit: 2800,
    actualEmissions: 2250,
    variancePct: -19.6,
    status: 'Compliant',
    powerDrawMW: 12.8,
    auditDate: '2026-10-18',
    complianceRating: 'Green Exemplar (Under Limit)',
    contactOfficer: 'A. Chennappa (Plant Dir)'
  },
  {
    id: 'FAC-KA-0447',
    name: 'Electronic City Silicon Fab Prototype Lab',
    zone: 'South Zone',
    category: 'Semiconductor Fabrication',
    monthlyCarbonLimit: 5100,
    actualEmissions: 5490,
    variancePct: 7.6,
    status: 'Flagged',
    powerDrawMW: 26.5,
    auditDate: '2026-11-03',
    complianceRating: 'Flagged (Excess Peak Draw)',
    contactOfficer: 'Meera Nambiar (Sustainability Head)'
  },
  {
    id: 'FAC-KA-0733',
    name: 'Yelahanka Composite Materials Corp',
    zone: 'North Zone',
    category: 'Aerospace Polymers',
    monthlyCarbonLimit: 1900,
    actualEmissions: 1880,
    variancePct: -1.1,
    status: 'Compliant',
    powerDrawMW: 8.6,
    auditDate: '2026-10-30',
    complianceRating: 'Compliant (Within Buffer)',
    contactOfficer: 'K. S. Narayana (Chief Eng)'
  },
  {
    id: 'FAC-KA-1184',
    name: 'Mahadevapura High-Density Tech Campus',
    zone: 'East Zone',
    category: 'Commercial Tech Complex',
    monthlyCarbonLimit: 3800,
    actualEmissions: 4120,
    variancePct: 8.4,
    status: 'Flagged',
    powerDrawMW: 19.1,
    auditDate: '2026-11-02',
    complianceRating: 'Notice Issued (Warning)',
    contactOfficer: 'P. Somasekhar (Estate VP)'
  },
  {
    id: 'FAC-KA-0319',
    name: 'Rajajinagar Industrial Dyeing & Finishing',
    zone: 'West Zone',
    category: 'Textile Processing',
    monthlyCarbonLimit: 2100,
    actualEmissions: 2590,
    variancePct: 23.3,
    status: 'Flagged',
    powerDrawMW: 11.2,
    auditDate: '2026-10-15',
    complianceRating: 'Severe Violation (+23.3%)',
    contactOfficer: 'M. Qureshi (Managing Partner)'
  },
  {
    id: 'FAC-KA-1250',
    name: 'Bommasandra Precision Extrusions',
    zone: 'South Zone',
    category: 'Metal Extrusion',
    monthlyCarbonLimit: 2600,
    actualEmissions: 2490,
    variancePct: -4.2,
    status: 'Compliant',
    powerDrawMW: 13.4,
    auditDate: '2026-10-27',
    complianceRating: 'Compliant (Solar Offset Applied)',
    contactOfficer: 'G. Venkatesh (EHS Lead)'
  },
  {
    id: 'FAC-KA-0692',
    name: 'Hoodi Telecommunications & Fiber Exchange',
    zone: 'East Zone',
    category: 'Telecom Core Grid',
    monthlyCarbonLimit: 1750,
    actualEmissions: 1610,
    variancePct: -8.0,
    status: 'Compliant',
    powerDrawMW: 7.9,
    auditDate: '2026-10-29',
    complianceRating: 'Compliant',
    contactOfficer: 'T. R. Sreenivas (Infrastructure Head)'
  },
  {
    id: 'FAC-KA-0521',
    name: 'Hebbal Cold Storage & Bio-Pharma Logistics',
    zone: 'North Zone',
    category: 'Pharma Cold Chain',
    monthlyCarbonLimit: 2200,
    actualEmissions: 2160,
    variancePct: -1.8,
    status: 'Compliant',
    powerDrawMW: 9.8,
    auditDate: '2026-11-04',
    complianceRating: 'Compliant',
    contactOfficer: 'Dr. Ananya Rao (QA Director)'
  },
  {
    id: 'FAC-KA-1410',
    name: 'Kengeri EV Battery Module Assembly',
    zone: 'West Zone',
    category: 'CleanTech Manufacturing',
    monthlyCarbonLimit: 3100,
    actualEmissions: 2780,
    variancePct: -10.3,
    status: 'Compliant',
    powerDrawMW: 14.5,
    auditDate: '2026-10-22',
    complianceRating: 'Green Exemplar',
    contactOfficer: 'Pradeep Jha (Chief Technology Officer)'
  },
  {
    id: 'FAC-KA-0883',
    name: 'Bannerghatta Cement Grinding Unit #2',
    zone: 'South Zone',
    category: 'Heavy Building Materials',
    monthlyCarbonLimit: 4200,
    actualEmissions: 4980,
    variancePct: 18.6,
    status: 'Flagged',
    powerDrawMW: 22.0,
    auditDate: '2026-10-20',
    complianceRating: 'Non-Compliant (Emission Exceeded)',
    contactOfficer: 'B. S. Patil (General Manager)'
  }
];

// Presets for the Policy Sandbox Simulator
export const POLICY_PRESETS = [
  {
    id: 'aggressive_decarb',
    name: 'Aggressive Decarbonization 2030',
    badge: 'Govt Green Accord',
    carbonTax: 3400, // ₹/ton
    renewableSubsidy: 32, // %
    peakHourPenalty: 2.5, // multiplier
    evOffPeakDiscount: 35, // %
    description: 'High penalty on thermal baseload and industrial peaks, massive push for solar + storage tariffs.'
  },
  {
    id: 'peak_shaving',
    name: 'Peak Shaving & Reliability Shield',
    badge: 'SLDC Operational Focus',
    carbonTax: 1800,
    renewableSubsidy: 22,
    peakHourPenalty: 3.2,
    evOffPeakDiscount: 40,
    description: 'Prioritizes grid stability during the 18:00 - 22:00 critical window by disincentivizing industrial evening load.'
  },
  {
    id: 'industrial_growth',
    name: 'Industrial Competitiveness Shield',
    badge: 'Trade & Commerce Focus',
    carbonTax: 900,
    renewableSubsidy: 15,
    peakHourPenalty: 1.3,
    evOffPeakDiscount: 15,
    description: 'Lower compliance fees to support manufacturing growth while relying on voluntary green tariffs.'
  },
  {
    id: 'balanced_netzero',
    name: 'Karnataka Net-Zero Pathway 2040',
    badge: 'Recommended State Policy',
    carbonTax: 2200,
    renewableSubsidy: 25,
    peakHourPenalty: 2.0,
    evOffPeakDiscount: 25,
    description: 'Optimal fiscal balance between clean energy subsidy outflows and carbon tax accruals.'
  }
];

// Public Conservation Campaigns & Citizen Green Credit Payouts
export const CONSERVATION_CAMPAIGNS = [
  {
    id: 'CMP-01',
    name: 'Bengaluru Cool Roof & Micro-Solar 2026',
    zoneCoverage: 'City-wide (All 198 Wards)',
    activeCitizens: 54200,
    peakDeferredMW: 24.8,
    budgetSpentCr: 18.5,
    budgetAllocatedCr: 25.0,
    status: 'Active',
    impactDesc: 'High albedo reflective coating on 3.8M sq.ft flat roofs reduced HVAC power draw by 11.2% in South and East tech corridors.'
  },
  {
    id: 'CMP-02',
    name: 'Smart EV Night-Time Charging Shift',
    zoneCoverage: 'South & East Zones (Electronic City & Whitefield)',
    activeCitizens: 38400,
    peakDeferredMW: 42.1,
    budgetSpentCr: 12.2,
    budgetAllocatedCr: 15.0,
    status: 'Active',
    impactDesc: '₹1.50/kWh discount for charging between 01:00 AM - 05:00 AM successfully smoothed the midnight grid valley.'
  },
  {
    id: 'CMP-03',
    name: 'Peenya MSME Energy Efficiency Retrofit',
    zoneCoverage: 'North Zone (Peenya & Jalahalli)',
    activeCitizens: 420, // MSME units
    peakDeferredMW: 16.5,
    budgetSpentCr: 28.4,
    budgetAllocatedCr: 40.0,
    status: 'Active',
    impactDesc: 'Upgrading 500+ legacy motors to IE4 Super Premium efficiency standards, trimming 14,200 tCO2/month.'
  },
  {
    id: 'CMP-04',
    name: 'Rooftop Solar Aggregation Scheme (Surya Mitra)',
    zoneCoverage: 'North & West Zones',
    activeCitizens: 29800,
    peakDeferredMW: 31.4,
    budgetSpentCr: 19.3,
    budgetAllocatedCr: 40.0,
    status: 'Scaling Up',
    impactDesc: 'Virtual power plant pilot aggregating 62 MW rooftop PV feed-in with automated reactive power compensation.'
  }
];

// Citizen Green Credit Wards Leaderboard
export const WARD_LEADERBOARD = [
  { rank: 1, wardName: 'Ward 150 - Bellandur & Outer Ring', creditsDisbursed: '₹1.14 Cr', households: 18200, energySavedMWh: 4210, badge: 'Top Energy Saver' },
  { rank: 2, wardName: 'Ward 174 - HSR Layout', creditsDisbursed: '₹98.2 Lakhs', households: 14900, energySavedMWh: 3680, badge: 'Solar Leader' },
  { rank: 3, wardName: 'Ward 151 - Koramangala', creditsDisbursed: '₹84.6 Lakhs', households: 12400, energySavedMWh: 3150, badge: 'EV Champion' },
  { rank: 4, wardName: 'Ward 82 - Indiranagar', creditsDisbursed: '₹76.0 Lakhs', households: 11100, energySavedMWh: 2890, badge: 'Consistent' },
  { rank: 5, wardName: 'Ward 65 - Malleshwaram', creditsDisbursed: '₹62.5 Lakhs', households: 9800, energySavedMWh: 2410, badge: 'Active' },
];

// Immutable Audit Log
export const IMMUTABLE_AUDIT_LOGS = [
  {
    id: 'LOG-88291',
    timestamp: '2026-11-05 14:22:10 IST',
    actor: 'Dr. S. K. Murthy (Director - KPTCL SLDC)',
    action: 'BESS 200MW Discharge Authorization',
    details: 'Initiated 120 MWh battery discharge from Hoodi substation to buffer Whitefield voltage sag.',
    hash: '0x8f2a...c31b',
    status: 'Verified'
  },
  {
    id: 'LOG-88288',
    timestamp: '2026-11-05 13:45:00 IST',
    actor: 'Principal Secy - Energy Dept (Govt Admin)',
    action: 'Gazette Notice KA-EN-2026-92 Issued',
    details: 'Imposed peak hour surcharge multiplier (1.75x) on heavy metallurgical foundries in Peenya zone.',
    hash: '0x4d19...77a2',
    status: 'Verified'
  },
  {
    id: 'LOG-88274',
    timestamp: '2026-11-05 11:15:32 IST',
    actor: 'Automated BESCOM Smart Grid SCADA',
    action: 'Demand Response Tier-2 Triggered',
    details: 'Sent shed signals to 14 commercial chiller plants in East Zone; successfully shaved 38 MW.',
    hash: '0x99e0...b84f',
    status: 'System Auto'
  },
  {
    id: 'LOG-88260',
    timestamp: '2026-11-05 09:30:18 IST',
    actor: 'KSPCB Compliance Officer (West Div)',
    action: 'Show Cause Penalty Issued',
    details: 'Served non-compliance notice to Rajajinagar Industrial Dyeing unit for 23.3% carbon quota breach.',
    hash: '0x22c1...d489',
    status: 'Verified'
  },
  {
    id: 'LOG-88241',
    timestamp: '2026-11-05 08:00:00 IST',
    actor: 'Pavagada Solar Park Dispatcher',
    action: 'Grid Sync Confirmation',
    details: 'Confirmed 2,050 MW peak solar injection synchronized with central transmission corridor.',
    hash: '0x33aa...5ef1',
    status: 'Verified'
  }
];

// Demo Scenarios
export const DEMO_SCENARIOS = {
  nominal: {
    name: 'Baseline Nominal (Today)',
    description: 'Regular weekday grid operations with 46% clean energy and 4 GW reserve buffer.',
    metrics: {
      totalCapacityGW: 192.0,
      peakDemandGW: 188.0,
      reserveMarginGW: 4.0,
      renewableSharePct: 46.2,
      gridFrequencyHz: 50.02,
      statusAlert: 'Tight Reserve (+4 GW)',
      statusLevel: 'warning',
      bengaluruLoadMW: 6840
    }
  },
  summer_heatwave: {
    name: 'Peak Summer Heatwave (High Stress)',
    description: 'Extreme temperatures push Bengaluru AC cooling loads. Reserve drops to critical +1.2 GW.',
    metrics: {
      totalCapacityGW: 192.0,
      peakDemandGW: 190.8,
      reserveMarginGW: 1.2,
      renewableSharePct: 41.5,
      gridFrequencyHz: 49.88,
      statusAlert: 'CRITICAL: Reserve Deficit Risk (+1.2 GW)',
      statusLevel: 'critical',
      bengaluruLoadMW: 7450
    }
  },
  monsoon_surplus: {
    name: 'Monsoon Wind & Hydro Surplus',
    description: 'Western Ghats hydro stations at full head and high wind velocity in Chitradurga/Gadag.',
    metrics: {
      totalCapacityGW: 194.0,
      peakDemandGW: 172.5,
      reserveMarginGW: 21.5,
      renewableSharePct: 62.4,
      gridFrequencyHz: 50.05,
      statusAlert: 'High Reserve (+21.5 GW) - Green Surplus',
      statusLevel: 'nominal',
      bengaluruLoadMW: 6200
    }
  },
  solar_curtailment: {
    name: 'Pavagada Solar Storm & Cloud Cover',
    description: 'Sudden cloud cover reduces solar yield by 3,200 MW within 40 minutes, triggering BESS fast discharge.',
    metrics: {
      totalCapacityGW: 188.8,
      peakDemandGW: 186.4,
      reserveMarginGW: 2.4,
      renewableSharePct: 34.0,
      gridFrequencyHz: 49.91,
      statusAlert: 'Solar Drop Alert - Peakers Spooled (+2.4 GW)',
      statusLevel: 'warning',
      bengaluruLoadMW: 6890
    }
  }
};
