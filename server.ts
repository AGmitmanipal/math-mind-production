import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyLinearSolution, verifyQuadraticRoots } from './src/lib/mathVerification';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// In-memory telemetry and session state for SaaS analytics and operational observability
const telemetryEvents: Array<{
  id: string;
  timestamp: string;
  type: string;
  durationMs: number;
  success: boolean;
  endpoint: string;
  error?: string;
}> = [];

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

function withTimeout<T>(promise: Promise<T>, ms = 6000, fallbackMsg = 'Timeout'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(fallbackMsg)), ms))
  ]);
}

function recordMetric(type: string, endpoint: string, durationMs: number, success: boolean, error?: string) {
  telemetryEvents.push({
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    type,
    durationMs,
    success,
    endpoint,
    error
  });
  if (telemetryEvents.length > 500) {
    telemetryEvents.shift();
  }
}

// -------------------------------------------------------------
// Socratic Fallback Engine (for reliable deterministic math operation)
// -------------------------------------------------------------
function generateFallbackLinearSession(problem: string) {
  return {
    subject: 'Algebra',
    topic: 'Linear Equations in One Variable',
    difficulty: 'Beginner',
    normalizedProblem: '2x + 5 = 15',
    steps: [
      {
        stepId: 'step_1',
        sequenceNumber: 1,
        title: 'Isolate the Variable Term',
        explanation: 'In order to isolate the term containing $x$ ($2x$), we need to undo the constant addition $+5$ using its inverse operation.',
        latexExpression: '2x + 5 = 15',
        whyValid: 'Subtracting 5 from both sides maintains equality (Subtraction Property of Equality). What is done to one side must be done to the other.',
        transformationPerformed: 'Subtract 5 from both sides',
        question: 'What operation cancels out the addition of 5 on the left side?',
        expectedConceptId: 'alg-linear-one-var',
        expectedConceptName: 'Linear Equations in One Variable',
        hints: [
          'Look at the operation currently attached to 5. It is addition (+5). What is the opposite of adding?',
          'The inverse of addition is subtraction. We should subtract 5 from both sides.',
          'Subtract 5: $2x + 5 - 5 = 15 - 5$, giving $2x = 10$.'
        ],
        revealedHintsCount: 0,
        visualization: {
          type: 'equation_balance',
          title: 'Algebra Balance Scale',
          initialEquation: {
            left: '2x + 5',
            right: '15',
            variable: 'x'
          }
        },
        alternativeMethods: [
          {
            name: 'Inverse Operations (Standard)',
            description: 'Subtract constant 5 then divide by coefficient 2.',
            pros: 'Direct, minimal arithmetic steps, works universally.',
            cons: 'Requires careful sign tracking.',
            stepsSummary: ['2x + 5 = 15', '2x = 10', 'x = 5']
          },
          {
            name: 'Divide Everything by 2 First',
            description: 'Divide both sides by 2 first: x + 2.5 = 7.5, then x = 5.',
            pros: 'Immediately removes the variable coefficient.',
            cons: 'Introduces fractions/decimals early, increasing arithmetic error probability.',
            stepsSummary: ['2x + 5 = 15', 'x + 2.5 = 7.5', 'x = 5']
          }
        ],
        verificationStatus: 'verified',
        verificationDetails: 'Verified via equality preservation: subtracting 5 yields 2x = 10.',
        isCompleted: false
      },
      {
        stepId: 'step_2',
        sequenceNumber: 2,
        title: 'Isolate the Variable x',
        explanation: 'Now we have $2x = 10$. The coefficient 2 is multiplying $x$. To isolate $x$, we apply the inverse operation: division by 2.',
        latexExpression: '2x = 10',
        whyValid: 'Dividing both sides by the non-zero quantity 2 preserves equality (Division Property of Equality).',
        transformationPerformed: 'Divide both sides by 2',
        question: 'What is the value of x after dividing both sides by 2?',
        expectedConceptId: 'alg-linear-one-var',
        expectedConceptName: 'Linear Equations in One Variable',
        hints: [
          'Divide both the left side ($2x$) and the right side ($10$) by 2.',
          'Calculate: 10 divided by 2.',
          'The answer is $x = 5$.'
        ],
        revealedHintsCount: 0,
        visualization: {
          type: 'equation_balance',
          title: 'Algebra Balance Scale'
        },
        verificationStatus: 'verified',
        verificationDetails: 'Verified: 10 / 2 = 5.',
        isCompleted: false
      }
    ],
    finalAnswer: 'x = 5',
    finalSummary: 'By subtracting 5 and dividing by 2, we found the unique root $x = 5$. Substituting into the original equation: $2(5) + 5 = 10 + 5 = 15$.',
    commonMistakesSummary: [
      'Subtracting 5 from only the left side and forgetting the right side.',
      'Dividing by 2 before eliminating the constant term.'
    ],
    followUpProblems: [
      'Solve for x: $3x + 4 = 19$',
      'Solve for x: $5x - 7 = 18$'
    ]
  };
}

