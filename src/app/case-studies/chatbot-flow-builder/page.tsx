"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeftIcon,
  LinkIcon,
  ChevronDownIcon,
  BoltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import Image from "next/image";
import { FancyHeader } from "@/components/FancyHeader";
import { toast } from "sonner";
import { tabData } from "./tabData";

const FocusBanner = dynamic(() => import("@/components/FocusBanner"), {
  ssr: false,
});

const TableOfContents = dynamic(() => import("@/components/TableOfContents"), {
  loading: () => (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block opacity-0" />
  ),
});

export default function ChatbotFlowBuilderCaseStudy() {
  const [showRequirements, setShowRequirements] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL:", err);
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 relative"
      style={{
        backgroundImage:
          "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <TableOfContents />

      {/* Copy URL Button - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.05 }}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-50"
      >
        <Button
          onClick={copyUrl}
          variant="outline"
          size="icon"
          className="min-h-[44px] min-w-[44px] bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-150"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </motion.div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <div
          className="mt-6 md:mt-12 mb-16 md:mb-36 animate-fade-in-up text-center"
          style={{ animationDelay: "0ms" }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-1.5 py-1 bg-slate-50 font-mono uppercase font-medium rounded-md text-slate-600 text-xs hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Portfolio
          </Link>
        </div>

        <FancyHeader
          dateRange="2023 - 2024"
          title="A Chatbot Builder for the WhatsApp Business API"
          description="Led the product design of Rasayel's chatbot builder, integrated and optimised for the WhatsApp Business API to enable automated interactions and scale conversations efficiently."
        />
      </div>

      {/* Hero Video - Outside main container */}
      <div
        className="mb-16 mx-auto flex justify-center"
        style={{
          maxWidth: "90vw",
        }}
      >
        <video
          src="/Assets/Videos/thebooot.webm"
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto rounded-sm bg-slate-50 max-w-none md:max-w-[calc(996px*1.15)]"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Content */}
        <div className="bg-white rounded-md ring-1 ring-slate-300/20 shadow-xl overflow-hidden">
          {/* Introduction */}
          <section className="p-6 md:p-12 pb-6 md:pb-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">
                Role and Context
              </h2>
              <p className="text-slate-700 leading-relaxed">
                As product designer, I was responsible for identifying problems,
                prioritiszing them with our CEO, and scoping the solutions in a
                manner that would deliver value incrementally so we could
                validate our assumptions. I iterated on our chatbot builder for
                the WhatsApp Business API over 2 years.
              </p>

              <p className="text-slate-700 leading-relaxed">
                The project started as an experiment, to validate the identified
                demand of automating WhatsApp conversations with a chatbot
                builder tool. The chatbot ultimaely became a core USP for our
                platform and we iterated on it for over 2 years.
              </p>
            </div>
          </section>

          {/* Understanding the Problem */}
          <section className="border-t border-slate-100 p-6 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">
                  Understanding the Problem
                </h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 text-base leading-relaxed mb-3 md:mb-4">
                    Understanding the problem was a challenge initially since
                    chatbots address diverse jobs-to-be-done. Conversations vary
                    from use case to use case (from qualification to basic
                    support FAQ). This required us to find patterns of needs
                    from our customers that we could map to a system.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    We prioritized support use cases initially (pre-pivot to
                    sales-focused ICP) to focus efforts and validate the core
                    functionality before expanding to broader use cases.
                  </p>
                </div>

                <div
                  className="bg-slate-50 rounded-md p-4 cursor-pointer"
                  onClick={() => setShowRequirements(!showRequirements)}
                >
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-base font-medium text-slate-900">
                      How we got there?
                    </h3>
                    <motion.div
                      animate={{ rotate: showRequirements ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {showRequirements && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-4">
                          <p className="text-slate-700 text-sm leading-relaxed">
                            At the time, we were doing weekly interviews with
                            customers. Combined with competitor analysis
                            (ManyChat, Chatbot.com, Bird.com) we identified
                            quickly the core problems. To give us a better
                            understanding of the complexity and depht (e.g.
                            fallbacks, conditions, etc.) we also collaborated
                            with some support automation builder agencies to
                            give us pointers.
                          </p>
                          <p className="text-slate-700 text-sm leading-relaxed">
                            As the product was being built, most or our feedback
                            came from getting close to customers via our Slack
                            Connect channels and our support team. For each
                            bigger feature, I jumped onto calls with key ICP
                            customers to dig deeper into their use cases and
                            test our solutions.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* Building the Solution */}
          <section className="border-t border-slate-100 p-6 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">
                  Building the Solution
                </h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                    We approached development iteratively, starting with a proof
                    of concept and expanding capabilities based on user feedback
                    and market validation.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-white">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        Proof of Concept
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        We started with the basics to validate viability. The
                        first version was intentionally limited in scope to test
                        core feasibility. We focused on inbound triggers with
                        simple conditions, worked within WhatsApp&apos;s 24-hour
                        messaging window, and built basic tagging and status
                        changes. The canvas used an opinionated layout that
                        later proved limiting as flows grew more complex.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-white">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        Use cases expansion
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        We added more nodes to increase the number of use cases
                        we could cover. Added HTTP request node to integrate
                        external systems, prioritizing shipping new nodes over
                        polish to validate market fit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-white">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        Enhanced Usability
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Emphasized usability for complex flows. Rebuilt canvas
                        with undo/redo, drag-and-drop, zoom, and performance
                        optimizations to handle large bots smoothly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-white">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        Polish and Intelligence
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Polished interactions, added analytics (CTR tracking),
                        CRM integrations, and AI features: nodes for info
                        collection, intent detection, and basic AI agents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Image - Full width */}
            <div className="mt-24 px-6 md:px-12 -mb-6 md:-mb-12">
              <p className="text-xs font-mono text-slate-500 mb-12 text-center">
                Thanks to customers who challenged each iterations.
              </p>
              <div className="relative">
                <Image
                  src="/case-studies/chatbot/feedback-recieved (1).png"
                  alt="Customer feedback received"
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 h-68 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </div>
            </div>
          </section>

          {/* Key Challenges */}
          <section className="border-t border-slate-100 p-6 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-slate-900 mb-3 md:mb-4">
                  Core Challenges
                </h2>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed mb-4 md:mb-6">
                    As the only product person on this project while juggling
                    multiple initiatives, effective prioritization became
                    critical to our success. Customer expectations were high
                    from day one—they were migrating from more mature
                    competitors with extensive action libraries and robust
                    fallback systems. We had to learn quickly and build solid
                    foundations while managing time constraints.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-md p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Feature Prioritization
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Early prioritization was straightforward—we had nothing,
                      so building the basics was clear. Complexity emerged when
                      deciding on use case-specific features like smart capture
                      nodes for sales qualification, while our ICP was broadly
                      &quot;every business using WhatsApp.&quot; This friction
                      sparked conversations that ultimately helped us refine our
                      customer focus.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-md p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Simplicity vs Power
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      We constantly debated whether to keep things simple by
                      blocking certain use cases (like restricting action nodes
                      to only follow message nodes) or accept slightly more
                      complexity to enable broader functionality. This balance
                      shaped every design decision.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-md p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Flexibility vs. Opinionated Design
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Balanced defaults (e.g., customizable fallbacks) with
                      extensibility. For example, we initially restricted node
                      positioning to ensure readability, but learned that as
                      flows became complex, users needed flexibility to organize
                      their layouts. This tension required constant iteration to
                      maintain usability without overwhelming users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Deep Dive Section Header */}
        <div
          className="mt-16 md:mt-26 mb-6 md:mb-8 text-center"
          id="deep-dive-section"
        >
          <div className="inline-block group border border-dashed border-slate-300 hover:border-slate-400 transition-all duration-200 p-4 md:p-6 relative">
            {/* Corner squares - visual indicators only */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
            <h2 className="text-4xl md:text-6xl font-medium text-slate-900 tracking-tight">
              Deep Dive
            </h2>
          </div>
        </div>

        {/* Deep Dive: Features */}
        <div className="bg-white rounded-md ring-1 ring-slate-300/20 shadow-xl overflow-hidden">
          <Tabs tabs={tabData} defaultTab="nodes" />
        </div>

        {/* Outcome Section */}
        <div className="mt-16 md:mt-26 mb-6 md:mb-8 text-center">
          <div className="inline-block group border border-dashed border-slate-300 hover:border-slate-400 transition-all duration-200 p-4 md:p-6 relative">
            {/* Corner squares - visual indicators only */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-slate-300 group-hover:bg-slate-400 transition-colors duration-200 pointer-events-none"></div>
            <h2 className="text-4xl md:text-6xl font-medium text-slate-900 tracking-tight">
              Outcome
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-md ring-1 ring-slate-300/20 shadow-xl overflow-hidden">
          <section className="p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
                {[
                  {
                    icon: BoltIcon,
                    title: "Workflow that actually deliver value",
                    description:
                      "From no automations to complex conversational flows integrated with the customer CRMs.",
                  },
                  {
                    icon: ChartBarIcon,
                    title: "Fueled growth from 0 to 65k MRR",
                    description:
                      "One of the key features allowing us to close deals within our ICP.",
                  },
                  {
                    icon: ShieldCheckIcon,
                    title: "Differentiated from competitors",
                    description:
                      "Flow is fully WhatsApp Native, allowing us to outcompete competitors.",
                  },
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="text-left bg-slate-50 rounded-xl p-4"
                    >
                      <div className="w-8 h-8 mb-3 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-slate-400" />
                      </div>
                      <h4 className="font-medium text-slate-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">
                The chatbot builder became a core differentiator for Rasayel,
                allowing us to close deals with customers using other platforms
                like WATI, Respond.io etc. It fueled our growth from 0$ to 65k$
                in MRR, adding to our key differentiator like the quality of our
                inbox, and the depht of our CRM integrations. While there are
                many things I would want to do next, I am proud of the
                product&apos;s impact on the business and customers, especially
                accounting for the very limited resources we had.
              </p>

              <p className="text-slate-700 leading-relaxed">
                We iterated on the features for 2.5 years, continually testing
                and discussing with our customers through dedicated Slack
                channels. As a consequence, the product was delivering on all
                key use cases while having a solid design system that we also
                iterated 2-3 times throughout the development process.
              </p>
            </div>
          </section>

          {/* Credits Footer */}
          <footer className="bg-slate-50 border-t border-slate-100 p-6 md:p-8 text-center">
            <p className="text-xs text-slate-900 mb-1">
              Thanks to my colleagues:
            </p>
            <p className="text-xs text-slate-600">
              <a
                href="https://x.com/logaretm"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition-colors"
              >
                Abdelrahman Awad
              </a>
              ,{" "}
              <a
                href="https://jonnyom.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition-colors"
              >
                Jonny O&apos;Mahonny
              </a>
              ,{" "}
              <a
                href="https://www.linkedin.com/in/tarek-khalil-wa/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 transition-colors"
              >
                Tarek Khalil
              </a>
              , Nasser Hesham, Youssef Walid, and the rest of our engineering
              team.
            </p>
          </footer>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-26 pb-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-1.5 py-1 bg-slate-50 font-mono uppercase font-medium rounded-md text-slate-600 text-xs hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Focus Banner */}
      <FocusBanner />
    </div>
  );
}
