"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

function QuestionTypeCard({ type, icon }: { type: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
      <span>{icon}</span>
      <span>{type}</span>
    </div>
  );
}

export default function LinearSurveyPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
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
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Linear Survey
            </h1>
          </div>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl">
            An open-source, minimalistic survey builder that integrates with
            Linear. Create surveys, collect responses, and push them directly to
            Linear as issues.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href="https://linear-survey.vercel.app"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Try Demo
            </a>
            <a
              href="https://github.com/antoinepirard/linear-survey"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:border-slate-300 hover:text-slate-900 transition-colors"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.58 2 12.23c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.48 0-.23-.01-.85-.01-1.66-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.35-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .85-.28 2.8 1.05a9.5 9.5 0 0 1 2.55-.35c.86 0 1.73.12 2.54.35 1.96-1.33 2.8-1.05 2.8-1.05.56 1.4.21 2.44.11 2.7.65.71 1.04 1.63 1.04 2.75 0 3.95-2.34 4.82-4.57 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .26.18.58.68.48A10.26 10.26 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
          </div>
        </motion.header>

        {/* Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-16"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm overflow-hidden">
            <Image
              src="/Assets/Images/linear-survey-builder.png"
              alt="Linear Survey Builder Interface"
              width={1200}
              height={675}
              className="rounded-lg"
            />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-xl font-medium text-slate-900 mb-6">Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              }
              title="Survey Builder"
              description="Create surveys with a clean, form-based interface. Add questions, set requirements, and preview in real-time."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              }
              title="Shareable Links"
              description="Each survey gets a clean public URL. Share it anywhere to start collecting responses."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              title="Responses Dashboard"
              description="View all responses in a table. Export to CSV or push directly to Linear."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="Linear Integration"
              description="Connect with your Linear API key. Push responses as issues with one click."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              }
              title="Local Storage Mode"
              description="Works without a database for quick demos. Or connect Supabase for production."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              }
              title="Open Source"
              description="MIT licensed. Self-host it, modify it, or contribute to make it better."
            />
          </div>
        </motion.section>

        {/* Question Types */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mb-16"
        >
          <h2 className="text-xl font-medium text-slate-900 mb-4">
            Question Types
          </h2>
          <p className="text-slate-600 mb-6">
            Six question types to cover most survey needs:
          </p>
          <div className="flex flex-wrap gap-3">
            <QuestionTypeCard type="Short Text" icon="📝" />
            <QuestionTypeCard type="Long Text" icon="📄" />
            <QuestionTypeCard type="Single Choice" icon="○" />
            <QuestionTypeCard type="Multiple Choice" icon="☑" />
            <QuestionTypeCard type="Rating (1-5)" icon="⭐" />
            <QuestionTypeCard type="Email" icon="✉️" />
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-xl font-medium text-slate-900 mb-6">
            How It Works
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                1
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Create a survey</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Add questions, descriptions, and configure which fields are
                  required.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                2
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Share the link</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Send your survey URL to users. They fill it out on a clean,
                  mobile-friendly form.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                3
              </div>
              <div>
                <h3 className="font-medium text-slate-900">
                  Review responses
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  See all submissions in a table. Export to CSV or push to
                  Linear.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                4
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Push to Linear</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Create issues from responses with one click. All answers are
                  formatted in the issue description.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mb-16"
        >
          <h2 className="text-xl font-medium text-slate-900 mb-4">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js 15", "Tailwind CSS", "Supabase", "Linear API"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-xl border border-slate-200 bg-white p-8 text-center"
        >
          <h2 className="text-xl font-medium text-slate-900 mb-2">
            Ready to try it?
          </h2>
          <p className="text-slate-500 mb-6">
            Create your first survey in minutes. No account required for the
            demo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://linear-survey.vercel.app"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 transition-colors font-medium"
            >
              Launch Demo
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
            <a
              href="https://github.com/antoinepirard/linear-survey"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-slate-700 hover:border-slate-300 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="mt-16 pt-8 border-t border-slate-200"
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

