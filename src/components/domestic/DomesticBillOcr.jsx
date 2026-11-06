import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Zap
} from 'lucide-react';
import { SAMPLE_OCR_BILLS } from './domesticData';

export default function DomesticBillOcr({ onBillExtracted, currentBillData }) {
  const [selectedBillIndex, setSelectedBillIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [extractedBill, setExtractedBill] = useState(SAMPLE_OCR_BILLS[0]);
  const [uploadedCustomFileName, setUploadedCustomFileName] = useState(null);

  const scanSteps = [
    "Preprocessing BESCOM paper bill scan (deskewing, binarization)...",
    "Extracting RR Number: 'E8-HSR-49201-B' & Tariff Slab LT-2a...",
    "OCR reading meter registers: Prev: 14,210 kWh -> Current: 14,498 kWh (288 Units)...",
    "Executing SiliconUrja NILM vision model (no smart meter required)...",
    "Telemetry disaggregated: Air Conditioner, Geyser & Standby isolated!"
  ];

  const handleSimulateExtraction = (billData = SAMPLE_OCR_BILLS[selectedBillIndex]) => {
    setIsScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsScanning(false);
          setExtractedBill(billData);
          if (onBillExtracted) {
            onBillExtracted(billData);
          }
          return prev;
        }
      });
    }, 550);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedCustomFileName(file.name);
      handleSimulateExtraction({
        ...SAMPLE_OCR_BILLS[0],
        filename: file.name
      });
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedCustomFileName(file.name);
      handleSimulateExtraction({
        ...SAMPLE_OCR_BILLS[0],
        filename: file.name
      });
    }
  };

  const activeBill = extractedBill || SAMPLE_OCR_BILLS[selectedBillIndex];

  return (
    <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>BESCOM OCR Bill Parser</span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-blue-200 font-semibold">
                No Smart Meter Required
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Turn standard BESCOM paper/PDF bills into granular smart disaggregated insights instantly.
          </p>
        </div>

        {/* Sample Bill Selector Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-slate-500 text-[11px] px-1 font-mono font-medium hidden sm:inline">Sample:</span>
          {SAMPLE_OCR_BILLS.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBillIndex(idx);
                setUploadedCustomFileName(null);
                handleSimulateExtraction(b);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                selectedBillIndex === idx && !uploadedCustomFileName
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {idx === 0 ? 'Nov (288u)' : 'Oct Surge (340u)'}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone / Scanning Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-100/50 scale-[1.01]'
            : 'border-blue-200 hover:border-blue-400 bg-blue-50/30'
        }`}
      >
        {/* Laser scanner animation while scanning */}
        {isScanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 shadow-md shadow-blue-500/50 z-20 animate-laser-scan rounded-full"></div>
        )}

        {isScanning ? (
          /* Scanning In-Progress UI */
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center animate-spin text-blue-600">
                <RefreshCw className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <div className="space-y-1 max-w-md">
              <div className="text-sm font-bold text-blue-900 font-mono">
                Running Neural OCR & Telemetry Extraction...
              </div>
              <div className="text-xs text-slate-700 font-mono bg-white p-2.5 rounded-lg border border-blue-200 text-left shadow-sm">
                <span className="text-blue-600 font-bold">&gt; </span>
                {scanSteps[scanStep]}
              </div>
            </div>

            <div className="w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          /* Ready / Upload UI */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Visual Paper Bill Preview Thumbnail */}
            <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
              <div className="w-12 h-14 rounded-lg bg-white border border-blue-200 flex flex-col items-center justify-center p-1 relative shadow-sm">
                <div className="w-7 h-1 bg-blue-600 rounded mb-1"></div>
                <div className="w-8 h-1 bg-slate-300 rounded mb-1"></div>
                <div className="w-6 h-1 bg-slate-300 rounded mb-1"></div>
                <div className="w-7 h-1 bg-slate-300 rounded"></div>
                <span className="text-[8px] font-mono text-blue-700 mt-1 font-bold">BESCOM</span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{uploadedCustomFileName || activeBill.filename}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                    PDF / OCR
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Drag & drop your BESCOM paper/PDF bill here, or browse files
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-600 font-mono mt-1 font-medium">
                  <span>RR: <strong className="text-slate-800">{activeBill.rrNumber}</strong></span>
                  <span>•</span>
                  <span>Billed Units: <strong className="text-blue-700">{activeBill.units} kWh</strong></span>
                  <span>•</span>
                  <span>Amount: <strong className="text-slate-900">₹{activeBill.amount}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label className="cursor-pointer text-xs bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 whitespace-nowrap font-semibold shadow-sm">
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload Bill</span>
                <input 
                  type="file" 
                  accept=".pdf,image/png,image/jpeg" 
                  className="hidden" 
                  onChange={handleFileInput}
                />
              </label>

              {/* Explicit Button required by prompt */}
              <button
                onClick={() => handleSimulateExtraction(activeBill)}
                className="cursor-pointer text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5 fill-white stroke-[2]" />
                <span>Simulate Instant Unit Extraction</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Extracted Telemetry Metadata Bar */}
      <div className="mt-3 bg-blue-50/70 rounded-xl p-3 border border-blue-100 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-slate-700 font-mono text-[11px]">
              VisionML Confidence: <strong className="text-blue-700 font-bold">{activeBill.ocrConfidence}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 text-[11px]">
              Consumer: <strong className="text-slate-800">{activeBill.consumerName} (HSR Layout)</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600">
            <span>Prev Reg: <strong className="text-slate-800">{activeBill.previousReading}</strong></span>
            <span>→</span>
            <span>Curr Reg: <strong className="text-slate-800">{activeBill.currentReading}</strong></span>
            <span className="text-blue-700 bg-blue-100 border border-blue-300 px-1.5 py-0.5 rounded font-bold">
              Δ {activeBill.units} Units
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
