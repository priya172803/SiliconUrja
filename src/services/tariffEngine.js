/**
 * SiliconUrja Tariff Calculation Engine
 * 
 * Complies with strict regulatory requirements:
 * 1. Progressive Slab Calculation (separate slab breakdown)
 * 2. Distinct Consumer Categories (Domestic, Commercial, Industrial)
 * 3. Time-of-Day (TOD) Peak / Off-Peak calculations with energy conservation validation
 * 4. Comprehensive Additional Charges: Energy, Fixed, Demand, Taxes, Subsidies
 * 5. Region, DISCOM, and Effective Policy selection
 * 6. Dynamic Admin rate modification & side-by-side comparison
 * 7. Decimal-safe calculations and complete snapshot storage for reproducible historical billing
 */

// Helper for decimal-safe rounding to 2 decimal places
export function roundToTwo(num) {
  if (typeof num !== 'number' || isNaN(num)) return 0.00;
  return Number(Math.round(Number(num + 'e+2')) + 'e-2');
}

/**
 * Standard Verified Regulatory Configurations & Demo Baselines
 */
export const TARIFF_REGISTRY = {
  // Official Verified BESCOM / KERC Tariffs (Karnataka)
  'karnataka-bescom-2026': {
    id: 'karnataka-bescom-2026',
    name: 'KERC BESCOM Official Tariff Order 2025-26',
    region: 'Karnataka',
    discom: 'BESCOM',
    effectiveDate: '2025-04-01',
    isOfficial: true,
    categories: {
      domestic: {
        categoryName: 'Domestic Consumer (LT-2a)',
        description: 'Residential households, apartments, and gated villas',
        billingType: 'progressive_slab',
        slabs: [
          { min: 0, max: 100, rate: 4.75, label: '0 – 100 units (Lifeline / Essential)' },
          { min: 100, max: Infinity, rate: 7.00, label: 'Above 100 units (Standard Consumption)' }
        ],
        fixedCharges: {
          type: 'sanctioned_load',
          baseKw: 1,
          baseRate: 100.00,
          additionalPerKwRate: 110.00
        },
        demandCharges: null,
        timeOfDay: {
          enabled: false
        },
        taxRatePct: 9.0, // 9% Karnataka Electricity Duty
        subsidies: {
          hasGruhaJyothi: true,
          gruhaJyothiCapUnits: 200,
          description: 'Karnataka Gruha Jyothi zero-bill subsidy for eligible domestic consumers up to 200 units'
        }
      },
      commercial: {
        categoryName: 'Commercial Enterprise (LT-3)',
        description: 'Offices, IT tech parks, corporate towers, and commercial facilities',
        billingType: 'progressive_slab',
        slabs: [
          { min: 0, max: 50, rate: 7.75, label: '0 – 50 units (Base Commercial)' },
          { min: 50, max: Infinity, rate: 8.75, label: 'Above 50 units (Commercial Operations)' }
        ],
        fixedCharges: {
          type: 'per_kw',
          ratePerKw: 160.00
        },
        demandCharges: {
          type: 'recorded_demand',
          ratePerKva: 220.00,
          minimumBillingDemandPct: 85
        },
        timeOfDay: {
          enabled: true,
          peakSurchargePerUnit: 1.50, // 18:00 - 22:00 IST
          offPeakRebatePerUnit: 1.00, // 22:00 - 06:00 IST
          normalMultiplier: 1.00
        },
        taxRatePct: 9.0,
        subsidies: null
      },
      industrial: {
        categoryName: 'Heavy Industrial (HT-2a)',
        description: 'Foundries, precision manufacturing, CNC machine shops, and fabrication plants',
        billingType: 'flat_with_tod',
        baseEnergyRate: 6.60,
        slabs: [
          { min: 0, max: Infinity, rate: 6.60, label: 'High Tension Flat Industrial Rate' }
        ],
        fixedCharges: null,
        demandCharges: {
          type: 'sanctioned_demand_kva',
          ratePerKva: 260.00,
          minimumBillingDemandPct: 85
        },
        timeOfDay: {
          enabled: true,
          peakSurchargePerUnit: 1.50,
          offPeakRebatePerUnit: 1.00,
          normalMultiplier: 1.00
        },
        taxRatePct: 9.0,
        subsidies: null
      }
    }
  },

  // Illustrative Demo Configuration (Exact match with prompt's demonstration rules)
  'demo-illustrative-slabs': {
    id: 'demo-illustrative-slabs',
    name: 'Illustrative Demo Dynamic Policy (Prompt Reference)',
    region: 'Demo Grid Zone',
    discom: 'SiliconUrja Virtual Utility',
    effectiveDate: '2026-01-01',
    isOfficial: false,
    labelNote: 'ILLUSTRATIVE DEMO VALUES (Configurable by Admin)',
    categories: {
      domestic: {
        categoryName: 'Demo Domestic Household',
        description: 'Standard 3-tier progressive slab example',
        billingType: 'progressive_slab',
        slabs: [
          { min: 0, max: 100, rate: 3.00, label: 'First 100 units @ ₹3/unit' },
          { min: 100, max: 200, rate: 5.00, label: 'Next 100 units @ ₹5/unit' },
          { min: 200, max: Infinity, rate: 7.00, label: 'Remaining units @ ₹7/unit' }
        ],
        fixedCharges: {
          type: 'fixed_lump_sum',
          amount: 80.00
        },
        demandCharges: null,
        timeOfDay: {
          enabled: false
        },
        taxRatePct: 5.0,
        subsidies: {
          flatDiscount: 0.00
        }
      },
      commercial: {
        categoryName: 'Demo Commercial Facility',
        description: 'Progressive commercial tiers with time-of-day peak surcharge',
        billingType: 'progressive_slab',
        slabs: [
          { min: 0, max: 100, rate: 6.50, label: 'First 100 units @ ₹6.50/unit' },
          { min: 100, max: 300, rate: 8.00, label: 'Next 200 units @ ₹8.00/unit' },
          { min: 300, max: Infinity, rate: 10.50, label: 'Remaining units @ ₹10.50/unit' }
        ],
        fixedCharges: {
          type: 'fixed_lump_sum',
          amount: 450.00
        },
        demandCharges: {
          type: 'recorded_demand',
          ratePerKva: 180.00
        },
        timeOfDay: {
          enabled: true,
          peakSurchargePerUnit: 2.00,
          offPeakRebatePerUnit: 1.25,
          normalMultiplier: 1.00
        },
        taxRatePct: 9.0,
        subsidies: null
      },
      industrial: {
        categoryName: 'Demo Heavy Industrial',
        description: 'High tension bulk power with high demand charges and aggressive TOD incentives',
        billingType: 'progressive_slab',
        slabs: [
          { min: 0, max: 500, rate: 5.80, label: 'First 500 units @ ₹5.80/unit' },
          { min: 500, max: Infinity, rate: 7.20, label: 'Above 500 units @ ₹7.20/unit' }
        ],
        fixedCharges: null,
        demandCharges: {
          type: 'sanctioned_demand_kva',
          ratePerKva: 240.00
        },
        timeOfDay: {
          enabled: true,
          peakSurchargePerUnit: 2.50,
          offPeakRebatePerUnit: 1.50,
          normalMultiplier: 1.00
        },
        taxRatePct: 9.0,
        subsidies: null
      }
    }
  }
};

