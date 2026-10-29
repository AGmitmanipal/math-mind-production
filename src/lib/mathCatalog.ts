import { ConceptDefinition, PracticeProblem, SubjectArea } from '../types/math';

export const MATH_CONCEPTS: ConceptDefinition[] = [
  // ALGEBRA
  {
    id: 'alg-arithmetic-integers',
    slug: 'arithmetic-integers',
    name: 'Integer Arithmetic & Signs',
    subject: 'Algebra',
    difficulty: 'Beginner',
    description: 'Mastery of addition, subtraction, multiplication, and division with negative and positive numbers.',
    prerequisites: [],
    commonMisconceptions: [
      'Assuming two negatives always make a positive, even in addition (-3 - 5 = +8)',
      'Forgetting that subtracting a negative is equivalent to adding a positive'
    ]
  },
  {
    id: 'alg-order-of-operations',
    slug: 'order-of-operations',
    name: 'Order of Operations (PEMDAS)',
    subject: 'Algebra',
    difficulty: 'Beginner',
    description: 'Proper evaluation sequence: parentheses, exponents, multiplication/division left-to-right, addition/subtraction left-to-right.',
    prerequisites: ['alg-arithmetic-integers'],
    commonMisconceptions: [
      'Performing multiplication strictly before division regardless of left-to-right order',
      'Distributing exponents across addition: (a + b)^2 = a^2 + b^2'
    ]
  },
  {
    id: 'alg-linear-one-var',
    slug: 'linear-equations-one-variable',
    name: 'Linear Equations in One Variable',
    subject: 'Algebra',
    difficulty: 'Beginner',
    description: 'Isolating variables using inverse operations while maintaining balance on both sides of the equation.',
    prerequisites: ['alg-arithmetic-integers', 'alg-order-of-operations'],
    commonMisconceptions: [
      'Performing an operation on only one side of the equals sign',
      'Flipping or neglecting signs when transposing terms across equality',
      'Dividing only part of an expression when isolating a coefficient'
    ]
  },
  {
    id: 'alg-systems-linear',
    slug: 'systems-of-linear-equations',
    name: 'Systems of Linear Equations',
    subject: 'Algebra',
    difficulty: 'Intermediate',
    description: 'Finding simultaneous solutions for multi-variable systems via substitution, elimination, and graphing.',
    prerequisites: ['alg-linear-one-var'],
    commonMisconceptions: [
      'Substituting an isolated variable back into the exact same equation rather than the other',
      'Forgetting to multiply all terms in an equation when scaling for elimination'
    ]
  },
  {
    id: 'alg-quadratics-factoring',
    slug: 'quadratic-equations-factoring',
    name: 'Quadratic Equations by Factoring',
    subject: 'Algebra',
    difficulty: 'Intermediate',
    description: 'Finding roots of ax^2 + bx + c = 0 by factoring into binomials using the Zero Product Property.',
    prerequisites: ['alg-linear-one-var'],
    commonMisconceptions: [
      'Dividing both sides by x and losing the root x = 0',
      'Applying Zero Product Property when the right-hand side is not equal to 0 (e.g., (x-2)(x-3) = 6)'
    ]
  },
  {
    id: 'alg-quadratic-formula',
    slug: 'quadratic-formula-discriminant',
    name: 'Quadratic Formula & Discriminant',
    subject: 'Algebra',
    difficulty: 'Intermediate',
    description: 'Applying x = (-b ± √(b² - 4ac)) / (2a) and interpreting the discriminant for real and complex roots.',
    prerequisites: ['alg-quadratics-factoring'],
    commonMisconceptions: [
      'Writing -b as just b when b is already negative',
      'Dividing only the square root portion by 2a instead of the whole numerator',
      'Calculating -4ac with incorrect negative signs'
    ]
  },

  // FUNCTIONS
  {
    id: 'func-definition-notation',
    slug: 'functions-domain-range',
    name: 'Function Concept, Domain & Range',
    subject: 'Functions',
    difficulty: 'Beginner',
    description: 'Understanding inputs and outputs: every domain input produces exactly one codomain output (vertical line test).',
    prerequisites: ['alg-linear-one-var'],
    commonMisconceptions: [
      'Confusing f(x) with multiplication of f and x',
      'Overlooking domain restrictions like division by zero or negative radicands'
    ]
  },
  {
    id: 'func-transformations',
    slug: 'transformations-of-functions',
    name: 'Transformations of Functions',
    subject: 'Functions',
    difficulty: 'Intermediate',
    description: 'Analyzing horizontal and vertical shifts, reflections, and scalings: f(x - h) + k.',
    prerequisites: ['func-definition-notation'],
    commonMisconceptions: [
      'Assuming f(x - h) shifts to the left because of the negative sign (it shifts right)',
      'Mixing up vertical scaling a·f(x) with horizontal scaling f(a·x)'
    ]
  },

  // CALCULUS
  {
    id: 'calc-limits-continuity',
    slug: 'limits-and-continuity',
    name: 'Limits & Continuity',
    subject: 'Calculus',
    difficulty: 'Intermediate',
    description: 'Understanding behavior as x approaches a value c, one-sided limits, and removable vs jump discontinuities.',
    prerequisites: ['func-definition-notation'],
    commonMisconceptions: [
      'Equating lim_{x->c} f(x) with f(c) without verifying continuity',
      'Treating 0/0 as undefined or 0 rather than an indeterminate form requiring simplification or L\'Hopital'
    ]
  },
  {
    id: 'calc-derivative-definition',
    slug: 'derivative-as-rate-of-change',
    name: 'The Derivative as Tangent & Instantaneous Rate',
    subject: 'Calculus',
    difficulty: 'Advanced',
    description: 'The limit of difference quotients: lim_{h->0} [f(x+h) - f(x)] / h as secant lines approach the tangent line.',
    prerequisites: ['calc-limits-continuity'],
    commonMisconceptions: [
      'Confusing the average rate of change (secant line slope) with instantaneous rate of change (tangent slope)',
      'Thinking a function is differentiable wherever it is continuous (forgetting cusps and vertical tangents)'
    ]
  },
  {
    id: 'calc-power-rule',
    slug: 'power-rule-differentiation',
    name: 'Power Rule & Basic Differentiation',
    subject: 'Calculus',
    difficulty: 'Intermediate',
    description: 'Differentiating algebraic terms: d/dx(x^n) = n·x^(n-1), sum rule, and constant multiple rule.',
    prerequisites: ['calc-derivative-definition'],
    commonMisconceptions: [
      'Forgetting that the derivative of a constant term is 0, not the constant itself',
      'Misapplying power rule to exponential functions like d/dx(2^x) = x·2^(x-1)'
    ]
  },
  {
    id: 'calc-riemann-integrals',
    slug: 'definite-integrals-riemann-sums',
    name: 'Definite Integrals & Riemann Sums',
    subject: 'Calculus',
    difficulty: 'Advanced',
    description: 'Accumulation of area under curve via limits of rectangular partitions and the Fundamental Theorem of Calculus.',
    prerequisites: ['calc-derivative-definition'],
    commonMisconceptions: [
      'Viewing integrals merely as antiderivative formulas rather than net signed accumulation of area',
      'Confusing net area with total physical area when functions cross below the x-axis'
    ]
  }
];