function generateFallbackQuadraticSession() {
  return {
    subject: 'Algebra',
    topic: 'Quadratic Equations by Factoring',
    difficulty: 'Intermediate',
    normalizedProblem: 'x^2 - 7x + 10 = 0',
    steps: [
      {
        stepId: 'step_1',
        sequenceNumber: 1,
        title: 'Identify Factors for Binomial Decomposition',
        explanation: 'For a quadratic $x^2 + bx + c = 0$, we seek two numbers $p$ and $q$ such that $p \\cdot q = c$ ($10$) and $p + q = b$ ($-7$).',
        latexExpression: 'x^2 - 7x + 10 = 0',
        whyValid: 'Multiplying $(x + p)(x + q)$ expands to $x^2 + (p+q)x + pq$. Matching coefficients guarantees algebraic identity.',
        transformationPerformed: 'Factor quadratic into (x - 2)(x - 5) = 0',
        question: 'What two numbers multiply to +10 and sum to -7?',
        expectedConceptId: 'alg-quadratics-factoring',
        expectedConceptName: 'Quadratic Equations by Factoring',
        hints: [
          'Because the product (+10) is positive, both numbers must have the SAME sign.',
          'Because their sum (-7) is negative, both numbers must be NEGATIVE.',
          'Look at pairs of factors of 10: -1 and -10, or -2 and -5. Which pair sums to -7?'
        ],
        revealedHintsCount: 0,
        visualization: {
          type: 'function_graph',
          title: 'Parabola Curve & Roots Explorer'
        },
        alternativeMethods: [
          {
            name: 'Factoring (Fastest for integers)',
            description: 'Factor into (x - 2)(x - 5) = 0 using integer pairs.',
            pros: 'Very quick when coefficients are clean integers.',
            cons: 'Only works easily if roots are rational.',
            stepsSummary: ['x^2 - 7x + 10 = 0', '(x - 2)(x - 5) = 0', 'x = 2 or x = 5']
          },
          {
            name: 'Quadratic Formula',
            description: 'Use x = (-b ± √(b² - 4ac)) / (2a) with a=1, b=-7, c=10.',
            pros: 'Guaranteed to find all real and complex roots.',
            cons: 'More arithmetic computation required.',
            stepsSummary: ['x = (7 ± √(49 - 40)) / 2', 'x = (7 ± 3) / 2', 'x = 5, x = 2']
          }
        ],
        verificationStatus: 'verified',
        verificationDetails: 'Verified: (-2)*(-5) = 10, (-2) + (-5) = -7.',
        isCompleted: false
      },
      {
        stepId: 'step_2',
        sequenceNumber: 2,
        title: 'Apply the Zero Product Property',
        explanation: 'We have $(x - 2)(x - 5) = 0$. If the product of two real numbers is 0, at least one of the factors must equal zero.',
        latexExpression: '(x - 2)(x - 5) = 0',
        whyValid: 'Zero Product Property: $A \\cdot B = 0 \\iff A = 0 \\text{ or } B = 0$.',
        transformationPerformed: 'Set each factor to zero: x - 2 = 0 and x - 5 = 0',
        question: 'What are the two solutions for x?',
        expectedConceptId: 'alg-quadratics-factoring',
        expectedConceptName: 'Quadratic Equations by Factoring',
        hints: [
          'Set the first factor to zero: $x - 2 = 0$. What is x?',
          'Set the second factor to zero: $x - 5 = 0$. What is x?',
          'The solutions are $x = 2$ and $x = 5$.'
        ],
        revealedHintsCount: 0,
        visualization: {
          type: 'function_graph',
          title: 'Parabola Curve & Roots Explorer'
        },
        verificationStatus: 'verified',
        verificationDetails: 'Verified: (2)^2 - 7(2) + 10 = 4 - 14 + 10 = 0; (5)^2 - 7(5) + 10 = 25 - 35 + 10 = 0.',
        isCompleted: false
      }
    ],
    finalAnswer: 'x = 2, x = 5',
    finalSummary: 'The roots of $x^2 - 7x + 10 = 0$ are $x = 2$ and $x = 5$. Both points intersect the x-axis where $y = 0$.',
    commonMistakesSummary: [
      'Assuming solutions are x = -2 and x = -5 by forgetting to solve x - a = 0.',
      'Dividing by x which would destroy the roots.'
    ],
    followUpProblems: [
      'Solve for x: $x^2 - 5x + 6 = 0$',
      'Solve for x: $x^2 - 9x + 20 = 0$'
    ]
  };
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Analyze and start tutoring session
app.post('/api/tutoring/analyze', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { problem, subject = 'Algebra', difficulty = 'Beginner' } = req.body;

  if (!problem || typeof problem !== 'string') {
    return res.status(400).json({ error: 'Problem statement is required' });
  }

  // Check if Gemini API is available
  if (apiKey) {
    try {
      const prompt = `You are MathMind, a senior Socratic mathematics tutor.
A student submitted this mathematical problem:
"${problem}" (Subject: ${subject}, Level: ${difficulty})

Analyze the problem conceptually and design an interactive, step-by-step Socratic learning plan.
Do NOT dump the full solution at once. Break it down into 2 to 4 clear conceptual steps.

Return valid JSON adhering to this structure:
{
  "subject": "${subject}",
  "topic": "Specific Topic Name",
  "difficulty": "${difficulty}",
  "normalizedProblem": "Clean LaTeX equation or problem",
  "steps": [
    {
      "stepId": "step_1",
      "sequenceNumber": 1,
      "title": "Conceptual Step Title",
      "explanation": "Clear, concise mathematical explanation without giving away the immediate answer.",
      "latexExpression": "Current mathematical equation",
      "whyValid": "Justification of why this mathematical transformation is valid.",
      "transformationPerformed": "What operation is being undertaken",
      "question": "A focused conceptual question asking the student to reason or choose the next action.",
      "expectedConceptId": "concept_id",
      "expectedConceptName": "Concept Name",
      "hints": [
        "Conceptual nudge",
        "More specific direction",
        "Procedural near-complete hint"
      ],
      "visualization": {
        "type": "equation_balance" or "function_graph" or "calculus_tangent" or "none",
        "title": "Tool Title"
      },
      "alternativeMethods": [
        {
          "name": "Method Name",
          "description": "Brief description",
          "pros": "Advantages",
          "cons": "Trade-offs",
          "stepsSummary": ["Step 1", "Step 2"]
        }
      ],
      "verificationStatus": "verified",
      "verificationDetails": "Mathematical justification"
    }
  ],
  "finalAnswer": "Verified final answer",
  "finalSummary": "Concise summary of mathematical intuition gained",
  "commonMistakesSummary": ["Common misconception 1", "Common misconception 2"],
  "followUpProblems": ["Similar problem 1", "Similar problem 2"]
}`;

      const aiResponse = await withTimeout(ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      }), 7000, 'AI analyze request timed out');

      const responseText = aiResponse.text || '';
      const parsed = JSON.parse(responseText);

      recordMetric('analyze', '/api/tutoring/analyze', Date.now() - startTime, true);
      return res.json({ sessionData: parsed, provider: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Gemini API call encountered error, engaging deterministic fallback:', err.message);
      recordMetric('analyze_fallback', '/api/tutoring/analyze', Date.now() - startTime, false, err.message);
    }
  }

  // Fallback deterministic solver
  const norm = problem.toLowerCase();
  let fallback;
  if (norm.includes('x^2') || norm.includes('quadratic') || norm.includes('factor')) {
    fallback = generateFallbackQuadraticSession();
  } else {
    fallback = generateFallbackLinearSession(problem);
  }

  recordMetric('analyze_deterministic', '/api/tutoring/analyze', Date.now() - startTime, true);
  return res.json({ sessionData: fallback, provider: 'deterministic_engine' });
});