/**
 * Validates inputs for calculation accuracy
 */
function validateInputs({ totalUnits, peakUnits, normalUnits, offPeakUnits, connectedLoadKw, billingDemandKva }) {
  const errors = [];

  if (typeof totalUnits !== 'number' || isNaN(totalUnits) || totalUnits < 0) {
    errors.push('Total consumption units cannot be negative or invalid');
  }

  // Validate TOD conservation of units when TOD units are supplied
  const p = Number(peakUnits || 0);
  const n = Number(normalUnits || 0);
  const op = Number(offPeakUnits || 0);
  const todSum = p + n + op;

  if (p < 0 || n < 0 || op < 0) {
    errors.push('Peak, Normal, and Off-Peak consumption units cannot be negative');
  }

  // Only validate conservation when TOD breakdown is supplied (sum > 0)
  if (todSum > 0) {
    const diff = Math.abs(todSum - totalUnits);
    if (diff > 0.05 && totalUnits > 0) {
      errors.push(`Time-of-day conservation validation failed: Peak (${p}) + Normal (${n}) + Off-Peak (${op}) = ${todSum.toFixed(2)}, which does not match total consumption (${totalUnits.toFixed(2)}).`);
    }
  }

  if (connectedLoadKw !== undefined && (typeof connectedLoadKw !== 'number' || connectedLoadKw < 0)) {
    errors.push('Connected load (kW) cannot be negative');
  }

  if (billingDemandKva !== undefined && (typeof billingDemandKva !== 'number' || billingDemandKva < 0)) {
    errors.push('Billing demand (kVA) cannot be negative');
  }

  return errors;
}

