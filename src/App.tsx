import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TutorWorkspace } from './components/TutorWorkspace';
import { PlaygroundHub } from './components/playground/PlaygroundHub';
import { MasteryMap } from './components/MasteryMap';
import { AdaptivePractice } from './components/AdaptivePractice';
import { SessionHistory } from './components/SessionHistory';
import { PricingModal } from './components/PricingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PlaygroundModal } from './components/playground/PlaygroundModal';
import { LegalModal } from './components/LegalModal';

function MainRouter() {
  const { activeView, activePlaygroundModal, closePlaygroundModal } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      <main className="flex-1 w-full">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'tutor' && <TutorWorkspace />}
        {activeView === 'playground' && <PlaygroundHub />}
        {activeView === 'mastery' && <MasteryMap />}
        {activeView === 'practice' && <AdaptivePractice />}
        {activeView === 'history' && <SessionHistory />}
        {activeView === 'pricing' && <PricingModal />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <PlaygroundModal
        isOpen={activePlaygroundModal.isOpen}
        toolType={activePlaygroundModal.toolType}
        title={activePlaygroundModal.title}
        initialEquation={activePlaygroundModal.initialEquation}
        onClose={closePlaygroundModal}
      />

      <LegalModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
