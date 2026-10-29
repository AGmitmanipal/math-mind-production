import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  showRawOnError?: boolean;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  showRawOnError = true
}) => {
  const renderedHtml = useMemo(() => {
    if (!math) return '';

    // If explicit delimiters are not present and block is requested, treat the entire string as LaTeX
    const isDirectLatex = !math.includes('$') && !math.includes('\\(') && !math.includes('\\[');

    if (isDirectLatex) {
      try {
        return katex.renderToString(math, {
          displayMode: block,
          throwOnError: false,
          output: 'html'
        });
      } catch (err) {
        console.warn('KaTeX rendering error:', err);
        return showRawOnError ? `<span class="font-mono text-amber-300">${escapeHtml(math)}</span>` : '';
      }
    }

    // Otherwise, parse mixed text with inline $...$ and display $$...$$ delimiters
    let text = math;
    
    // First replace display math $$...$$
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, equation) => {
      try {
        return katex.renderToString(equation.trim(), {
          displayMode: true,
          throwOnError: false,
          output: 'html'
        });
      } catch (e) {
        return `<span class="font-mono text-amber-300">$$${escapeHtml(equation)}$$</span>`;
      }
    });

    // Next replace inline math $...$
    text = text.replace(/\$([^\$\n]+?)\$/g, (_, equation) => {
      try {
        return katex.renderToString(equation.trim(), {
          displayMode: false,
          throwOnError: false,
          output: 'html'
        });
      } catch (e) {
        return `<span class="font-mono text-amber-300">$${escapeHtml(equation)}$</span>`;
      }
    });

    // Replace LaTeX bracket syntax \[ ... \]
    text = text.replace(/\\\[([\s\S]+?)\\\]/g, (_, equation) => {
      try {
        return katex.renderToString(equation.trim(), {
          displayMode: true,
          throwOnError: false,
          output: 'html'
        });
      } catch (e) {
        return `<span class="font-mono text-amber-300">\\[${escapeHtml(equation)}\\]</span>`;
      }
    });

    // Replace LaTeX parenthesized syntax \( ... \)
    text = text.replace(/\\\(([\s\S]+?)\\\)/g, (_, equation) => {
      try {
        return katex.renderToString(equation.trim(), {
          displayMode: false,
          throwOnError: false,
          output: 'html'
        });
      } catch (e) {
        return `<span class="font-mono text-amber-300">\\(${escapeHtml(equation)}\\)</span>`;
      }
    });

    return text;
  }, [math, block, showRawOnError]);

  return (
    <span
      className={`math-view inline-block ${block ? 'block w-full my-2' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

function escapeHtml(string: string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default MathView;