/**
 * Calculates progressive slabs separately
 */
export function calculateSlabs(totalUnits, slabs = []) {
  let remainingUnits = Math.max(0, totalUnits);
  const slabBreakdown = [];
  let totalEnergyCharge = 0;

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const slabSpan = slab.max === Infinity ? Infinity : (slab.max - slab.min);

    if (remainingUnits <= 0) {
      slabBreakdown.push({
        index: i + 1,
        label: slab.label || `Slab ${i + 1}`,
        slabMin: slab.min,
        slabMax: slab.max,
        rate: roundToTwo(slab.rate),
        unitsBilled: 0,
        amount: 0.00
      });
      continue;
    }

    const unitsInThisSlab = Math.min(remainingUnits, slabSpan);
    const slabAmount = roundToTwo(unitsInThisSlab * slab.rate);

    totalEnergyCharge = roundToTwo(totalEnergyCharge + slabAmount);
    remainingUnits = Math.max(0, remainingUnits - unitsInThisSlab);

    slabBreakdown.push({
      index: i + 1,
      label: slab.label || `Slab ${i + 1}`,
      slabMin: slab.min,
      slabMax: slab.max,
      rate: roundToTwo(slab.rate),
      unitsBilled: roundToTwo(unitsInThisSlab),
      amount: slabAmount
    });
  }

  return {
    totalEnergyCharge: roundToTwo(totalEnergyCharge),
    slabBreakdown
  };
}

/**
 * Calculate Time of Day (TOD) Adjustments
 */
export function calculateTodAdjustment({ totalUnits, peakUnits = 0, normalUnits = 0, offPeakUnits = 0, todConfig }) {
  if (!todConfig || !todConfig.enabled) {
    return {
      enabled: false,
      peakSurcharge: 0.00,
      offPeakRebate: 0.00,
      netTodAdjustment: 0.00,
      details: null
    };
  }

  const p = Number(peakUnits || 0);
  const op = Number(offPeakUnits || 0);

  const peakRate = Number(todConfig.peakSurchargePerUnit || 0);
  const offPeakRate = Number(todConfig.offPeakRebatePerUnit || 0);

  const peakSurcharge = roundToTwo(p * peakRate);
  const offPeakRebate = roundToTwo(op * offPeakRate);
  const netTodAdjustment = roundToTwo(peakSurcharge - offPeakRebate);

  return {
    enabled: true,
    peakUnits: p,
    offPeakUnits: op,
    normalUnits: Number(normalUnits || 0),
    peakRate: roundToTwo(peakRate),
    offPeakRate: roundToTwo(offPeakRate),
    peakSurcharge,
    offPeakRebate,
    netTodAdjustment,
    details: `Peak Surcharge (+₹${peakSurcharge.toFixed(2)}) minus Off-Peak Rebate (-₹${offPeakRebate.toFixed(2)})`
  };
}

/**
 * Calculates Fixed Charges
 */
export function calculateFixedCharges(fixedConfig, connectedLoadKw = 1) {
  if (!fixedConfig) return 0.00;

  if (fixedConfig.type === 'fixed_lump_sum') {
    return roundToTwo(fixedConfig.amount || 0);
  }

  if (fixedConfig.type === 'per_kw') {
    return roundToTwo((fixedConfig.ratePerKw || 0) * connectedLoadKw);
  }

  if (fixedConfig.type === 'sanctioned_load') {
    const baseKw = fixedConfig.baseKw || 1;
    const baseRate = fixedConfig.baseRate || 0;
    const additionalRate = fixedConfig.additionalPerKwRate || 0;

    if (connectedLoadKw <= baseKw) {
      return roundToTwo(baseRate);
    }
    const extraKw = connectedLoadKw - baseKw;
    return roundToTwo(baseRate + (extraKw * additionalRate));
  }

  return 0.00;
}

/**
 * Calculates Demand Charges
 */