export const CURATED_PRACTICE_BANK: PracticeProblem[] = [
  {
    id: 'practice-lin-1',
    conceptId: 'alg-linear-one-var',
    conceptName: 'Linear Equations in One Variable',
    subject: 'Algebra',
    difficulty: 'Beginner',
    prompt: 'Solve for x: $3x + 7 = 22$',
    latexProblem: '3x + 7 = 22',
    hints: [
      'First, look at the constant term +7 on the left side. What inverse operation undoes addition?',
      'Subtract 7 from both sides: 3x = 22 - 7, so 3x = 15.',
      'Now divide both sides by the coefficient 3 to isolate x.'
    ],
    solutionExplanation: 'Subtract 7 from both sides to get $3x = 15$. Then divide both sides by 3 to find $x = 5$. Verification: $3(5) + 7 = 15 + 7 = 22$.',
    expectedAnswer: 'x = 5',
    targetMisconception: 'Forgetting to perform the subtraction on both sides'
  },
  {
    id: 'practice-lin-2',
    conceptId: 'alg-linear-one-var',
    conceptName: 'Linear Equations in One Variable',
    subject: 'Algebra',
    difficulty: 'Beginner',
    prompt: 'Solve for x: $4x - 9 = 15$',
    latexProblem: '4x - 9 = 15',
    hints: [
      'What operation cancels out the subtraction of 9?',
      'Add 9 to both sides: 4x = 15 + 9 = 24.',
      'Divide both sides by 4.'
    ],
    solutionExplanation: 'Add 9 to both sides to obtain $4x = 24$. Divide both sides by 4 to get $x = 6$. Verification: $4(6) - 9 = 24 - 9 = 15$.',
    expectedAnswer: 'x = 6',
    targetMisconception: 'Subtracting 9 instead of adding 9'
  },
  {
    id: 'practice-quad-1',
    conceptId: 'alg-quadratics-factoring',
    conceptName: 'Quadratic Equations by Factoring',
    subject: 'Algebra',
    difficulty: 'Intermediate',
    prompt: 'Solve for x by factoring: $x^2 - 5x + 6 = 0$',
    latexProblem: 'x^2 - 5x + 6 = 0',
    hints: [
      'Find two numbers that multiply to +6 and add up to -5.',
      'The factors are -2 and -3 because (-2) * (-3) = 6 and (-2) + (-3) = -5.',
      'Set each binomial to zero: (x - 2)(x - 3) = 0.'
    ],
    solutionExplanation: 'Factoring gives $(x - 2)(x - 3) = 0$. By the Zero Product Property, $x - 2 = 0 \\implies x = 2$, and $x - 3 = 0 \\implies x = 3$.',
    expectedAnswer: 'x = 2, x = 3',
    targetMisconception: 'Using positive 2 and 3 because the product is positive'
  },
  {
    id: 'practice-calc-1',
    conceptId: 'calc-power-rule',
    conceptName: 'Power Rule & Basic Differentiation',
    subject: 'Calculus',
    difficulty: 'Intermediate',
    prompt: 'Find the derivative $f\'(x)$ of $f(x) = 3x^4 - 5x^2 + 8$',
    latexProblem: 'f(x) = 3x^4 - 5x^2 + 8',
    hints: [
      'Apply the power rule $d/dx(x^n) = n x^{n-1}$ term by term.',
      'For 3x^4: multiply by 4 and reduce exponent to 3. For -5x^2: multiply by 2 and reduce exponent to 1.',
      'Remember that the derivative of a constant like 8 is 0.'
    ],
    solutionExplanation: '$f\'(x) = 3(4x^3) - 5(2x^1) + 0 = 12x^3 - 10x$.',
    expectedAnswer: '12x^3 - 10x',
    targetMisconception: 'Leaving +8 or making it +8x instead of 0'
  }
];

export const STARTER_PROBLEMS = [
  {
    title: 'Linear Balance & Isolation',
    problem: '2x + 5 = 15',
    subject: 'Algebra' as SubjectArea,
    difficulty: 'Beginner' as const,
    description: 'Learn the balance metaphor: subtract constant, divide coefficient.'
  },
  {
    title: 'Quadratic Roots & Factoring',
    problem: 'x^2 - 7x + 10 = 0',
    subject: 'Algebra' as SubjectArea,
    difficulty: 'Intermediate' as const,
    description: 'Discover the Zero Product Property and binomial factoring.'
  },
  {
    title: 'Function Parabola & Vertex',
    problem: 'f(x) = x^2 - 4x + 3',
    subject: 'Functions' as SubjectArea,
    difficulty: 'Intermediate' as const,
    description: 'Analyze axis of symmetry, vertex coordinates, and roots.'
  },
  {
    title: 'Secant to Tangent Derivative',
    problem: 'Find the derivative of f(x) = x^2 at x = 2',
    subject: 'Calculus' as SubjectArea,
    difficulty: 'Advanced' as const,
    description: 'Visualize how the secant line approaches the tangent line slope.'
  }
];
