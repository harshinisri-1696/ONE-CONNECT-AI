import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { NavigatorPage } from './pages/NavigatorPage';
import { FamilyProfilePage } from './pages/FamilyProfilePage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { AdminDataQualityPage } from './pages/AdminDataQualityPage';
import { HomePage } from './pages/HomePage';
import { SchemesPage } from './pages/SchemesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { JobsPage } from './pages/JobsPage';
import { WizardPage } from './pages/WizardPage';
import { TrackerPage } from './pages/TrackerPage';
import { FAQPage } from './pages/FAQPage';
import { ProfilePage } from './pages/ProfilePage';

// Modals & Drawers
import { SchemeModal } from './components/SchemeModal';
import { DocumentModal } from './components/DocumentModal';
import { GuideModal } from './components/GuideModal';
import { JobModal } from './components/JobModal';
import { QuickWizardModal } from './components/QuickWizardModal';
import { NewApplicationModal } from './components/NewApplicationModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';

// Icons
import { Bot, Sparkles, Compass } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsChatbotOpen,
    setIsWizardOpen,
    isChatbotOpen
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Universal Header */}
      <Header />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {activeTab === 'navigator' && <NavigatorPage />}
        {activeTab === 'family' && <FamilyProfilePage />}
        {activeTab === 'action_plan' && <ActionPlanPage />}
        {activeTab === 'admin' && <AdminDataQualityPage />}
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'schemes' && <SchemesPage />}
        {activeTab === 'documents' && <DocumentsPage />}
        {activeTab === 'jobs' && <JobsPage />}
        {activeTab === 'wizard' && <WizardPage />}
        {activeTab === 'tracker' && <TrackerPage />}
        {activeTab === 'faq' && <FAQPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Modals & Slide-ins */}
      <SchemeModal />
      <DocumentModal />
      <GuideModal />
      <JobModal />
      <QuickWizardModal />
      <NewApplicationModal />
      <ChatbotDrawer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Floating Benefit Navigator Button */}
        {activeTab !== 'navigator' && (
          <button
            onClick={() => {
              setActiveTab('navigator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-full shadow-lg border border-slate-200 hover:border-blue-300 transition-all hover:scale-105 group"
          >
            <Compass className="w-4 h-4 text-blue-600 group-hover:rotate-45 transition-transform" />
            <span>Benefit Navigator</span>
          </button>
        )}

        {/* Floating AI Citizen Assistant Trigger */}
        {!isChatbotOpen && (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 group border-2 border-white/20"
            title="Ask OneConnect AI Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 group-hover:animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600"></span>
            </div>
            <span className="text-xs font-bold tracking-wide">AI Assistant</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
