// SiliconUrja - Commercial Energy Portal Data Architecture
// Configured for EcoSpace Tech Park, Outer Ring Road, Bellandur, Bengaluru

export const FACILITY_INFO = {
  name: "EcoSpace Tech Park - Campus 2A & 2B",
  address: "Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103",
  gridProvider: "BESCOM (Bangalore Electricity Supply Company)",
  tariffCode: "HT-2B Commercial (IT / Tech Parks)",
  feeder: "66/11 kV Devarabisanahalli Dedicated Substation Feeder 4",
  sanctionedDemandKVA: 2000,
  currentDemandKVA: 1850,
  currentPowerKW: 1835,
  powerFactor: 0.992,
  frequencyHz: 50.02,
  voltagePhaseKV: 11.08,
  leedRating: "LEED v4.1 O+M Platinum (92 Points)",
  beeRating: "BEE 5-Star Commercial Building",
  builtUpAreaSqFt: "1,250,000 sq.ft",
  totalOccupancy: 8450,
};

export const OTHER_FACILITIES = [
  { id: "ecospace", name: "EcoSpace Tech Park - Campus 2A & 2B", location: "Bellandur, Bengaluru", kva: "1,850 / 2,000 kVA", solar: "34%" },
  { id: "prestige", name: "Prestige Tech Park - Jupiter & Electra", location: "Marathahalli, Bengaluru", kva: "2,410 / 2,800 kVA", solar: "29%" },
  { id: "bagmane", name: "Bagmane Constellation Business Park", location: "K.R. Puram, Bengaluru", kva: "3,150 / 3,500 kVA", solar: "41%" },
  { id: "rmz", name: "RMZ Ecoworld - Campus 30", location: "Devarabisanahalli, Bengaluru", kva: "1,980 / 2,200 kVA", solar: "36%" },
];

export const KPI_METRICS = {
  activeDemand: {
    current: 1850,
    contractedLimit: 2000,
    unit: "kVA",
    utilizationPercent: 92.5,
    bufferKVA: 150,
    bufferPercent: 7.5,
    peakRecordedToday: 1910,
    peakTime: "14:15 IST",
    trend15m: "+32 kVA",
    status: "OPTIMAL", // "OPTIMAL" | "WARNING" | "CRITICAL"
  },
  solarShare: {
    percentage: 34,
    currentGenerationKW: 629,
    totalLoadKW: 1850,
    todayYieldKWh: 4820,
    costSavingsTodayINR: 36150,
    carbonAvoidedTonnes: 3.91,
    irradianceWM2: 820,
    ambientTempC: 28.4,
    activeInverters: "12 / 12 Online",
    totalCapacityKWp: 850,
  },
  esgProgress: {
    overallPercentage: 88,
    targetYear: 2026,
    targetMilestone: "Net Zero Carbon Transition Milestone",
    scope1Tonnes: 18.2, // Emergency DG sets during maintenance
    scope2Tonnes: 242.4, // Grid import emission
    scope2DecarbRate: "+4.2% YoY Improvement",
    greenPowerWheelingPercent: 42, // Karnataka Open Access solar/wind
    brsrStatus: "SEBI BRSR Core Audit Ready",
    waterReuseChillerEff: "94.2% Condenser Loop Recovery",
  },
  penaltyRisk: {
    level: "Low",
    bufferPercent: 7.5,
    bufferKVA: 150,
    currentPenaltyExposureINR: 0,
    overdrawRateINR: "₹385 per kVA surcharge",
    aiForecastPeakKVA: 1915,
    forecastHorizon: "Next 2 Hours",
    statusBadge: "Protected (Safe Margin)",
  }
};

