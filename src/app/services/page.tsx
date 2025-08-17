"use client";

import { AnimationWrapper } from "@/hooks/useAnimation";
import HeaderSection from "@/components/HeaderSection";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

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
                <h1 className="text-lg font-medium leading-relaxed text-slate-950">
                  A product & design partner for 0→1 and pivots.
                </h1>
              </AnimationWrapper>

              <AnimationWrapper delay="200ms">
                <div className="flex flex-col gap-4 text-base leading-relaxed text-slate-600">
                  <p>
                    I partner with early-stage founders building their first product and mature teams making product pivots. In one month, we clarify the bet, test it with users, and align engineering with a prototype and decision brief.
                  </p>
                  
                  <p>
                    My approach is hands-on product and design work embedded with your founder and tech lead. We run weekly outcome loops—goal, prototype and test, decision memo, next step. I don't write code, but I make sure the right code gets written.
                  </p>
                  
                  <p>
                    What we achieve together: decision velocity on the next bet in days not months, risk reduction by testing top assumptions before code, and team alignment with prototypes and specs engineering trusts.
                  </p>
                  
                  <p>
                    In practice, this means problem framing and success criteria, clickable flows with user tests and insights, then specs, acceptance criteria, and clean handoff to development.
                  </p>
                  
                  <p>
                    This works best with engaged founders, technical core teams, and access to users. It's not a fit for pixel-only work, "just make it pretty" requests, or situations without access to decision-makers.
                  </p>
                </div>
              </AnimationWrapper>

              <AnimationWrapper delay="300ms">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-800 transition-all duration-150 w-fit"
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