export function calculateDemandCharges(demandConfig, billingDemandKva = 0, sanctionedKva = 0) {
  if (!demandConfig) return 0.00;

  const rate = Number(demandConfig.ratePerKva || 0);
  const minPct = Number(demandConfig.minimumBillingDemandPct || 0);

  let billableKva = billingDemandKva;
  if (minPct > 0 && sanctionedKva > 0) {
    const minKva = (sanctionedKva * minPct) / 100;
    billableKva = Math.max(billingDemandKva, minKva);
  }

  return roundToTwo(billableKva * rate);
}

/**
 * MASTER TARIFF CALCULATION ENGINE
 * 
 * Computes exact bill using:
 * Final Bill = Energy Charges + Fixed Charges + Demand Charges + Taxes - Subsidies
 */
export function calculateElectricityBill({
  policyId = 'demo-illustrative-slabs',
  customPolicyConfig = null,
  category = 'domestic', // 'domestic' | 'commercial' | 'industrial'
  totalUnits = 0,
  peakUnits = 0,
  normalUnits = 0,
  offPeakUnits = 0,
  connectedLoadKw = 3.5,
  billingDemandKva = 0,
  sanctionedKva = 0,
  applyGruhaJyothi = false,
  userMetadata = {}
}) {
  // Input Validation
  const validationErrors = validateInputs({
    totalUnits,
    peakUnits,
    normalUnits,
    offPeakUnits,
    connectedLoadKw,
    billingDemandKva
  });

  if (validationErrors.length > 0) {
    return {
      success: false,
      errors: validationErrors,
      finalBill: 0.00
    };
  }

  // Retrieve Active Tariff Policy Configuration
  const basePolicy = customPolicyConfig || TARIFF_REGISTRY[policyId] || TARIFF_REGISTRY['demo-illustrative-slabs'];
  const categoryConfig = basePolicy.categories[category] || basePolicy.categories['domestic'];

  // 1. Progressive Energy Charges
  const slabResult = calculateSlabs(totalUnits, categoryConfig.slabs || []);
  let baseEnergyCharge = slabResult.totalEnergyCharge;

  // 2. Time of Day (TOD) Adjustments
  const todResult = calculateTodAdjustment({
    totalUnits,
    peakUnits,
    normalUnits,
    offPeakUnits,
    todConfig: categoryConfig.timeOfDay
  });

  const totalEnergyCharges = roundToTwo(baseEnergyCharge + todResult.netTodAdjustment);

  // 3. Fixed Charges
  const fixedCharges = calculateFixedCharges(categoryConfig.fixedCharges, connectedLoadKw);

  // 4. Demand Charges
  const demandCharges = calculateDemandCharges(categoryConfig.demandCharges, billingDemandKva, sanctionedKva);

  // 5. Taxes (Electricity Duty on energy + fixed)
  const taxableBase = roundToTwo(totalEnergyCharges + fixedCharges + demandCharges);
  const taxRatePct = Number(categoryConfig.taxRatePct || 0);
  const taxes = roundToTwo((taxableBase * taxRatePct) / 100);

  // 6. Subsidies
  let subsidies = 0.00;
  let subsidyLabel = '';

  if (category === 'domestic' && categoryConfig.subsidies) {
    if (categoryConfig.subsidies.hasGruhaJyothi && applyGruhaJyothi) {
      if (totalUnits <= categoryConfig.subsidies.gruhaJyothiCapUnits) {
        // Zero bill for energy charges under Gruha Jyothi
        subsidies = roundToTwo(totalEnergyCharges);
        subsidyLabel = `Gruha Jyothi Zero Energy Bill Subsidy (100% of energy charge for ${totalUnits} units)`;
      } else {
        subsidyLabel = `Consumption exceeds Gruha Jyothi cap of ${categoryConfig.subsidies.gruhaJyothiCapUnits} units; standard billing applied.`;
      }
    } else if (categoryConfig.subsidies.flatDiscount) {
      subsidies = roundToTwo(categoryConfig.subsidies.flatDiscount);
      subsidyLabel = `Government Tariff Rebate (-₹${subsidies.toFixed(2)})`;
    }
  }

  // 7. Final Bill Formula: Energy + Fixed + Demand + Taxes - Subsidies
  const finalBillBeforeSubsidy = roundToTwo(totalEnergyCharges + fixedCharges + demandCharges + taxes);
  const finalBill = Math.max(0.00, roundToTwo(finalBillBeforeSubsidy - subsidies));

  // 8. Tariff Snapshot for reproducible historical billing
  const tariffSnapshot = {
    policyId: basePolicy.id,
    policyName: basePolicy.name,
    region: basePolicy.region,
    discom: basePolicy.discom,
    effectiveDate: basePolicy.effectiveDate,
    isOfficial: basePolicy.isOfficial,
    categoryKey: category,
    categoryName: categoryConfig.categoryName,
    taxRatePct,
    slabs: categoryConfig.slabs ? JSON.parse(JSON.stringify(categoryConfig.slabs)) : [],
    fixedConfig: categoryConfig.fixedCharges ? JSON.parse(JSON.stringify(categoryConfig.fixedCharges)) : null,
    demandConfig: categoryConfig.demandCharges ? JSON.parse(JSON.stringify(categoryConfig.demandCharges)) : null,
    todConfig: categoryConfig.timeOfDay ? JSON.parse(JSON.stringify(categoryConfig.timeOfDay)) : null,
    timestamp: new Date().toISOString()
  };

  return {
    success: true,
    policy: {
      id: basePolicy.id,
      name: basePolicy.name,
      region: basePolicy.region,
      discom: basePolicy.discom,
      isOfficial: basePolicy.isOfficial,
      effectiveDate: basePolicy.effectiveDate
    },
    consumer: {
      category,
      categoryName: categoryConfig.categoryName,
      connectedLoadKw: roundToTwo(connectedLoadKw),
      billingDemandKva: roundToTwo(billingDemandKva),
      sanctionedKva: roundToTwo(sanctionedKva),
      ...userMetadata
    },
    consumption: {
      totalUnits: roundToTwo(totalUnits),
      peakUnits: roundToTwo(peakUnits),
      normalUnits: roundToTwo(normalUnits),
      offPeakUnits: roundToTwo(offPeakUnits)
    },
    breakdown: {
      slabBreakdown: slabResult.slabBreakdown,
      baseEnergyCharge,
      todAdjustment: todResult,
      totalEnergyCharges,
      fixedCharges,
      demandCharges,
      taxes,
      taxRatePct,
      subsidies,
      subsidyLabel,
      finalBillBeforeSubsidy,
      finalBill
    },
    tariffSnapshot
  };
}

