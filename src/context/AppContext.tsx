import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TutoringSession,
  TutoringStep,
  StudentResponseLog,
  StudentConceptMastery,
  UserProfile,
  PracticeProblem,
  MisconceptionDiagnosis
} from '../types/math';
import { MATH_CONCEPTS, CURATED_PRACTICE_BANK } from '../lib/mathCatalog';

type ActiveView = 
  | 'landing' 
  | 'tutor' 
  | 'playground' 
  | 'mastery' 
  | 'practice' 
  | 'history' 
  | 'pricing' 
  | 'admin';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  user: UserProfile;
  updateUserTier: (tier: 'free' | 'plus' | 'pro') => void;
  currentSession: TutoringSession | null;
  savedSessions: TutoringSession[];
  conceptMastery: Record<string, StudentConceptMastery>;
  isAnalyzing: boolean;
  isEvaluating: boolean;
  activePlaygroundModal: {
    isOpen: boolean;
    toolType: 'algebra_balance' | 'function_plotter' | 'calculus_explorer';
    title?: string;
    initialEquation?: { left: string; right: string };
  };
  openPlaygroundModal: (toolType: 'algebra_balance' | 'function_plotter' | 'calculus_explorer', title?: string, eq?: { left: string; right: string }) => void;
  closePlaygroundModal: () => void;
  legalModal: { isOpen: boolean; tab: 'terms' | 'privacy' | 'research' };
  openLegalModal: (tab: 'terms' | 'privacy' | 'research') => void;
  closeLegalModal: () => void;

  // Tutoring actions
  startNewSession: (problem: string, subject?: string, difficulty?: string) => Promise<void>;
  submitStepResponse: (responseContent: string, responseType?: 'direct_answer' | 'understood' | 'explain_differently' | 'hint_request' | 'why_valid' | 'compare_methods') => Promise<void>;
  revealNextHint: () => void;
  requestAlternativeExplanation: () => Promise<void>;
  requestWhyValid: () => Promise<void>;
  saveCurrentSession: () => void;
  deleteSavedSession: (id: string) => void;
  resumeSession: (session: TutoringSession) => void;
  
  // Adaptive Practice actions
  recordPracticeAttempt: (problemId: string, conceptId: string, isCorrect: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  id: 'usr_mathmind_demo',
  email: 'learner@mathmind.edu',
  displayName: 'Alex Mercer',
  tier: 'plus',
  avatarSeed: 'alex',
  createdAt: '2026-10-15T10:00:00Z',
  problemsSolved: 14,
  conceptMasteryCount: 4,
  streakDays: 5,
  monthlyAiRequestsUsed: 42,
  monthlyAiRequestsLimit: 250
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mathmind_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [currentSession, setCurrentSession] = useState<TutoringSession | null>(null);
  const [savedSessions, setSavedSessions] = useState<TutoringSession[]>(() => {
    const saved = localStorage.getItem('mathmind_saved_sessions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sess_sample_1',
        originalProblem: '2x + 5 = 15',
        normalizedProblem: '2x + 5 = 15',
        subject: 'Algebra',
        topic: 'Linear Equations in One Variable',
        difficulty: 'Beginner',
        state: 'completed',
        steps: [
          {
            stepId: 'step_1',
            sequenceNumber: 1,
            title: 'Isolate Variable Term',
            explanation: 'Subtracted 5 from both sides to cancel addition by 5.',
            latexExpression: '2x + 5 - 5 = 15 - 5 \\implies 2x = 10',
            whyValid: 'Subtraction Property of Equality',
            question: 'What operation cancels +5?',
            expectedConceptId: 'alg-linear-one-var',
            expectedConceptName: 'Linear Equations in One Variable',
            hints: ['Subtract 5 from both sides.'],
            revealedHintsCount: 1,
            verificationStatus: 'verified',
            isCompleted: true
          },
          {
            stepId: 'step_2',
            sequenceNumber: 2,
            title: 'Divide by Coefficient',
            explanation: 'Divided both sides by 2 to isolate x.',
            latexExpression: '\\frac{2x}{2} = \\frac{10}{2} \\implies x = 5',
            whyValid: 'Division Property of Equality',
            question: 'What is x?',
            expectedConceptId: 'alg-linear-one-var',
            expectedConceptName: 'Linear Equations in One Variable',
            hints: ['10 / 2 = 5'],
            revealedHintsCount: 0,
            verificationStatus: 'verified',
            isCompleted: true
          }
        ],
        currentStepIndex: 1,
        studentResponses: [],
        finalAnswer: 'x = 5',
        finalSummary: 'Solved via inverse operations with balance preservation.',
        createdAt: '2026-10-28T14:20:00Z',
        updatedAt: '2026-10-28T14:32:00Z',
        completedAt: '2026-10-28T14:32:00Z',
        isSaved: true
      }
    ];
  });

  // Initial Mastery Map states based on MATH_CONCEPTS
  const [conceptMastery, setConceptMastery] = useState<Record<string, StudentConceptMastery>>(() => {
    const saved = localStorage.getItem('mathmind_mastery');
    if (saved) return JSON.parse(saved);

    const initialMap: Record<string, StudentConceptMastery> = {};
    MATH_CONCEPTS.forEach(concept => {
      let state: any = 'not_assessed';
      let score = 0;
      let count = 0;

      if (concept.id === 'alg-arithmetic-integers') {
        state = 'demonstrated_understanding';
        score = 92;
        count = 12;
      } else if (concept.id === 'alg-order-of-operations') {
        state = 'demonstrated_understanding';
        score = 88;
        count = 8;
      } else if (concept.id === 'alg-linear-one-var') {
        state = 'developing';
        score = 75;
        count = 5;
      } else if (concept.id === 'alg-quadratics-factoring') {
        state = 'learning';
        score = 45;
        count = 2;
      }

      initialMap[concept.id] = {
        conceptId: concept.id,
        masteryState: state,
        score,
        confidence: score > 80 ? 0.9 : score > 50 ? 0.7 : 0.3,
        evidenceCount: count,
        lastAssessedAt: new Date().toISOString(),
        mistakesRecorded: []
      };
    });
    return initialMap;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [activePlaygroundModal, setActivePlaygroundModal] = useState<{
    isOpen: boolean;
    toolType: 'algebra_balance' | 'function_plotter' | 'calculus_explorer';
    title?: string;
    initialEquation?: { left: string; right: string };
  }>({
    isOpen: false,
    toolType: 'algebra_balance'
  });

  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; tab: 'terms' | 'privacy' | 'research' }>({
    isOpen: false,
    tab: 'terms'
  });

  useEffect(() => {
    localStorage.setItem('mathmind_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mathmind_saved_sessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

  useEffect(() => {
    localStorage.setItem('mathmind_mastery', JSON.stringify(conceptMastery));
  }, [conceptMastery]);

  const openPlaygroundModal = (
    toolType: 'algebra_balance' | 'function_plotter' | 'calculus_explorer',
    title?: string,
    eq?: { left: string; right: string }
  ) => {
    setActivePlaygroundModal({
      isOpen: true,
      toolType,
      title,
      initialEquation: eq
    });
  };

  const closePlaygroundModal = () => {
    setActivePlaygroundModal(prev => ({ ...prev, isOpen: false }));
  };

  const openLegalModal = (tab: 'terms' | 'privacy' | 'research') => {
    setLegalModal({ isOpen: true, tab });
  };

  const closeLegalModal = () => {
    setLegalModal(prev => ({ ...prev, isOpen: false }));
  };

  const updateUserTier = (tier: 'free' | 'plus' | 'pro') => {
    setUser(prev => ({
      ...prev,
      tier,
      monthlyAiRequestsLimit: tier === 'free' ? 25 : tier === 'plus' ? 250 : 1000
    }));
  };

  // Start new tutoring session
  const startNewSession = async (problem: string, subject = 'Algebra', difficulty = 'Beginner') => {
    setIsAnalyzing(true);
    setActiveView('tutor');

    try {
      const res = await fetch('/api/tutoring/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, subject, difficulty })
      });

      const data = await res.json();
      const sessionData = data.sessionData;

      const newSession: TutoringSession = {
        id: `sess_${Date.now()}`,
        originalProblem: problem,
        normalizedProblem: sessionData.normalizedProblem || problem,
        subject: sessionData.subject || (subject as any),
        topic: sessionData.topic || 'Mathematical Problem Solving',
        difficulty: sessionData.difficulty || (difficulty as any),
        state: 'teaching',
        steps: sessionData.steps || [],
        currentStepIndex: 0,
        studentResponses: [],
        finalAnswer: sessionData.finalAnswer,
        finalSummary: sessionData.finalSummary,
        commonMistakesSummary: sessionData.commonMistakesSummary,
        followUpProblems: sessionData.followUpProblems,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSaved: false
      };

      setCurrentSession(newSession);

      // Increment user monthly usage
      setUser(prev => ({
        ...prev,
        monthlyAiRequestsUsed: prev.monthlyAiRequestsUsed + 1
      }));
    } catch (err) {
      console.error('Error starting tutoring session:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit student response to the current step
  const submitStepResponse = async (
    responseContent: string,
    responseType: 'direct_answer' | 'understood' | 'explain_differently' | 'hint_request' | 'why_valid' | 'compare_methods' = 'direct_answer'
  ) => {
    if (!currentSession || currentSession.steps.length === 0) return;
    const currentStep = currentSession.steps[currentSession.currentStepIndex];
    if (!currentStep) return;

    setIsEvaluating(true);

    try {
      const res = await fetch('/api/tutoring/evaluate-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep,
          studentResponse: responseContent,
          responseType,
          allSteps: currentSession.steps
        })
      });

      const evalResult = await res.json();

      const newResponseLog: StudentResponseLog = {
        id: `resp_${Date.now()}`,
        stepId: currentStep.stepId,
        responseContent,
        responseType,
        isCorrect: evalResult.isCorrect,
        evaluationFeedback: evalResult.feedback || evalResult.justification || evalResult.explanation,
        diagnosis: evalResult.diagnosis || undefined,
        timestamp: new Date().toISOString()
      };

      // Update current step & session
      const updatedSteps = [...currentSession.steps];
      let nextIndex = currentSession.currentStepIndex;
      let nextState = currentSession.state;
      let completedAt = currentSession.completedAt;

      if (evalResult.isCorrect) {
        updatedSteps[nextIndex] = {
          ...updatedSteps[nextIndex],
          isCompleted: true
        };

        // Update Concept Mastery
        const conceptId = currentStep.expectedConceptId;
        if (conceptId && conceptMastery[conceptId]) {
          setConceptMastery(prev => {
            const current = prev[conceptId];
            const newScore = Math.min(100, current.score + 10);
            return {
              ...prev,
              [conceptId]: {
                ...current,
                score: newScore,
                evidenceCount: current.evidenceCount + 1,
                masteryState: newScore >= 85 ? 'demonstrated_understanding' : newScore >= 60 ? 'developing' : 'learning',
                confidence: Math.min(0.95, current.confidence + 0.05),
                lastAssessedAt: new Date().toISOString()
              }
            };
          });
        }

        // Advance to next step or complete session
        if (nextIndex < updatedSteps.length - 1) {
          nextIndex += 1;
          nextState = 'teaching';
        } else {
          nextState = 'completed';
          completedAt = new Date().toISOString();
          setUser(prev => ({
            ...prev,
            problemsSolved: prev.problemsSolved + 1
          }));
        }
      } else if (evalResult.diagnosis) {
        nextState = 'diagnosing';
        // Log misconception in concept mastery
        const conceptId = currentStep.expectedConceptId;
        if (conceptId && conceptMastery[conceptId]) {
          setConceptMastery(prev => {
            const current = prev[conceptId];
            return {
              ...prev,
              [conceptId]: {
                ...current,
                score: Math.max(0, current.score - 5),
                masteryState: current.score < 50 ? 'learning' : 'needs_review',
                mistakesRecorded: [
                  ...current.mistakesRecorded,
                  evalResult.diagnosis.observedMistake
                ].slice(-5)
              }
            };
          });
        }
      }

      setCurrentSession({
        ...currentSession,
        steps: updatedSteps,
        currentStepIndex: nextIndex,
        state: nextState,
        studentResponses: [...currentSession.studentResponses, newResponseLog],
        completedAt,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error evaluating response:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Reveal next level of hints
  const revealNextHint = () => {
    if (!currentSession) return;
    const currentStep = currentSession.steps[currentSession.currentStepIndex];
    if (!currentStep || !currentStep.hints) return;

    if (currentStep.revealedHintsCount < currentStep.hints.length) {
      const updatedSteps = [...currentSession.steps];
      updatedSteps[currentSession.currentStepIndex] = {
        ...currentStep,
        revealedHintsCount: currentStep.revealedHintsCount + 1
      };

      setCurrentSession({
        ...currentSession,
        steps: updatedSteps
      });
    }
  };

  // Request alternative explanation
  const requestAlternativeExplanation = async () => {
    await submitStepResponse('Can you explain this step differently?', 'explain_differently');
  };

  // Request why valid
  const requestWhyValid = async () => {
    await submitStepResponse('Why is this step mathematically valid?', 'why_valid');
  };

  // Save session to history
  const saveCurrentSession = () => {
    if (!currentSession) return;
    const sessionToSave = { ...currentSession, isSaved: true };
    setCurrentSession(sessionToSave);

    setSavedSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionToSave.id);
      return [sessionToSave, ...filtered];
    });
  };

  // Delete saved session
  const deleteSavedSession = (id: string) => {
    setSavedSessions(prev => prev.filter(s => s.id !== id));
    if (currentSession?.id === id) {
      setCurrentSession(null);
      setActiveView('landing');
    }
  };

  // Resume saved session
  const resumeSession = (session: TutoringSession) => {
    setCurrentSession(session);
    setActiveView('tutor');
  };

  // Record practice attempt
  const recordPracticeAttempt = (_problemId: string, conceptId: string, isCorrect: boolean) => {
    if (conceptMastery[conceptId]) {
      setConceptMastery(prev => {
        const cur = prev[conceptId];
        const newScore = isCorrect ? Math.min(100, cur.score + 8) : Math.max(0, cur.score - 5);
        return {
          ...prev,
          [conceptId]: {
            ...cur,
            score: newScore,
            evidenceCount: cur.evidenceCount + 1,
            masteryState: newScore >= 85 ? 'demonstrated_understanding' : newScore >= 60 ? 'developing' : 'learning',
            lastAssessedAt: new Date().toISOString()
          }
        };
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        user,
        updateUserTier,
        currentSession,
        savedSessions,
        conceptMastery,
        isAnalyzing,
        isEvaluating,
        activePlaygroundModal,
        openPlaygroundModal,
        closePlaygroundModal,
        legalModal,
        openLegalModal,
        closeLegalModal,
        startNewSession,
        submitStepResponse,
        revealNextHint,
        requestAlternativeExplanation,
        requestWhyValid,
        saveCurrentSession,
        deleteSavedSession,
        resumeSession,
        recordPracticeAttempt
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
