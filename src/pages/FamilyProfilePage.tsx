import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  Landmark,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FamilyMember } from '../types';
import { SCHEMES_DATABASE } from '../server/schemeDatabase';
import { evaluateSchemeEligibility } from '../server/eligibilityEngine';

const RELATIONSHIPS: FamilyMember['relationship'][] = [
  'Self',
  'Father',
  'Mother',
  'Spouse',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Grandparent',
  'Dependent'
];

const SPECIAL_CONDITIONS_OPTIONS = [
  'Student',
  'Farmer',
  'Artisan',
  'Unemployed',
  'Senior Citizen',
  'Differently Abled',
  'Widow',
  'Single Mother',
  'Girl Child (<10 yrs)',
  'Pregnant / Lactating'
];

export const FamilyProfilePage: React.FC = () => {
  const { familyProfile, updateFamilyProfile, addFamilyMember, removeFamilyMember, profile, setActiveTab, t } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState<FamilyMember['gender']>('Male');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('Self');
  const [occupation, setOccupation] = useState('Student');
  const [education, setEducation] = useState("Bachelor's Degree");
  const [income, setIncome] = useState<number>(0);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const handleOpenAddModal = (member?: FamilyMember) => {
    if (member) {
      setEditingMember(member);
      setName(member.name);
      setAge(member.age);
      setGender(member.gender);
      setRelationship(member.relationship);
      setOccupation(member.occupation);
      setEducation(member.education);
      setIncome(member.income);
      setSelectedConditions(member.specialConditions || []);
    } else {
      setEditingMember(null);
      setName('');
      setAge(25);
      setGender('Male');
      setRelationship('Self');
      setOccupation('Job Seeker');
      setEducation('Higher Secondary');
      setIncome(0);
      setSelectedConditions([]);
    }
    setIsAddModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMem: FamilyMember = {
      id: editingMember ? editingMember.id : `mem-${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      gender,
      relationship,
      occupation: occupation.trim(),
      education: education.trim(),
      income: Number(income),
      specialConditions: selectedConditions
    };

    if (editingMember) {
      updateFamilyProfile({
        members: familyProfile.members.map(m => (m.id === editingMember.id ? newMem : m))
      });
    } else {
      addFamilyMember(newMem);
    }

    setIsAddModalOpen(false);
  };

  const toggleCondition = (cond: string) => {
    setSelectedConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  // Calculate Family Aggregates
  const totalIncome = familyProfile.members.reduce((acc, m) => acc + (m.income || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Family-Centric Welfare Optimization
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {familyProfile.familyName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate and maximize government welfare coverage across all family generations and dependent members.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add Family Member
        </button>
      </div>

      {/* Household Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Registered Members</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{familyProfile.members.length} Members</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Multi-generation coverage active</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Cumulative Household Income</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{totalIncome.toLocaleString('en-IN')}/yr</div>
          <div className="text-[11px] text-slate-500 mt-1">Calculated across all earning members</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">State / District Registry</div>
          <div className="text-lg font-bold text-slate-900 mt-1 line-clamp-1">{familyProfile.state}</div>
          <div className="text-[11px] text-slate-500 mt-1">{familyProfile.district || 'Central District'}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Ration / Economic Tier</div>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {familyProfile.hasBPLCard ? 'BPL / Antyodaya' : 'Non-BPL Household'}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Eligible for SECC & DBT Subsidies</div>
        </div>
      </div>

      {/* Family Members List with Scheme Matches */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-blue-600" />
            Individual Family Members & Targeted Entitlements
          </h2>
          <span className="text-xs text-slate-500">Click any member to edit details</span>
        </div>

        <div className="space-y-4">
          {familyProfile.members.map(member => {
            // Evaluate member against schemes
            const memberEvaluations = SCHEMES_DATABASE.map(scheme => ({
              scheme,
              evalResult: evaluateSchemeEligibility(scheme, profile, member)
            })).filter(
              item => item.evalResult.status === 'eligible' || item.evalResult.status === 'almost_eligible'
            );

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-200 transition-all space-y-4"
              >
                {/* Member Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          {member.relationship}
                        </span>
                        <span className="text-xs text-slate-400">
                          {member.age} Yrs • {member.gender}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {member.occupation} • Education: {member.education} • Income: ₹{member.income.toLocaleString('en-IN')}/yr
                      </p>
                    </div>
                  </div>

                  {/* Actions & Conditions Tags */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-wrap gap-1">
                      {member.specialConditions.map((cond, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleOpenAddModal(member)}
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Member"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {familyProfile.members.length > 1 && (
                      <button
                        onClick={() => removeFamilyMember(member.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Target Scheme Matches for this Member */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Matching Government Schemes for {member.name} ({memberEvaluations.length}):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {memberEvaluations.slice(0, 3).map((item, sIdx) => {
                      const isEligible = item.evalResult.status === 'eligible';

                      return (
                        <div
                          key={sIdx}
                          className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                            isEligible ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/40 border-amber-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900 line-clamp-1">
                                {item.scheme.shortName}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  isEligible ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                                }`}
                              >
                                {isEligible ? '🟢 Eligible' : '🟡 Almost'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                              {item.scheme.benefits}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">{item.scheme.category}</span>
                            <a
                              href={item.scheme.official_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
                            >
                              Portal <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-base font-bold">
                {editingMember ? 'Edit Family Member' : 'Add Family Member'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700">Relationship</label>
                  <select
                    value={relationship}
                    onChange={e => setRelationship(e.target.value as FamilyMember['relationship'])}
                    className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {RELATIONSHIPS.map(rel => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Age (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="115"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as FamilyMember['gender'])}
                    className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Annual Income (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={income}
                    onChange={e => setIncome(Number(e.target.value))}
                    className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    placeholder="e.g. Farmer / Student"
                    className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Education Level</label>
                  <input
                    type="text"
                    value={education}
                    onChange={e => setEducation(e.target.value)}
                    placeholder="e.g. Secondary / Graduate"
                    className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Special Conditions */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Special Status / Criteria (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SPECIAL_CONDITIONS_OPTIONS.map(cond => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        selectedConditions.includes(cond)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
