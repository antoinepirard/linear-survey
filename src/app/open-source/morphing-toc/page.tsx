"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MorphingToc } from "../../../../open-source/morphing-toc/src";

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
      <code>{children}</code>
    </pre>
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
          <div className="flex gap-4">
            <a
              href="https://npmjs.com/package/morphing-toc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors underline underline-offset-2"
            >
              npm
            </a>
            <a
              href="https://github.com/antoinepirard/morphing-toc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors underline underline-offset-2"
            >
              GitHub
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
              {">"}= 10
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
