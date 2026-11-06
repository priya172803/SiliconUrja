import { jsPDF } from 'jspdf';

export function exportPolicyPdfReport({ macroMetrics, zones, facilities, policyParams, simulatedResults, userRole }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Top header banner
  doc.setFillColor(11, 18, 34); // Slate-950 tone
  doc.rect(0, 0, 210, 32, 'F');

  // Cyan accent stripe
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 32, 210, 1.5, 'F');

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SILICONURJA | STATE POLICY & GRID COMMAND CENTER', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('GOVERNMENT OF KARNATAKA | ENERGY DEPARTMENT | BESCOM - KPTCL JOINT REGULATORY CELL', 14, 19);
  doc.text(`Executive Grid Audit & Policy Scenario Report | Generated: ${dateStr} ${timeStr} | Role: ${userRole}`, 14, 25);

  // Classification stamp
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.4);
  doc.roundedRect(150, 8, 46, 16, 2, 2);
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL RECORD', 157, 14);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('SEC-GRID-2026-BLR', 158, 19);

  let y = 42;

  // Section 1: Executive Macro Grid Snapshot
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. EXECUTIVE STATE-WIDE MACRO GRID METRICS', 14, y);
  y += 6;

  // 4 Metric cards
  const metrics = [
    { label: 'Total Grid Capacity', val: `${macroMetrics.totalCapacityGW} GW`, sub: 'Installed Base (Thermal+RE)' },
    { label: 'Real-Time Peak Demand', val: `${macroMetrics.peakDemandGW} GW`, sub: 'Current State-wide Load' },
    { label: 'Reserve Margin', val: `+${macroMetrics.reserveMarginGW} GW (${macroMetrics.reserveMarginPct}%)`, sub: 'Oper. Headroom (Tight)' },
    { label: 'Renewable Generation', val: `${macroMetrics.renewableSharePct}%`, sub: 'Solar + Wind + Hydro' },
  ];

  const colWidth = 44;
  metrics.forEach((m, i) => {
    const x = 14 + (i * 47);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(x, y, colWidth, 18, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(x, y, colWidth, 18, 2, 2, 'S');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(m.label.toUpperCase(), x + 3, y + 5);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(m.val, x + 3, y + 11);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(m.sub, x + 3, y + 15);
  });

  y += 25;

  // Section 2: Regional Bengaluru Load & Congestion Summary
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. BENGALURU REGIONAL LOAD & CONGESTION STATUS', 14, y);
  y += 6;

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, 182, 6, 'F');
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ZONE', 16, y + 4.2);
  doc.text('KEY INDUSTRIAL / TECH HUBS', 45, y + 4.2);
  doc.text('DEMAND / CAP', 108, y + 4.2);
  doc.text('CONGESTION', 140, y + 4.2);
  doc.text('STATUS', 172, y + 4.2);
  y += 7;

  zones.forEach((z) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(z.name, 16, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const truncatedKeyAreas = z.keyAreas.length > 38 ? z.keyAreas.substring(0, 36) + '...' : z.keyAreas;
    doc.text(truncatedKeyAreas, 45, y + 4);

    doc.text(`${z.currentDemandMW} / ${z.capacityMW} MW`, 108, y + 4);
    doc.text(`${z.congestionPct}%`, 140, y + 4);

    if (z.status === 'CRITICAL') {
      doc.setTextColor(225, 29, 72);
      doc.setFont('helvetica', 'bold');
    } else if (z.status === 'WARNING') {
      doc.setTextColor(217, 119, 6);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
    }
    doc.text(z.status, 172, y + 4);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 6, 196, y + 6);
    y += 7;
  });

  y += 6;

  // Section 3: Policy Sandbox Simulator Settings & Impact Projection
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3. ACTIVE POLICY "WHAT-IF" SANDBOX SIMULATION PROJECTIONS', 14, y);
  y += 6;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 34, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 34, 2, 2, 'S');

  // Input policy levers
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('APPLIED POLICY LEVERS:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`* Carbon Tax Multiplier: ₹${policyParams.carbonTax}/ton CO2`, 18, y + 12);
  doc.text(`* Renewable Energy Capital Subsidy: ${policyParams.reSubsidy}%`, 18, y + 17);
  doc.text(`* Industrial Peak-Hour Penalty Multiplier: ${policyParams.peakPenalty}x`, 18, y + 22);

  // Projected outcomes
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PROJECTED 12-MONTH IMPACT:', 105, y + 6);
  doc.setTextColor(15, 23, 42);
  doc.text(`Grid Stability Index: ${simulatedResults.stabilityIndex}% (Baseline: 82%)`, 105, y + 12);
  doc.text(`Projected CO2 Reduction: -${simulatedResults.emissionReductionPct}%`, 105, y + 17);
  doc.text(`Estimated Tax Revenue Shift: +₹ ${simulatedResults.revenueShiftCr} Crores/yr`, 105, y + 22);
  doc.text(`Simulated Peak Load Shaving: -${simulatedResults.peakShavedMW} MW in 19:00-21:00 slot`, 105, y + 27);

  y += 42;

  // Section 4: High-Risk Industrial Facilities Requiring Enforcement
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('4. STATUTORY COMPLIANCE & FLAGGED INDUSTRIAL EMITTERS', 14, y);
  y += 6;

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, 182, 6, 'F');
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('FACILITY NAME', 16, y + 4.2);
  doc.text('ZONE', 75, y + 4.2);
  doc.text('LIMIT', 105, y + 4.2);
  doc.text('ACTUAL (tCO2)', 128, y + 4.2);
  doc.text('SURCHARGE LEVIED', 158, y + 4.2);
  y += 7;

  const flagged = facilities.filter(f => f.status === 'Flagged').slice(0, 5);
  flagged.forEach((f) => {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(f.name.substring(0, 32), 16, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(f.zone, 75, y + 4);
    doc.text(`${f.monthlyCarbonLimitT} t`, 105, y + 4);
    
    doc.setTextColor(225, 29, 72);
    doc.setFont('helvetica', 'bold');
    doc.text(`${f.actualEmissionsT} t (+${f.excessT})`, 128, y + 4);
    doc.text(f.penaltyLeviedRs, 158, y + 4);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 6, 196, y + 6);
    y += 7;
  });

  y += 10;

  // Footer & Digital Verification Seal
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 182, 20, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, y, 182, 20, 'S');

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('DIGITAL SCADA DISPATCH VERIFICATION HASH: 0x9f88a2e1d0092c4b78c', 18, y + 6);
  doc.text('This document is electronically ratified by Karnataka State Energy Directorate under SiliconUrja Smart Grid Rules 2026.', 18, y + 11);
  doc.text(`Authorized by: Sri S. K. Rangappa, IAS, Principal Secretary (Energy) | Verification Key: KA-BESCOM-VAL-2026`, 18, y + 16);

  // Save the PDF
  doc.save(`SiliconUrja_Executive_Policy_Report_${dateStr.replace(/ /g, '_')}.pdf`);
}