export const SECTOR_BREAKDOWN = [
  {
    id: "hvac",
    name: "HVAC & Chillers",
    percentage: 52,
    powerKW: 962,
    subsystems: [
      { name: "Centrifugal Chiller CH-01 (450 TR)", status: "Active (78% Load)", drawKW: 295, cop: 5.9 },
      { name: "Centrifugal Chiller CH-02 (500 TR)", status: "Active (84% Load)", drawKW: 340, cop: 5.8 },
      { name: "Peaker VFD Chiller CH-04 (300 TR)", status: "Modulating (42%)", drawKW: 115, cop: 6.2 },
      { name: "Primary & Secondary CHW Pumps", status: "VFD Active (45 Hz)", drawKW: 94, flow: "1,420 GPM" },
      { name: "Cooling Towers CT-1..4 (Evapco)", status: "Fan Stage 2", drawKW: 68, approach: "3.2°C" },
      { name: "Building AHUs & VAV Boxes (Fl 1-12)", status: "Static Regulated", drawKW: 50, zoneCount: 160 }
    ],
    color: "#06b6d4", // Cyan
    lightBg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    glow: "shadow-glow-cyan",
  },
  {
    id: "datacenter",
    name: "IT Data Center",
    percentage: 30,
    powerKW: 555,
    subsystems: [
      { name: "UPS Bus A (Eaton 9395X High-Eff)", status: "Active (96.8% Eff)", drawKW: 280, loadPct: 62 },
      { name: "UPS Bus B (Eaton 9395X High-Eff)", status: "Active (96.7% Eff)", drawKW: 275, loadPct: 61 },
      { name: "Precision In-Row CRAC Units", status: "Auto Humidified", drawKW: 85, tempSet: "22.0°C" },
      { name: "Server Density & Hot Aisle PDU Feed", status: "Zero Harmonics", drawKW: 390, pue: 1.28 }
    ],
    color: "#10b981", // Emerald
    lightBg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-glow-emerald",
  },
  {
    id: "lighting",
    name: "Floor Lighting & Auxiliary",
    percentage: 18,
    powerKW: 333,
    subsystems: [
      { name: "Smart DALI-2 LED Lighting (Daylight Auto)", status: "Harvesting Active", drawKW: 158, luxAvg: 410 },
      { name: "Otis SkyRise Elevators (Regen Drive)", status: "12 Cars Synchronized", drawKW: 88, regenKWh: 34 },
      { name: "EV Hub Level-2 & DC Fast Hub (24 Guns)", status: "18 Vehicles Charging", drawKW: 87, gridMod: "Peak Capped" }
    ],
    color: "#818cf8", // Indigo
    lightBg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    glow: "shadow-glow-cyan",
  }
];

export const TENANT_ALLOCATION = [
  {
    id: "tower-a",
    tenantName: "FinTech Global Technologies",
    tower: "Tower A (Floors 1-6)",
    activeDrawKW: 92,
    cumulativeHourlyKWh: 450,
    percentShare: 24.3,
    powerFactor: 0.995,
    contractedQuotaKW: 500,
    currentHourlyCostINR: 3825,
    meterStatus: "ONLINE",
    pueIndex: 1.25,
    color: "from-cyan-500 to-blue-600",
    badge: "Financial Core",
    primaryUse: "Trading Floors & Enterprise DevOps"
  },
  {
    id: "tower-b",
    tenantName: "DeepMind & AI Research Labs",
    tower: "Tower B (Floors 1-8)",
    activeDrawKW: 138,
    cumulativeHourlyKWh: 620,
    percentShare: 33.5,
    powerFactor: 0.991,
    contractedQuotaKW: 650,
    currentHourlyCostINR: 5270,
    meterStatus: "ONLINE",
    pueIndex: 1.29,
    color: "from-emerald-500 to-teal-600",
    badge: "High Compute",
    primaryUse: "GPU Cluster & Model Inference"
  },
  {
    id: "tower-c",
    tenantName: "CloudPulse Infrastructure",
    tower: "Tower C (Floors 1-5)",
    activeDrawKW: 84,
    cumulativeHourlyKWh: 380,
    percentShare: 20.5,
    powerFactor: 0.994,
    contractedQuotaKW: 420,
    currentHourlyCostINR: 3230,
    meterStatus: "ONLINE",
    pueIndex: 1.24,
    color: "from-indigo-500 to-purple-600",
    badge: "Cloud NOC",
    primaryUse: "Global SRE & Support Operations"
  },
  {
    id: "retail-plaza",
    tenantName: "Nexus Retail & Executive Dining",
    tower: "Central Plaza (Ground + Mezzanine)",
    activeDrawKW: 48,
    cumulativeHourlyKWh: 210,
    percentShare: 11.4,
    powerFactor: 0.985,
    contractedQuotaKW: 250,
    currentHourlyCostINR: 1785,
    meterStatus: "ONLINE",
    pueIndex: 1.35,
    color: "from-amber-500 to-orange-600",
    badge: "Commercial F&B",
    primaryUse: "Cafeterias, Auditorium, Retail Hub"
  },
  {
    id: "ev-hub",
    tenantName: "EcoCharge Fast Fleet & Mobility Hub",
    tower: "Basement 1 & Surface Bay",
    activeDrawKW: 52,
    cumulativeHourlyKWh: 190,
    percentShare: 10.3,
    powerFactor: 0.998,
    contractedQuotaKW: 220,
    currentHourlyCostINR: 1615,
    meterStatus: "ONLINE",
    pueIndex: 1.10,
    color: "from-cyan-400 to-emerald-400",
    badge: "Green Mobility",
    primaryUse: "Employee EV Charging & Fleet Shuttles"
  }
];

