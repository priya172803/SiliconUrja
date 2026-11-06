export const DEMO_PERSONAS = [
  {
    id: 'domestic',
    roleId: 'domestic',
    badge: 'Domestic',
    label: '⚡ Demo: Domestic User',
    roleName: 'Domestic Consumer',
    name: 'Priyanshu K.',
    email: 'priyanshu.k@siliconurja.io',
    password: 'Domestic@123',
    phone: '9876543210',
    bescomId: '1024589211',
    meterNo: 'DOM-HSR-4421',
    segment: 'Domestic Household',
    zone: 'HSR Layout & Silk Board Zone',
    sanctionedLoad: '3.5 kW',
    tariff: 'LT-2(a) Domestic',
    feeder: 'BESCOM HSR 66/11kV Substation',
    color: 'from-blue-600 to-cyan-500',
    greenCredits: 1240,
    metrics: {
      currentLoad: '1.42 kW',
      powerFactor: '0.98 pf',
      todayCost: '₹184.50',
      monthlyProjected: '₹12,140',
      status: 'Optimal Off-Peak'
    }
  },
  {
    id: 'commercial',
    roleId: 'commercial',
    badge: 'Commercial',
    label: '🏢 Demo: Commercial Manager',
    roleName: 'Facility Manager',
    name: 'Sunita Rao',
    email: 'sunita.rao@ecospaceblr.com',
    password: 'Commercial@123',
    phone: '9845011223',
    bescomId: '2098471204',
    meterNo: 'COM-ORR-8092',
    segment: 'Commercial Enterprise',
    zone: 'Outer Ring Road Tech Corridor',
    sanctionedLoad: '150 kW',
    tariff: 'LT-3 Commercial TOD',
    feeder: 'BESCOM Bellandur 220/66kV GIS Substation',
    color: 'from-blue-700 to-indigo-600',
    metrics: {
      currentLoad: '88.6 kW',
      powerFactor: '0.99 pf',
      todayCost: '₹18,420.00',
      monthlyProjected: '₹12,64,000',
      status: 'Peak Load Shaving Active'
    }
  },
  {
    id: 'industrial',
    roleId: 'industrial',
    badge: 'Industrial',
    label: '🏭 Demo: Industrial Plant Manager',
    roleName: 'Plant Operations Head',
    name: 'Ramesh Hegde',
    email: 'r.hegde@peenyaprecision.in',
    password: 'Industrial@123',
    phone: '9448099887',
    bescomId: '3187654390',
    meterNo: 'IND-PEE-1019',
    segment: 'Industrial Factory',
    zone: 'Peenya Industrial Zone',
    sanctionedLoad: '850 kVA',
    tariff: 'HT-2(a) Heavy Industrial',
    feeder: 'BESCOM Peenya 66/11kV MUSS-2',
    color: 'from-slate-800 to-blue-900',
    metrics: {
      currentLoad: '612 kVA',
      powerFactor: '0.995 pf',
      todayCost: '₹164,800.00',
      monthlyProjected: '₹1,18,50,000',
      status: 'Harmonics Filtered (THD < 3%)'
    }
  },
  {
    id: 'admin',
    roleId: 'admin',
    badge: 'Govt Admin',
    label: '🏛️ Demo: Govt Policy Admin',
    shortLabel: 'Govt Policy Admin',
    roleName: 'Govt Admin / Policy Maker',
    name: 'Dr. Ramesh Rao, IAS',
    badgeId: 'KA-SLDC-ADM-001',
    email: 'ramesh.rao@karnataka.gov.in',
    phone: '9845012345',
    password: 'GovtPolicy2026@Secure',
    jurisdiction: 'KPTCL - SLDC Bengaluru',
    department: 'Karnataka Dept of Energy — SLDC Command Center',
    accessLevel: 'Tier-1 High Security / Policy & SCADA Grid Clearance',
    color: 'from-indigo-900 to-slate-900',
    metrics: {
      activeLoad: '3,842 MW',
      gridFrequency: '50.02 Hz',
      feedersMonitored: '142 Substations',
      alertCount: '0 Critical',
    }
  }
];

export const GRID_ZONES = [
  'HSR Layout & Silk Board Zone',
  'Indiranagar & East Division',
  'Peenya Industrial Zone',
  'Outer Ring Road Tech Corridor',
  'Whitefield Industrial Hub',
  'Electronic City Zone'
];

export const CUSTOMER_SEGMENTS = [
  {
    id: 'domestic',
    title: 'Domestic Household',
    subtext: 'Apartments, residential villas & gated communities (Tariff LT-1 / LT-2a)',
    icon: 'Home',
    defaultLoad: '3.5',
    unit: 'kW',
    suggestedTariff: 'LT-2(a) Domestic'
  },
  {
    id: 'commercial',
    title: 'Commercial Enterprise',
    subtext: 'Tech parks, corporate towers, hospitals & malls (Tariff LT-3 Commercial TOD)',
    icon: 'Building',
    defaultLoad: '150',
    unit: 'kW',
    suggestedTariff: 'LT-3 Commercial TOD'
  },
  {
    id: 'industrial',
    title: 'Industrial Factory',
    subtext: 'Heavy manufacturing, CNC fabrication & foundries (Tariff HT-1 / HT-2)',
    icon: 'Factory',
    defaultLoad: '850',
    unit: 'kVA',
    suggestedTariff: 'HT-2(a) Heavy Industrial'
  }
];

export const METER_TYPES = [
  'LT Smart Electronic AMR Meter',
  'LT Bi-directional Net Meter (Rooftop Solar PV)',
  'HT Tri-vector Time-of-Day (TOD) Meter',
  'CT/PT Operated Grid Revenue Meter'
];
