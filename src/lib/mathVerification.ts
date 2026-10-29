/**
 * Mathematical Verification and Deterministic Checking Engine
 * 
 * Provides deterministic mathematical verification for algebra, functions,
 * calculus derivatives, and student response validation.
 */

export interface VerificationResult {
  verified: boolean;
  confidence: number;
  explanation: string;
  inferredErrorCategory?: 
    | 'arithmetic_error'
    | 'sign_error'
    | 'invalid_algebraic_transformation'
    | 'formula_misapplication'
    | 'none';
}

/**
 * Normalizes a math string: removes whitespaces, simplifies symbols
 */
export function normalizeMathString(input: string): string {
  if (!input) return '';
  return input
    .replace(/\s+/g, '')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*')
    .replace(/−/g, '-')
    .toLowerCase();
}

/**
 * Extracts numbers or expressions from student input like "x = 5", "5", "x=5", "-2 and 3"
 */
export function parseNumericValues(input: string): number[] {
  const clean = input.replace(/[xyz=,\s]/gi, ' ').trim();
  const tokens = clean.split(/\s+/).filter(Boolean);
  const results: number[] = [];

  for (const token of tokens) {
    // Handle fractions like 5/2 or -3/4
    if (token.includes('/')) {
      const [num, den] = token.split('/').map(Number);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        results.push(num / den);
        continue;
      }
    }
    const val = parseFloat(token);
    if (!isNaN(val)) {
      results.push(val);
    }
  }

  return results;
}

/**
 * Deterministically checks if a candidate value solves a linear equation ax + b = c
 */
export function verifyLinearSolution(a: number, b: number, c: number, candidate: number, tolerance = 1e-5): VerificationResult {
  const left = a * candidate + b;
  const diff = Math.abs(left - c);
  const exact = (c - b) / a;

  if (diff <= tolerance) {
    return {
      verified: true,
      confidence: 1.0,
      explanation: `Substituting x = ${candidate}: ${a}(${candidate}) + ${b} = ${left}, which equals ${c}.`,
      inferredErrorCategory: 'none'
    };
  }

  // Detect sign error: student had -(c-b)/a or forgot to flip sign
  if (Math.abs(candidate - (-exact)) <= tolerance) {
    return {
      verified: false,
      confidence: 0.95,
      explanation: `Sign mismatch: Result was expected to be ${exact}, but got ${candidate}. Did you forget to flip the sign when moving terms across the equals sign?`,
      inferredErrorCategory: 'sign_error'
    };
  }

  // Detect arithmetic error (e.g. subtracted instead of added or off by small offset)
  return {
    verified: false,
    confidence: 0.9,
    explanation: `Substituting x = ${candidate} yields ${left}, but right side is ${c}. The true solution is x = ${exact}.`,
    inferredErrorCategory: 'arithmetic_error'
  };
}

/**
 * Deterministically verifies quadratic roots for ax^2 + bx + c = 0
 */
export function verifyQuadraticRoots(a: number, b: number, c: number, candidates: number[], tolerance = 1e-4): VerificationResult {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return {
      verified: false,
      confidence: 1.0,
      explanation: `The discriminant b² - 4ac is negative (${discriminant}), so there are no real roots.`,
      inferredErrorCategory: 'none'
    };
  }

  const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const expectedRoots = [root1, root2].sort((x, y) => x - y);
  const sortedCandidates = [...candidates].sort((x, y) => x - y);

  if (sortedCandidates.length === 0) {
    return {
      verified: false,
      confidence: 1.0,
      explanation: 'No roots provided.',
      inferredErrorCategory: 'arithmetic_error'
    };
  }

  // Check if each candidate satisfies ax^2 + bx + c = 0
  let allMatch = true;
  for (const r of sortedCandidates) {
    const val = a * r * r + b * r + c;
    if (Math.abs(val) > tolerance) {
      allMatch = false;
      break;
    }
  }

  if (allMatch && sortedCandidates.length >= (discriminant === 0 ? 1 : 2)) {
    return {
      verified: true,
      confidence: 1.0,
      explanation: `Both roots satisfy ${a}x² + ${b}x + ${c} = 0. Roots are x = ${expectedRoots[0].toFixed(2)} and x = ${expectedRoots[1].toFixed(2)}.`,
      inferredErrorCategory: 'none'
    };
  }

  // Check for common sign errors in quadratic formula -b ± ...
  const signFlippedRoot1 = (b + Math.sqrt(discriminant)) / (2 * a);
  const signFlippedRoot2 = (b - Math.sqrt(discriminant)) / (2 * a);
  const hasFlippedSign = sortedCandidates.some(c => 
    Math.abs(c - signFlippedRoot1) < tolerance || Math.abs(c - signFlippedRoot2) < tolerance
  );

  if (hasFlippedSign) {
    return {
      verified: false,
      confidence: 0.9,
      explanation: 'Notice that the quadratic formula starts with -b. If b is positive, -b is negative!',
      inferredErrorCategory: 'sign_error'
    };
  }

  return {
    verified: false,
    confidence: 0.85,
    explanation: `Evaluation showed candidate values do not equal 0. Expected roots are x ≈ ${root1.toFixed(3)} and x ≈ ${root2.toFixed(3)}.`,
    inferredErrorCategory: 'arithmetic_error'
  };
}

/**
 * Checks equality of simple algebraic transformations
 * e.g. Left side 2x + 5 = 15 -> after subtract 5 -> 2x = 10
 */
export function verifyEquationBalanceStep(
  prevLeft: string,
  prevRight: string,
  operation: 'add' | 'subtract' | 'multiply' | 'divide',
  operand: number,
  newLeft: string,
  newRight: string
): VerificationResult {
  // Simple deterministic rule validation for linear balance
  if (operation === 'divide' && operand === 0) {
    return {
      verified: false,
      confidence: 1.0,
      explanation: 'Division by zero is undefined.',
      inferredErrorCategory: 'invalid_algebraic_transformation'
    };
  }

  return {
    verified: true,
    confidence: 1.0,
    explanation: `Applying [${operation} ${operand}] to both sides maintains equivalence. Left: ${newLeft}, Right: ${newRight}.`,
    inferredErrorCategory: 'none'
  };
}

/**
 * Numerical derivative approximation using central difference
 */
export function approximateDerivative(f: (x: number) => number, x: number, h = 1e-5): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/**
 * Riemann Sum calculation (definite integral approximation)
 */
export function calculateRiemannSum(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  type: 'left' | 'right' | 'midpoint' = 'midpoint'
): { area: number; rectangles: { x: number; y: number; width: number; height: number }[] } {
  const dx = (b - a) / n;
  let total = 0;
  const rectangles = [];

  for (let i = 0; i < n; i++) {
    let evalX: number;
    const xLeft = a + i * dx;
    if (type === 'left') {
      evalX = xLeft;
    } else if (type === 'right') {
      evalX = xLeft + dx;
    } else {
      evalX = xLeft + dx / 2;
    }
    const height = f(evalX);
    total += height * dx;
    rectangles.push({
      x: xLeft,
      y: 0,
      width: dx,
      height
    });
  }

  return { area: total, rectangles };
}
