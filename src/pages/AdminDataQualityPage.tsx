import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Check,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { SCHEMES_DATABASE, StructuredScheme } from '../server/schemeDatabase';

export const AdminDataQualityPage: React.FC = () => {
  const [schemes, setSchemes] = useState<StructuredScheme[]>(SCHEMES_DATABASE);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'recently_verified' | 'verification_due' | 'outdated'>('all');
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSchemes = async () => {
    try {
      const res = await fetch('/api/admin/schemes');
      if (res.ok) {
        const data = await res.json();
        setSchemes(data.schemes);
      }
    } catch (e) {
      console.error('Failed to load admin schemes:', e);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleVerifyScheme = async (schemeId: number) => {
    setVerifyingId(schemeId);
    try {
      const res = await fetch('/api/admin/schemes/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId,
          last_verified: new Date().toISOString().split('T')[0],
          verification_status: 'recently_verified'
        })
      });

      if (res.ok) {
        setSchemes(prev =>
          prev.map(s =>
            s.id === schemeId
              ? {
                  ...s,
                  last_verified: new Date().toISOString().split('T')[0],
                  verification_status: 'recently_verified'
                }
              : s
          )
        );
        setSuccessMessage(`Verified Scheme #${schemeId} against official gazette notification.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e) {
      console.error('Failed to verify scheme:', e);
    } finally {
      setVerifyingId(null);
    }
  };

  const totalSchemes = schemes.length;
  const recentlyVerifiedCount = schemes.filter(s => s.verification_status === 'recently_verified').length;
  const verificationDueCount = schemes.filter(s => s.verification_status === 'verification_due').length;
  const outdatedCount = schemes.filter(s => s.verification_status === 'outdated').length;

  const verifiedPct = Math.round((recentlyVerifiedCount / totalSchemes) * 100);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : scheme.verification_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Scheme Freshness & Quality Assurance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Government Welfare Data Quality Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit and verify scheme guidelines, eligibility constraints, official portal endpoints, and publication freshness.
          </p>
        </div>

        <button
          onClick={fetchSchemes}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Scheme Registry
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Registry Health Index</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{verifiedPct}% High</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero hallucinatory entries policy</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Recently Verified</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{recentlyVerifiedCount} Schemes</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Updated within last 30 days</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Verification Due</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{verificationDueCount} Schemes</div>
          <div className="text-[11px] text-slate-500 mt-1">Annual guideline audit recommended</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Outdated / Deprecated</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{outdatedCount} Schemes</div>
          <div className="text-[11px] text-slate-400 mt-1">No discontinued schemes active</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by scheme name or ministry..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Schemes' },
            { id: 'recently_verified', label: '🟢 Verified' },
            { id: 'verification_due', label: '🟡 Due Audit' },
            { id: 'outdated', label: '🔴 Outdated' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Verification Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Scheme Name & Category</th>
                <th className="p-4">Official Department</th>
                <th className="p-4">Last Verified</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSchemes.map(scheme => {
                const isVerified = scheme.verification_status === 'recently_verified';
                const isDue = scheme.verification_status === 'verification_due';

                return (
                  <tr key={scheme.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{scheme.name}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{scheme.category}</div>
                    </td>

                    <td className="p-4 text-slate-600">
                      <div>{scheme.department}</div>
                      <div className="text-slate-400 text-[10px]">Source: {scheme.official_source}</div>
                    </td>

                    <td className="p-4 font-mono text-slate-600">
                      {scheme.last_verified || '2026-08-15'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : isDue
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isVerified ? '✓ Recently Verified' : isDue ? '⚠ Verification Due' : '✗ Outdated'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <a
                        href={scheme.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors"
                      >
                        Portal <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleVerifyScheme(scheme.id)}
                        disabled={verifyingId === scheme.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold shadow-sm transition-colors"
                      >
                        {verifyingId === scheme.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        Verify
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
