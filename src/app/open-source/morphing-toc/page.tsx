"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { MorphingToc } from "../../../../open-source/morphing-toc/src";

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 pr-12 overflow-x-auto text-sm">
        <code>{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

function PropsTable() {
  const props = [
    {
      name: "className",
      type: "string",
      default: '""',
      description: "Custom CSS class for the container",
    },
    {
      name: "scrollOffset",
      type: "number",
      default: "80",
      description: "Offset from top when scrolling (px)",
    },
    {
      name: "headingLevels",
      type: "number[]",
      default: "[2, 3, 4]",
      description: "Which heading levels to include",
    },
    {
      name: "skipFirstH1",
      type: "boolean",
      default: "true",
      description: "Skip the first h1 (page title)",
    },
    {
      name: "containerSelector",
      type: "string",
      default: "undefined",
      description: "CSS selector to scope heading search",
    },
    {
      name: "colors",
      type: "MorphingTocColors",
      default: "slate palette",
      description: "Custom color configuration",
    },
    {
      name: "sizes",
      type: "MorphingTocSizes",
      default: "default sizes",
      description: "Custom size configuration",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 pr-4 font-medium text-slate-900">
              Prop
            </th>
            <th className="text-left py-2 pr-4 font-medium text-slate-900">
              Type
            </th>
            <th className="text-left py-2 pr-4 font-medium text-slate-900">
              Default
            </th>
            <th className="text-left py-2 font-medium text-slate-900">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-slate-100">
              <td className="py-2 pr-4 font-mono text-slate-700">
                {prop.name}
              </td>
              <td className="py-2 pr-4 font-mono text-slate-500">
                {prop.type}
              </td>
              <td className="py-2 pr-4 font-mono text-slate-500">
                {prop.default}
              </td>
              <td className="py-2 text-slate-600">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MorphingTocDemo() {
  return (
    <div className="bg-white min-h-screen relative">
      {/* Animated glow behind the TOC */}
      <motion.div
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 hidden lg:block pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-32 rounded-full blur-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.3))",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* The component itself - demonstrating it on this page */}
      <MorphingToc scrollOffset={80} headingLevels={[2, 3]} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <Link
            href="/side-projects"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to projects
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
            morphing-toc
          </h1>
          <p className="text-lg text-slate-600 mb-6 max-w-xl">
            A React table of contents component that displays minimal vertical
            lines and morphs into a full navigation menu on hover.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <a
              href="https://www.npmjs.com/package/morphing-toc"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 hover:border-slate-300 hover:text-slate-800 transition-colors"
            >
              <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-xs font-mono text-white">
                npm
              </span>
              <span className="font-medium">morphing-toc</span>
            </a>
            <a
              href="https://github.com/antoinepirard/morphing-toc"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 hover:border-slate-300 hover:text-slate-800 transition-colors"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4 text-slate-500"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.58 2 12.23c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.48 0-.23-.01-.85-.01-1.66-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.35-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .85-.28 2.8 1.05a9.5 9.5 0 0 1 2.55-.35c.86 0 1.73.12 2.54.35 1.96-1.33 2.8-1.05 2.8-1.05.56 1.4.21 2.44.11 2.7.65.71 1.04 1.63 1.04 2.75 0 3.95-2.34 4.82-4.57 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .26.18.58.68.48A10.26 10.26 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">GitHub</span>
            </a>
          </div>
        </motion.header>

        {/* Content sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-16"
        >
          {/* Features */}
          <section>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Features
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                Minimal visual footprint with vertical lines
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                Smooth morph animation on hover
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                Auto-extracts headings from DOM
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                Generates unique IDs for headings
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                Smooth scrolling with configurable offset
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                Fully customizable colors and sizes
              </li>
              <li className="flex gap-2">
                <span className="text-slate-400">•</span>
                TypeScript support
              </li>
            </ul>
          </section>

          {/* Installation */}
          <section>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Installation
            </h2>
            <CodeBlock>{`npm install morphing-toc`}</CodeBlock>
            <p className="mt-4 text-sm text-slate-500">
              Peer dependencies: react {">"}= 18, react-dom {">"}= 18, motion{" "}
              {">"}= 11
            </p>
          </section>

          {/* Basic Usage */}
          <section>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Basic Usage
            </h2>
            <CodeBlock>
              {`import { MorphingToc } from 'morphing-toc';

function BlogPost() {
  return (
    <div>
      <MorphingToc />
      <article>
        <h1>My Blog Post</h1>
        <h2>Introduction</h2>
        <p>...</p>
        <h2>Main Content</h2>
        <h3>Subsection</h3>
        <p>...</p>
      </article>
    </div>
  );
}`}
            </CodeBlock>
          </section>

          {/* Props */}
          <section>
            <h2 className="text-xl font-medium text-slate-900 mb-4">Props</h2>
            <PropsTable />
          </section>

          {/* Customization */}
          <section>
            <h2 className="text-xl font-medium text-slate-900 mb-4">
              Customization
            </h2>

            <h3 className="text-base font-medium text-slate-800 mb-3 mt-8">
              Custom Colors
            </h3>
            <CodeBlock>
              {`<MorphingToc
  colors={{
    line: {
      h1: '#1e40af',
      h2: '#3b82f6',
      h3: '#93c5fd',
    },
    menu: {
      background: 'rgba(30, 64, 175, 0.95)',
      text: '#ffffff',
      textHover: '#bfdbfe',
    },
  }}
/>`}
            </CodeBlock>

            <h3 className="text-base font-medium text-slate-800 mb-3 mt-8">
              Custom Sizes
            </h3>
            <CodeBlock>
              {`<MorphingToc
  sizes={{
    lineWidth: {
      h1: '2rem',
      h2: '1.5rem',
      h3: '1rem',
    },
    menuWidth: '20rem',
  }}
/>`}
            </CodeBlock>

            <h3 className="text-base font-medium text-slate-800 mb-3 mt-8">
              Scoped to Container
            </h3>
            <CodeBlock>
              {`<MorphingToc
  containerSelector="#article-content"
  headingLevels={[2, 3]}
/>`}
            </CodeBlock>
          </section>

          {/* Exports */}
          <section>
            <h2 className="text-xl font-medium text-slate-900 mb-4">Exports</h2>
            <p className="text-slate-600 mb-4">
              The package also exports utilities for custom implementations:
            </p>
            <CodeBlock>
              {`import {
  MorphingToc,      // Main component
  useTocItems,      // Hook for heading extraction
  scrollToSection,  // Scroll utility
} from 'morphing-toc';

// Type exports
import type {
  MorphingTocProps,
  MorphingTocColors,
  MorphingTocSizes,
  TocItem,
} from 'morphing-toc';`}
            </CodeBlock>
          </section>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-20 pt-8 border-t border-slate-100"
        >
          <p className="text-sm text-slate-500">
            Made by{" "}
            <Link href="/" className="text-slate-700 hover:text-slate-900">
              Antoine Pirard
            </Link>
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
