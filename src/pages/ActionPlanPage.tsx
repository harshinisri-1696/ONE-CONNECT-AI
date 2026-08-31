import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  Printer,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActionPlanTask } from '../types';

export const ActionPlanPage: React.FC = () => {
  const {
    actionPlanTasks,
    updateTaskStatus,
    removeTaskFromActionPlan,
    familyProfile,
    profile,
    setActiveTab,
    t
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'immediate' | 'service' | 'document' | 'deadline'>('all');

  const totalTasks = actionPlanTasks.length;
  const completedTasks = actionPlanTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = actionPlanTasks.filter(t => t.status === 'in_progress').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = actionPlanTasks.filter(task => {
    if (activeFilter === 'all') return true;
    return task.category === activeFilter;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            Personalized Welfare Action Plan
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Citizen Benefit Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            A step-by-step prioritized plan generated for <strong>{familyProfile.familyName}</strong> based on your stated needs, eligibility criteria, and missing documentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Action Plan
          </button>
          <button
            onClick={() => setActiveTab('navigator')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Re-evaluate Needs
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Roadmap Progress</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {completedTasks} of {totalTasks} Actions Completed ({progressPercentage}%)
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> {completedTasks} Completed
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <Clock className="w-4 h-4" /> {inProgressTasks} In Progress
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <AlertCircle className="w-4 h-4" /> {totalTasks - completedTasks - inProgressTasks} Pending
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${progressPercentage}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
          />
          <div
            style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
            className="bg-blue-500 h-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Tasks', count: totalTasks },
          { id: 'immediate', label: 'Immediate Submissions', count: actionPlanTasks.filter(t => t.category === 'immediate').length },
          { id: 'service', label: 'Recommended Services', count: actionPlanTasks.filter(t => t.category === 'service').length },
          { id: 'document', label: 'Missing Documents', count: actionPlanTasks.filter(t => t.category === 'document').length },
          { id: 'deadline', label: 'Upcoming Deadlines', count: actionPlanTasks.filter(t => t.category === 'deadline').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap border transition-all ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No actions pending in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have completed all listed items here or no tasks match the selected filter.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm transition-all space-y-4 ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isInProgress
                    ? 'border-blue-200 bg-blue-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          task.priority === 'critical'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'high'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.priority.toUpperCase()} PRIORITY
                      </span>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {task.category.replace('_', ' ').toUpperCase()}
                      </span>

                      {task.assignedMember && (
                        <span className="text-xs text-slate-500">
                          Assigned: <strong className="text-slate-800">{task.assignedMember}</strong>
                        </span>
                      )}

                      {task.matchPercentage && (
                        <span className="text-xs text-emerald-700 font-bold ml-auto sm:ml-0">
                          {task.matchPercentage}% Eligibility Match
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold ${
                        isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>

                  {/* Status Toggle Button Group */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                    <button
                      onClick={() => updateTaskStatus(task.id, 'not_started')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        task.status === 'not_started'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      ☐ Pending
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        task.status === 'in_progress'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      ◐ In Progress
                    </button>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        task.status === 'completed'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      ✓ Completed
                    </button>

                    <button
                      onClick={() => removeTaskFromActionPlan(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors ml-1"
                      title="Remove Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Next Action Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    Next Step:
                  </div>
                  <p className="text-xs text-slate-600">{task.nextAction}</p>
                </div>

                {/* Why Match Factors if available */}
                {task.whyMatch && task.whyMatch.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Evaluation Basis:</span>
                    {task.whyMatch.map((why, wIdx) => (
                      <span key={wIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        ✓ {why}
                      </span>
                    ))}
                  </div>
                )}

                {/* Deadlines or Official Link */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    {task.deadlineDate && (
                      <span className="flex items-center gap-1 text-rose-600 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        Cutoff Date: {task.deadlineDate}
                      </span>
                    )}
                    {task.officialSource && (
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Source: {task.officialSource}
                      </span>
                    )}
                  </div>

                  {task.officialUrl && (
                    <a
                      href={task.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
                    >
                      Open Official Portal
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