export const HOURLY_LOAD_CURVE = [
  { time: "00:00", demandKVA: 1120, solarKW: 0, gridKVA: 1120, baselineKVA: 1150, tariffRate: 5.80, tariffZone: "Off-Peak" },
  { time: "02:00", demandKVA: 1080, solarKW: 0, gridKVA: 1080, baselineKVA: 1110, tariffRate: 5.80, tariffZone: "Off-Peak" },
  { time: "04:00", demandKVA: 1050, solarKW: 0, gridKVA: 1050, baselineKVA: 1080, tariffRate: 5.80, tariffZone: "Off-Peak" },
  { time: "06:00", demandKVA: 1220, solarKW: 45, gridKVA: 1175, baselineKVA: 1250, tariffRate: 6.80, tariffZone: "Normal" },
  { time: "08:00", demandKVA: 1540, solarKW: 240, gridKVA: 1300, baselineKVA: 1580, tariffRate: 6.80, tariffZone: "Normal" },
  { time: "10:00", demandKVA: 1780, solarKW: 580, gridKVA: 1200, baselineKVA: 1820, tariffRate: 6.80, tariffZone: "Normal" },
  { time: "12:00", demandKVA: 1890, solarKW: 790, gridKVA: 1100, baselineKVA: 1930, tariffRate: 6.80, tariffZone: "Normal" },
  { time: "14:00", demandKVA: 1910, solarKW: 740, gridKVA: 1170, baselineKVA: 1960, tariffRate: 6.80, tariffZone: "Normal" },
  { time: "16:00", demandKVA: 1850, solarKW: 629, gridKVA: 1221, baselineKVA: 1910, tariffRate: 6.80, tariffZone: "Pre-Cooling Active" },
  { time: "18:00", demandKVA: 1680, solarKW: 110, gridKVA: 1570, baselineKVA: 1990, tariffRate: 8.30, tariffZone: "BESCOM Peak (+₹1.50)" },
  { time: "20:00", demandKVA: 1520, solarKW: 0, gridKVA: 1520, baselineKVA: 1840, tariffRate: 8.30, tariffZone: "BESCOM Peak (+₹1.50)" },
  { time: "22:00", demandKVA: 1310, solarKW: 0, gridKVA: 1310, baselineKVA: 1390, tariffRate: 5.80, tariffZone: "Off-Peak (-₹1.00)" }
];

export const BMS_ALERTS = [
  { id: 1, type: "SUCCESS", message: "Rooftop Solar String Inverters operating at 98.4% efficiency (629 kW actual).", time: "2 mins ago" },
  { id: 2, type: "INFO", message: "BESCOM Feeder 4 Voltage stable at 11.08 kV. Power factor: 0.992 lag.", time: "8 mins ago" },
  { id: 3, type: "WARNING", message: "Pre-cooling window recommended before 18:00 IST peak tariff period.", time: "14 mins ago" },
  { id: 4, type: "INFO", message: "Tower B AI Lab sub-meter synchronisation verified with 0.1% accuracy.", time: "26 mins ago" },
];
