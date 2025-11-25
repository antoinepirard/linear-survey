"use client";

import Image from "next/image";
import { AnimationWrapper } from "@/hooks/useAnimation";
import HeaderSection from "@/components/HeaderSection";
import { Button } from "@/components/ui/button";
import { DualEmailButton } from "@/components/ui/dual-email-button";
import { CalendarDaysIcon, BookOpenIcon } from "@heroicons/react/24/outline";

export default function HowIWork() {
  return (
    <div className="bg-white min-h-screen relative overflow-x-hidden">
      <main className="overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 pt-20 pb-9 sm:py-9">
            {/* Header */}
            <HeaderSection />

            {/* Main Content */}
            <div className="flex flex-col gap-6 max-w-2xl">
              <AnimationWrapper delay="150ms">
                <div className="flex flex-col gap-4 text-base leading-relaxed text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">
                      I thrive in fast-moving, ambiguous environments where
                      product direction is still being shaped.
                    </span>{" "}
                    I focus on choosing the right problems to solve, validating
                    with users, and keeping product and engineering aligned to
                    deliver meaningful outcomes.
                  </p>

                  <p>
                    My work is hands-on product and design. I work directly with
                    customers, product and engineering leads. Each week, I run
                    outcome loops: set a goal → prototype & test → write a
                    decision memo → next steps. I work closely with engineers,
                    prioritizing, scoping, and jumping in with small PRs when
                    needed.
                  </p>

                  <p>
                    <span className="font-medium text-slate-900">
                      What I bring to a team:
                    </span>{" "}
                    Faster decisions (days, not months), lower risk (testing top
                    assumptions before code), and team alignment (prototypes and
                    specs that engineering can trust).
                  </p>

                  <p>
                    <span className="font-medium text-slate-900">
                      What I&apos;m not looking for:
                    </span>{" "}
                    Slow decision making, make it pretty work, little autonomy,
                    hands-off the codebase, too many layers of leadership orgs.
                  </p>
                </div>
              </AnimationWrapper>

              <AnimationWrapper delay="300ms" className="mt-6">
                <div className="flex gap-3">
                  <Button
                    asChild
                    variant="default"
                    className="active:scale-[0.97]"
                  >
                    <a
                      href="https://cal.com/antoine-ravell/15min"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CalendarDaysIcon className="w-4 h-4" />
                      Let&apos;s chat
                    </a>
                  </Button>
                  <DualEmailButton email="contact@antoinepirard.com" />
                </div>
              </AnimationWrapper>

              {/* Case Study */}
              <AnimationWrapper delay="350ms" className="mt-8">
                <div className="flex flex-col gap-3">
                  <h2 className="text-sm font-medium text-slate-600">
                    Highlights
                  </h2>
                  <a
                    href="/case-studies/chatbot-flow-builder"
                    className="flex items-start gap-4 max-w-2xl bg-slate-50 ring-1 ring-slate-100 hover:bg-slate-100 rounded-xl px-6 py-4 transition-all duration-150"
                  >
                    <div className="bg-white shadow-sm rounded-lg p-2 flex-shrink-0">
                      <BookOpenIcon className="w-4.5 h-4.5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-slate-900 mb-0">
                        Chatbot flow builder for WhatsApp
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        A multi months project to allow Rasayel customers to
                        build complex conversational and integrated chatbot
                        flows.
                      </p>
                    </div>
                  </a>
                </div>
              </AnimationWrapper>

              {/* LinkedIn Recommendations */}
              <AnimationWrapper delay="400ms" className="mt-8 mb-24">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="bg-white hover:bg-slate-100 text-slate-600"
                >
                  <a
                    href="https://www.linkedin.com/in/antoinepirard/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/Assets/Logos/linkedin-logo.svg"
                      alt="LinkedIn"
                      width={16}
                      height={16}
                    />
                    Read recommendations
                  </a>
                </Button>
              </AnimationWrapper>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