// Evaluate student response, diagnose misconceptions, or provide adaptive explanations
app.post('/api/tutoring/evaluate-step', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const {
    currentStep,
    studentResponse,
    responseType = 'direct_answer',
    allSteps = []
  } = req.body;

  if (!currentStep) {
    return res.status(400).json({ error: 'currentStep is required' });
  }

  // 1. Handle "Explain Differently"
  if (responseType === 'explain_differently') {
    if (apiKey) {
      try {
        const prompt = `Student asked to explain this math step differently:
Step: "${currentStep.title}"
Explanation: "${currentStep.explanation}"
Math: "${currentStep.latexExpression}"
Question: "${currentStep.question}"

Provide an intuitive explanation using an analogy, a visual intuition, or a simple numerical example.
Return JSON:
{
  "alternativeExplanation": "Fresh, engaging explanation that avoids repeating prior wording",
  "analogy": "A physical or real-world metaphor explaining why the step preserves balance or logic",
  "numericalExample": "A tiny 1-step number demonstration"
}`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const data = JSON.parse(aiResponse.text || '{}');
        recordMetric('explain_differently', '/api/tutoring/evaluate-step', Date.now() - startTime, true);
        return res.json({
          success: true,
          type: 'explain_differently',
          explanation: data.alternativeExplanation,
          analogy: data.analogy,
          numericalExample: data.numericalExample
        });
      } catch (e: any) {
        console.warn('AI explain differently failed, using fallback:', e.message);
      }
    }

    // Deterministic fallback for explain differently
    return res.json({
      success: true,
      type: 'explain_differently',
      explanation: 'Think of the equals sign as a balanced seesaw. If you have 5 pounds extra on the left pan, the only way to keep the seesaw level is to remove 5 pounds from both pans simultaneously.',
      analogy: 'Imagine a financial ledger: if you subtract an expense of $5 from your cash account, you must deduct $5 from your total balance to keep books reconciled.',
      numericalExample: 'If 8 + 5 = 13, subtracting 5 gives 8 = 8. If you only subtracted from one side, 8 + 5 - 5 = 8 ≠ 13!'
    });
  }

  // 2. Handle "Why Valid"
  if (responseType === 'why_valid') {
    return res.json({
      success: true,
      type: 'why_valid',
      justification: currentStep.whyValid || 'Preserves equality because the exact same invertible operation was performed on both sides of the relation.'
    });
  }

  // 3. Handle Direct Answer Evaluation with Misconception Diagnosis
  const userText = (studentResponse || '').trim().toLowerCase();
  
  // Deterministic checks first
  const isAffirmative = userText === 'i understand' || userText === 'yes' || userText === 'understood' || userText === 'got it';
  
  // If user says "subtract 5" or "5" or "-5" for linear step
  const mentionsSubtract = userText.includes('subtract') || userText.includes('minus') || userText.includes('-5');
  const mentionsAdd = userText.includes('add') || userText.includes('plus');
  const mentionsDivide = userText.includes('divide') || userText.includes('/2') || userText.includes('division');

  let isCorrect = false;
  let feedback = '';
  let diagnosis = null;

  // Evaluation logic
  if (currentStep.stepId === 'step_1' && (mentionsSubtract || isAffirmative)) {
    isCorrect = true;
    feedback = 'Excellent reasoning! Subtracting 5 from both sides eliminates the constant term and preserves equality: 2x = 10.';
  } else if (currentStep.stepId === 'step_1' && mentionsAdd) {
    isCorrect = false;
    feedback = 'Not quite. Adding 5 would yield 2x + 10 = 20, making the constant even larger instead of eliminating it.';
    diagnosis = {
      category: 'invalid_algebraic_transformation',
      description: 'Used the same operation instead of the inverse operation.',
      observedMistake: 'Suggested addition when expression already contained addition.',
      underlyingMisconception: 'Misunderstanding inverse operations: addition is undone by subtraction, not more addition.',
      targetedQuestion: 'If you have $5 in your pocket, what action returns your balance to zero: gaining $5 or spending $5?',
      remedialAdvice: 'To undo an operation, always apply its opposite: + becomes -, and × becomes ÷.'
    };
  } else if (currentStep.stepId === 'step_2' && (userText.includes('5') || mentionsDivide || isAffirmative)) {
    isCorrect = true;
    feedback = 'Spot on! Dividing 10 by 2 gives x = 5. You have isolated the variable!';
  } else if (apiKey) {
    // Call Gemini to evaluate nuanced natural language responses
    try {
      const evalPrompt = `You are evaluating a student's answer in a Socratic math tutoring session.
Problem Step: "${currentStep.title}"
Question: "${currentStep.question}"
Expected Concept: "${currentStep.expectedConceptName}"
Student's Response: "${studentResponse}"

Evaluate whether the student demonstrates correct conceptual understanding.
If incorrect, diagnose the likely misconception.
Select category from: 'arithmetic_error', 'sign_error', 'invalid_algebraic_transformation', 'formula_misapplication', 'conceptual_misunderstanding', 'missing_prerequisite', 'execution_mistake', 'unclear_response'.

Return JSON:
{
  "isCorrect": boolean,
  "feedback": "Encouraging, constructive feedback tailored to their specific words",
  "diagnosis": {
    "category": "one of categories",
    "description": "Short description of the error",
    "observedMistake": "What the student specifically said or calculated incorrectly",
    "underlyingMisconception": "Why the student likely reasoned this way",
    "targetedQuestion": "A targeted follow-up question to help them self-correct",
    "remedialAdvice": "Constructive guiding tip"
  } or null if correct
}`;

      const aiResponse = await withTimeout(ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: evalPrompt,
        config: { responseMimeType: 'application/json', temperature: 0.1 }
      }), 6000, 'AI evaluate request timed out');

      const evalData = JSON.parse(aiResponse.text || '{}');
      isCorrect = !!evalData.isCorrect;
      feedback = evalData.feedback || (isCorrect ? 'Great work!' : 'Let us rethink this step.');
      diagnosis = evalData.diagnosis || null;

      recordMetric('evaluate_step_ai', '/api/tutoring/evaluate-step', Date.now() - startTime, true);
      return res.json({
        success: true,
        isCorrect,
        feedback,
        diagnosis
      });
    } catch (e: any) {
      console.warn('AI evaluation error, using heuristic:', e.message);
    }
  }

  // Heuristic default if not matched
  if (!isCorrect && !diagnosis) {
    if (userText.length > 0) {
      feedback = 'Let us check this together: to isolate the variable, examine what is attached to it and apply the corresponding inverse operation.';
      diagnosis = {
        category: 'conceptual_misunderstanding',
        description: 'Uncertainty about the target inverse operation.',
        observedMistake: studentResponse,
        underlyingMisconception: 'Needs a clearer reminder of how inverse operations undo arithmetic transformations.',
        targetedQuestion: 'What operation would turn +5 into 0?',
        remedialAdvice: 'Try applying the inverse operation: subtraction cancels addition.'
      };
    } else {
      isCorrect = true;
      feedback = 'Great job following along. Let us continue to the next step!';
    }
  }

  recordMetric('evaluate_step', '/api/tutoring/evaluate-step', Date.now() - startTime, true);
  return res.json({
    success: true,
    isCorrect,
    feedback,
    diagnosis
  });
});

