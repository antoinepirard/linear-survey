"use client";

import Image from "next/image";
import { AnimationWrapper } from "@/hooks/useAnimation";
import HeaderSection from "@/components/HeaderSection";
import { Button } from "@/components/ui/button";
import { DualEmailButton } from "@/components/ui/dual-email-button";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export default function Services() {
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
                <h1 className="text-base font-medium leading-relaxed text-slate-950">
                  A product & design partner for 0→1 and pivots.
                </h1>
              </AnimationWrapper>

              <AnimationWrapper delay="200ms">
                <div className="flex flex-col gap-4 text-base leading-relaxed text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">
                      {" "}
                      I partner with early-stage founders building their first
                      product and teams making product pivots.{" "}
                    </span>{" "}
                    As a embedded partner, I work with you to choose the next
                    priority, validate it with users, and make sure product and
                    engineering stay aligned so we deliver meaningful outcomes.
                  </p>

                  <p>
                    My approach is hands-on product and design, working directly
                    with your founder and tech lead. We run weekly outcome loops
                    — goal → prototype & test → decision memo → next step. I
                    work closely with engineers beyond just handover — I
                    prioritize, scope, and jump in to work alongside them when
                    needed.
                  </p>

                  <p>
                    <span className="font-medium text-slate-900">
                      What we achieve together:
                    </span>{" "}
                    decision velocity (days, not months), risk reduction (test
                    top assumptions before code), and team alignment (prototypes
                    and specs engineering trusts).
                  </p>

                  <p>
                    <span className="font-medium text-slate-900">
                      In practice:
                    </span>{" "}
                    problem framing & success criteria → validated experiences
                    and designs with users → specs, acceptance criteria, and a
                    clean handoff to development.
                  </p>

                  <div className="flex flex-col gap-2 mt-6">
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>
                        <span className="font-medium text-slate-900">
                          Best fit:
                        </span>{" "}
                        engaged founders, a technical core, and access to users.
                        Multi months or quarter collaborations.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircleIcon className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>
                        <span className="font-medium text-slate-900">
                          Not a fit:
                        </span>{" "}
                        pixel-only work, &quot;just make it pretty,&quot; or no
                        access to decision-makers. Single day or week
                        engagements.
                      </span>
                    </div>
                  </div>
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
                      Book a 15 min call
                    </a>
                  </Button>
                  <DualEmailButton email="antoine@ravell.io" />
                </div>
              </AnimationWrapper>

              {/* Case Study */}
              <AnimationWrapper delay="350ms" className="mt-8">
                <div className="flex flex-col gap-3">
                  <h2 className="text-sm font-medium text-slate-600">
                    Projects I&apos;ve delivered
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
