import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationStatusRecord } from '../types';
import { CITIZEN_DOCUMENTS } from '../data/documentsData';
import { SCHEMES_DATA } from '../data/schemesData';
import { GOV_JOBS_DATA } from '../data/jobsData';
import { X, PlusCircle, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NewApplicationModal: React.FC = () => {
  const { isNewAppModalOpen, setIsNewAppModalOpen, addApplication, setActiveTab, setGlobalSearch } = useApp();

  const [applicantName, setApplicantName] = useState('Citizen Applicant');
  const [serviceType, setServiceType] = useState<'document' | 'scheme' | 'job'>('document');
  const [serviceName, setServiceName] = useState('Passport Seva Regular Application');
  const [customAppNo, setCustomAppNo] = useState(() => `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [department, setDepartment] = useState('Ministry of External Affairs (CPV)');

  if (!isNewAppModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    
    const newRecord: ApplicationStatusRecord = {
      id: `custom-${Date.now()}`,
      applicationNumber: customAppNo.trim().toUpperCase(),
      applicantName,
      serviceType,
      serviceName,
      department,
      submissionDate: today,
      currentStatus: 'Under Verification',
      estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      verificationOffice: 'Central Citizen Service & Verification Unit',
      referenceDocType: serviceName,
      timeline: [
        {
          title: 'Application Form Submitted',
          status: 'completed',
          date: today,
          description: 'Application successfully registered in National Citizen Registry.',
          officerNote: 'Initial payment and demographic entry validated.'
        },
        {
          title: 'Document Scrutiny & Bio-Metric Verification',
          status: 'in_progress',
          date: 'In Progress',
          description: 'Verification officer inspecting supporting proofs and digital signatures.',
          officerNote: 'Queue Priority: High'
        },
        {
          title: 'Field Inquiry / Police Verification (if applicable)',
          status: 'pending',
          date: 'Scheduled',
          description: 'Physical or digital background address confirmation.'
        },
        {
          title: 'Approval & Digital Dispatch / Speed Post',
          status: 'pending',
          date: 'Pending',
          description: 'Generation of QR-coded certificate/card and dispatch.'
        }
      ],
      remarks: 'Application logged by citizen. Under active desk scrutiny.'
    };

    addApplication(newRecord);
    setIsNewAppModalOpen(false);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
    setGlobalSearch(newRecord.applicationNumber);
    setActiveTab('tracker');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Track New / Existing Application</h3>
          </div>
          <button
            onClick={() => setIsNewAppModalOpen(false)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div className="space-y-1">
            <label className="font-bold text-slate-900">Application / Acknowledgement ID</label>
            <input
              type="text"
              required
              value={customAppNo}
              onChange={(e) => setCustomAppNo(e.target.value)}
              placeholder="e.g. DOC-2024-8921 or SCH-2024-4410"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm font-semibold uppercase focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900">Applicant Full Name</label>
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900">Service Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['document', 'scheme', 'job'] as const).map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setServiceType(type)}
                  className={`py-2 text-center rounded-lg font-semibold capitalize border ${
                    serviceType === type
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900">Service / Scheme Name</label>
            <input
              type="text"
              required
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="e.g. PM Kisan Samman Nidhi or Driving License"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-900">Issuing Authority / Department</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Ministry of Agriculture or UIDAI"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Add to Tracker & View Live Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