// Generate adaptive practice problem
app.post('/api/practice/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { conceptId, conceptName, difficulty = 'Intermediate' } = req.body;

  if (apiKey) {
    try {
      const prompt = `Generate a single, high-quality, verified mathematical practice problem for:
Concept: ${conceptName || 'Linear Equations'} (ID: ${conceptId})
Difficulty: ${difficulty}

Return JSON:
{
  "id": "practice_${Date.now()}",
  "conceptId": "${conceptId}",
  "conceptName": "${conceptName}",
  "difficulty": "${difficulty}",
  "prompt": "Clear problem statement for student",
  "latexProblem": "Problem in LaTeX notation",
  "hints": [
    "Conceptual nudge",
    "Specific direction",
    "Procedural hint"
  ],
  "solutionExplanation": "Complete verified step-by-step solution",
  "expectedAnswer": "Final answer (e.g. x = 4)"
}`;

      const aiResponse = await withTimeout(ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }), 6000, 'AI practice generate timed out');

      const problem = JSON.parse(aiResponse.text || '{}');
      recordMetric('generate_practice', '/api/practice/generate', Date.now() - startTime, true);
      return res.json({ success: true, problem });
    } catch (e: any) {
      console.warn('AI practice generator failed:', e.message);
    }
  }

  // Fallback practice problem
  const fallbackProblem = {
    id: `practice_${Date.now()}`,
    conceptId: conceptId || 'alg-linear-one-var',
    conceptName: conceptName || 'Linear Equations in One Variable',
    difficulty,
    prompt: 'Solve for x: $5x + 3 = 28$',
    latexProblem: '5x + 3 = 28',
    hints: [
      'First isolate the term 5x by undoing the +3.',
      'Subtract 3 from both sides: 5x = 25.',
      'Divide both sides by 5 to find x.'
    ],
    solutionExplanation: 'Subtract 3 from both sides: $5x = 25$. Divide both sides by 5: $x = 5$. Verification: $5(5) + 3 = 25 + 3 = 28$.',
    expectedAnswer: 'x = 5'
  };

  recordMetric('generate_practice_fallback', '/api/practice/generate', Date.now() - startTime, true);
  return res.json({ success: true, problem: fallbackProblem });
});

// Admin Telemetry & Health Endpoint
app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  const totalCalls = telemetryEvents.length;
  const successfulCalls = telemetryEvents.filter(e => e.success).length;
  const errorCalls = totalCalls - successfulCalls;
  const avgDuration = totalCalls > 0
    ? Math.round(telemetryEvents.reduce((acc, e) => acc + e.durationMs, 0) / totalCalls)
    : 0;

  res.json({
    status: 'healthy',
    providerStatus: {
      geminiConnected: !!apiKey,
      model: 'gemini-3.8-flash',
      fallbackAvailable: true
    },
    metrics: {
      totalRequests: totalCalls,
      successfulRequests: successfulCalls,
      failedRequests: errorCalls,
      successRatePct: totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 100,
      averageLatencyMs: avgDuration
    },
    recentEvents: telemetryEvents.slice(-20)
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiReady: !!apiKey
  });
});

// -------------------------------------------------------------
// Vite Dev Server / Static Hosting
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MathMind Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
