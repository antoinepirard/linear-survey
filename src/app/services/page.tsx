"use client";

import { AnimationWrapper } from "@/hooks/useAnimation";
import HeaderSection from "@/components/HeaderSection";
import { Button } from "@/components/ui/button";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
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
                    As an ongoing embedded partner, we choose the next bet, test
                    it with users, and keep engineering aligned and work withe
                    the team to ensure the output is outcome driven and well
                    crafted.
                  </p>

                  <p>
                    My approach is hands-on product and design, embedded with
                    your founder and tech lead. We run weekly outcome loops—goal
                    → prototype & test → decision memo → next step. I work
                    closely with engineers and, when it unblocks momentum,
                    I&apos;ll open small PRs to ensure implementation quality.
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

              <AnimationWrapper delay="300ms" className="mt-6 mb-24">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-800 transition-all duration-150 w-full sm:w-fit"
                >
                  <a
                    href="https://cal.com/antoine-ravell/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    Book a call
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
