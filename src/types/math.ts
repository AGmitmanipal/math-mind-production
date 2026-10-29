export type SubjectArea = 'Algebra' | 'Calculus' | 'Functions' | 'Geometry' | 'Probability';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type MasteryState = 
  | 'not_assessed' 
  | 'learning' 
  | 'developing' 
  | 'demonstrated_understanding' 
  | 'needs_review';

export interface ConceptPrerequisite {
  conceptId: string;
  name: string;
}

export interface ConceptDefinition {
  id: string;
  slug: string;
  name: string;
  subject: SubjectArea;
  description: string;
  difficulty: DifficultyLevel;
  prerequisites: string[]; // Concept IDs
  commonMisconceptions: string[];
}

export interface StudentConceptMastery {
  conceptId: string;
  masteryState: MasteryState;
  score: number; // 0 - 100
  confidence: number; // 0 - 1.0
  evidenceCount: number;
  lastAssessedAt: string;
  mistakesRecorded: string[];
}

export type MisconceptionCategory =
  | 'arithmetic_error'
  | 'sign_error'
  | 'invalid_algebraic_transformation'
  | 'formula_misapplication'
  | 'conceptual_misunderstanding'
  | 'missing_prerequisite'
  | 'problem_misinterpretation'
  | 'execution_mistake'
  | 'unclear_response';

export interface MisconceptionDiagnosis {
  category: MisconceptionCategory;
  description: string;
  observedMistake: string;
  underlyingMisconception: string;
  targetedQuestion: string;
  diagnosticExample?: string;
  remedialAdvice: string;
  relatedConceptId?: string;
}

export interface VisualizationConfig {
  type: 'none' | 'equation_balance' | 'function_graph' | 'calculus_tangent' | 'riemann_sum';
  title?: string;
  initialEquation?: {
    left: string;
    right: string;
    variable: string;
  };
  functionConfig?: {
    expression: string;
    domain: [number, number];
    parameters?: Record<string, { min: number; max: number; default: number; step: number; label: string }>;
  };
}

export interface SolutionMethod {
  name: string;
  description: string;
  pros: string;
  cons: string;
  stepsSummary: string[];
}

export interface TutoringStep {
  stepId: string;
  sequenceNumber: number;
  title: string;
  explanation: string;
  latexExpression: string;
  whyValid: string;
  transformationPerformed?: string;
  question: string;
  expectedConceptId: string;
  expectedConceptName: string;
  hints: string[]; // 3 levels: conceptual nudge, specific direction, procedural hint
  revealedHintsCount: number;
  visualization?: VisualizationConfig;
  alternativeMethods?: SolutionMethod[];
  verificationStatus: 'verified' | 'unverified' | 'failed' | 'not_applicable';
  verificationDetails?: string;
  isCompleted: boolean;
}

export interface StudentResponseLog {
  id: string;
  stepId: string;
  responseContent: string;
  responseType: 'direct_answer' | 'understood' | 'explain_differently' | 'hint_request' | 'why_valid' | 'compare_methods';
  isCorrect?: boolean;
  evaluationFeedback: string;
  diagnosis?: MisconceptionDiagnosis;
  timestamp: string;
}

export interface TutoringSession {
  id: string;
  originalProblem: string;
  normalizedProblem: string;
  subject: SubjectArea;
  topic: string;
  difficulty: DifficultyLevel;
  state: 'analyzing' | 'teaching' | 'awaiting_response' | 'diagnosing' | 'completed' | 'error';
  steps: TutoringStep[];
  currentStepIndex: number;
  studentResponses: StudentResponseLog[];
  finalAnswer?: string;
  finalSummary?: string;
  commonMistakesSummary?: string[];
  followUpProblems?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  isSaved?: boolean;
}

export interface PracticeProblem {
  id: string;
  conceptId: string;
  conceptName: string;
  subject: SubjectArea;
  difficulty: DifficultyLevel;
  prompt: string;
  latexProblem: string;
  hints: string[];
  solutionExplanation: string;
  expectedAnswer: string;
  targetMisconception?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  tier: 'free' | 'plus' | 'pro';
  avatarSeed: string;
  createdAt: string;
  problemsSolved: number;
  conceptMasteryCount: number;
  streakDays: number;
  monthlyAiRequestsUsed: number;
  monthlyAiRequestsLimit: number;
}

export interface TelemetryMetric {
  id: string;
  timestamp: string;
  type: 'api_call' | 'step_completed' | 'hint_used' | 'misconception_logged' | 'practice_attempt';
  durationMs: number;
  success: boolean;
  modelUsed?: string;
  error?: string;
}
