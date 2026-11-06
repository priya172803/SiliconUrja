import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  UploadCloud, 
  Trash2, 
  ArrowRight,
  RefreshCw,
  Sparkles,
  MapPin,
  Lock,
  ChevronRight
} from 'lucide-react';

export const OfficerRegistration = ({ 
  activePersona, 
  onRegisterSuccess, 
  showToast 
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [role, setRole] = useState('Govt Admin / Policy Maker');
  const [jurisdiction, setJurisdiction] = useState('KPTCL - SLDC Bengaluru');

  // File Upload State Simulator
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Security Clearances Checklist
  const [clearances, setClearances] = useState({
    gridCode: true,
    ndaSecurity: true,
    dualFactor: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with activePersona if selected
  useEffect(() => {
    if (activePersona) {
      setFullName(activePersona.name);
      setEmail(activePersona.email);
      setBadgeId(activePersona.badgeId);
      setRole(activePersona.role);
      setJurisdiction(activePersona.jurisdiction);
      setUploadedFile({
        name: activePersona.fileName,
        size: activePersona.fileSize,
        verified: true,
      });
      setClearances({
        gridCode: true,
        ndaSecurity: true,
        dualFactor: true,
      });
    }
  }, [activePersona]);

  // Email domain check
  const isGovDomain = email.toLowerCase().endsWith('.gov.in') || email.toLowerCase().endsWith('.kptcl.com');
  const hasValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    setIsUploading(true);
    setTimeout(() => {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        verified: true,
      });
      setIsUploading(false);
      showToast({
        type: 'success',
        title: 'ID Document Verified',
        message: `${file.name} successfully encrypted & scanned for government seal.`
      });
    }, 600);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    showToast({
      type: 'info',
      title: 'Document Removed',
      message: 'Official ID clearance document has been detached.'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast({
        type: 'warning',
        title: 'Full Name Required',
        message: 'Please provide official officer full name as per service gazette.'
      });
      return;
    }

    if (!hasValidEmailFormat) {
      showToast({
        type: 'warning',
        title: 'Invalid Email',
        message: 'Please provide a valid institutional email address.'
      });
      return;
    }

    if (!badgeId.trim()) {
      showToast({
        type: 'warning',
        title: 'Badge ID Missing',
        message: 'Official Employee Badge ID is mandatory for department clearance.'
      });
      return;
    }

    if (!uploadedFile) {
      showToast({
        type: 'warning',
        title: 'ID Proof Required',
        message: 'Please upload an official ID card / department authorization order.'
      });
      return;
    }

    if (!clearances.gridCode || !clearances.ndaSecurity || !clearances.dualFactor) {
      showToast({
        type: 'warning',
        title: 'Clearances Incomplete',
        message: 'All three institutional security clearances must be accepted.'
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onRegisterSuccess({
        fullName,
        email,
        badgeId,
        role,
        jurisdiction,
        isGovDomain,
        document: uploadedFile.name,
      });
    }, 1100);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in text-left">
      {/* Name and Employee ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Officer Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4 text-blue-700" />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Ramesh Rao, IAS"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Employee Badge ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4 text-blue-700" />
            </div>
            <input
              type="text"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value.toUpperCase())}
              placeholder="KA-SLDC-ADM-001"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono tracking-wider font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Official Email with Domain Validation Badge */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Institutional Email Address
          </label>
          {email && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isGovDomain
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              {isGovDomain ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Official Domain Verified (.gov.in / .kptcl.com)
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Requires .gov.in or .kptcl.com for fast-track
                </>
              )}
            </span>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="officer.name@karnataka.gov.in or @kptcl.com"
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Role & Jurisdiction Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Officer Role
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="Govt Admin / Policy Maker">Govt Admin / Policy Maker</option>
              <option value="Utility Operations Officer">Utility Operations Officer</option>
              <option value="Load Despatch Controller">Load Despatch Controller</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 text-xs">
              <ChevronRight className="w-4 h-4 rotate-90 text-slate-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" />
            <span>Assigned Jurisdiction</span>
          </label>
          <div className="relative">
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="KPTCL - SLDC Bengaluru">KPTCL - SLDC Bengaluru</option>
              <option value="BESCOM North">BESCOM North</option>
              <option value="BESCOM South">BESCOM South</option>
              <option value="BESCOM East">BESCOM East</option>
              <option value="BESCOM West">BESCOM West</option>
              <option value="Peenya Industrial Zone">Peenya Industrial Zone</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 text-xs">
              <ChevronRight className="w-4 h-4 rotate-90 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Drag-and-drop ID Card Upload Simulator */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center justify-between">
          <span>Official ID Card / Authorization Order</span>
          <span className="text-[10px] text-slate-400 font-normal">PDF, JPG, PNG (Max 10MB)</span>
        </label>

        {!uploadedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-cyan-500 bg-cyan-50/70 scale-[1.01]'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/70'
            }`}
            onClick={() => document.getElementById('id-upload-input')?.click()}
          >
            <input
              id="id-upload-input"
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileInput}
            />
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <RefreshCw className="w-6 h-6 text-cyan-600 animate-spin" />
                <span className="text-xs font-semibold text-slate-700">Validating Cryptographic Hash...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-1.5 space-y-1">
                <div className="p-2 bg-blue-100/70 rounded-full text-blue-800">
                  <UploadCloud className="w-5 h-5 text-blue-700" />
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  <span className="text-blue-700 font-bold hover:underline">Click to upload</span> or drag and drop
                </div>
                <p className="text-[11px] text-slate-500">
                  Official KPTCL / Secretariat Badge or Gazette Notification
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                  {uploadedFile.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500">{uploadedFile.size}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified & Encrypted
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Official Security Clearances Agreement Checklist */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          Official Grid Clearances & Governance Checklist
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-700 select-none">
          <input
            type="checkbox"
            checked={clearances.gridCode}
            onChange={(e) => setClearances({ ...clearances, gridCode: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-600 w-3.5 h-3.5 accent-blue-900"
          />
          <span>
            Pledge compliance with <strong className="font-semibold text-slate-900">Indian Electricity Grid Code (IEGC)</strong> and KERC regulations.
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-700 select-none">
          <input
            type="checkbox"
            checked={clearances.ndaSecurity}
            onChange={(e) => setClearances({ ...clearances, ndaSecurity: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-600 w-3.5 h-3.5 accent-blue-900"
          />
          <span>
            Binding agreement to <strong className="font-semibold text-slate-900">SLDC SCADA Non-Disclosure</strong> under National Critical Information Infrastructure Protection Centre (NCIIPC).
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-700 select-none">
          <input
            type="checkbox"
            checked={clearances.dualFactor}
            onChange={(e) => setClearances({ ...clearances, dualFactor: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-600 w-3.5 h-3.5 accent-blue-900"
          />
          <span>
            Consent to continuous biometric/OTP telemetry logging & IP-restricted session audits.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 hover:from-blue-800 hover:to-blue-700 active:scale-[0.99] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Submitting to State Accreditation Board...</span>
          </>
        ) : (
          <>
            <span>Submit Officer Onboarding Dossier</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
          </>
        )}
      </button>
    </form>
  );
};