/**
 * Dynamic Side-by-Side Consumer Category Comparison
 * Compares Domestic, Commercial, and Industrial for an identical consumption amount
 */
export function compareCategories({
  policyId = 'demo-illustrative-slabs',
  customPolicyConfig = null,
  consumptionUnits = 250,
  peakPct = 20, // % of power consumed during peak
  offPeakPct = 25, // % of power consumed during off-peak night
  connectedLoadKw = 10,
  billingDemandKva = 12
}) {
  const total = Number(consumptionUnits);
  const peak = roundToTwo((total * peakPct) / 100);
  const offPeak = roundToTwo((total * offPeakPct) / 100);
  const normal = roundToTwo(total - peak - offPeak);

  const categories = ['domestic', 'commercial', 'industrial'];

  const results = {};
  categories.forEach((cat) => {
    results[cat] = calculateElectricityBill({
      policyId,
      customPolicyConfig,
      category: cat,
      totalUnits: total,
      peakUnits: peak,
      normalUnits: normal,
      offPeakUnits: offPeak,
      connectedLoadKw,
      billingDemandKva,
      sanctionedKva: billingDemandKva
    });
  });

  // Calculate percentage and rupee differences relative to domestic baseline
  const domesticBill = results.domestic.breakdown.finalBill;
  const commercialBill = results.commercial.breakdown.finalBill;
  const industrialBill = results.industrial.breakdown.finalBill;

  const comparison = {
    consumptionUnits: total,
    domesticBill,
    commercialBill,
    industrialBill,
    commercialDiffRupees: roundToTwo(commercialBill - domesticBill),
    commercialDiffPct: domesticBill > 0 ? roundToTwo(((commercialBill - domesticBill) / domesticBill) * 100) : 0,
    industrialDiffRupees: roundToTwo(industrialBill - domesticBill),
    industrialDiffPct: domesticBill > 0 ? roundToTwo(((industrialBill - domesticBill) / domesticBill) * 100) : 0,
  };

  return {
    results,
    comparison
  };
}
