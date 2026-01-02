"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PlusIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { generateRoomId } from "../_utils/calculations";
import { addRecentRoom } from "../_utils/recentRooms";
import { CreateVoteConfig } from "../_types";

interface OptionItem {
  id: string;
  value: string;
}

let optionIdCounter = 0;
function generateOptionId(): string {
  return `option-${++optionIdCounter}`;
}

interface CreateVoteFormProps {
  onClose: () => void;
}

type Step = "form" | "share";

export function CreateVoteForm({ onClose }: CreateVoteFormProps) {
  const [step, setStep] = useState<Step>("form");
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState<OptionItem[]>(() => [
    { id: generateOptionId(), value: "" },
    { id: generateOptionId(), value: "" },
  ]);
  const [expectedVoters, setExpectedVoters] = useState(2);
  const [hostName, setHostName] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addOption = useCallback(() => {
    if (options.length < 6) {
      setOptions([...options, { id: generateOptionId(), value: "" }]);
    }
  }, [options]);

  const removeOption = useCallback(
    (id: string) => {
      if (options.length > 2) {
        setOptions(options.filter((opt) => opt.id !== id));
      }
    },
    [options]
  );

  const updateOption = useCallback((id: string, value: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, value } : opt))
    );
  }, []);

  const isValid =
    topic.trim() !== "" &&
    options.every((o) => o.value.trim() !== "") &&
    hostName.trim() !== "";

  const handleSubmit = useCallback(() => {
    if (!isValid) return;

    const config: CreateVoteConfig = {
      topic: topic.trim(),
      options: options.map((o) => o.value.trim()),
      expectedVoters,
    };

    // Generate room ID and store config in URL params
    const newRoomId = generateRoomId();

    // Store config in sessionStorage so the room page can initialize with it
    sessionStorage.setItem(
      `conviction-room-${newRoomId}`,
      JSON.stringify({
        config,
        hostName: hostName.trim(),
      })
    );

    // Store in recent rooms for the landing page
    addRecentRoom({
      roomId: newRoomId,
      topic: config.topic,
      createdAt: Date.now(),
      role: "host",
    });

    setRoomId(newRoomId);
    setStep("share");
  }, [isValid, topic, options, expectedVoters, hostName]);

  const roomUrl =
    roomId && typeof window !== "undefined"
      ? `${window.location.origin}/side-projects/conviction/room/${roomId}`
      : "";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomUrl]);

  const handleGoToRoom = useCallback(() => {
    if (roomId) {
      window.location.href = `/side-projects/conviction/room/${roomId}`;
    }
  }, [roomId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60"
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-amber-50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border-2 border-slate-900"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100 transition-colors z-10"
        >
          <XMarkIcon className="w-5 h-5 text-slate-600" />
        </button>

        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Set it up
              </h2>

              <div className="space-y-5">
                {/* Your Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your name
                  </label>
                  <input
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full h-12 px-4 text-base rounded-xl border-2 border-slate-200 bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    What are you deciding?
                  </label>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Where should we eat?"
                    className="w-full h-12 px-4 text-base rounded-xl border-2 border-slate-200 bg-white focus:border-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {options.map((option, index) => (
                        <motion.div
                          key={option.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex gap-2"
                        >
                          <input
                            value={option.value}
                            onChange={(e) =>
                              updateOption(option.id, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 h-12 px-4 text-base rounded-xl border-2 border-slate-200 bg-white focus:border-slate-900 focus:outline-none transition-colors"
                          />
                          {options.length > 2 && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => removeOption(option.id)}
                              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 transition-colors"
                            >
                              <XMarkIcon className="w-5 h-5 text-slate-500" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {options.length < 6 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addOption}
                      className="mt-2 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add option
                    </motion.button>
                  )}
                </div>

                {/* Expected Voters */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    How many people are voting?
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpectedVoters(num)}
                        className={`w-11 h-11 rounded-xl text-base font-bold transition-all ${
                          expectedVoters === num
                            ? "bg-slate-900 text-white"
                            : "bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Create Room Button */}
                <div className="pt-2">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    whileHover={isValid ? { scale: 1.02 } : {}}
                    whileTap={isValid ? { scale: 0.98 } : {}}
                    className={`w-full h-12 text-base font-bold rounded-full text-white transition-all ${
                      isValid ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{ backgroundColor: isValid ? "#FF6B5B" : "#94A3B8" }}
                  >
                    Create Room
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#FF6B5B" }}
              >
                <CheckIcon className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Room created!
              </h2>
              <p className="text-slate-500 mb-6">
                Share this link with your friends
              </p>

              {/* URL Copy Box */}
              <div className="bg-white rounded-xl p-3 mb-4 border-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={roomUrl}
                    className="flex-1 bg-transparent text-sm text-slate-700 font-mono truncate focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex-shrink-0 p-2 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: copied ? "#FF6B5B" : "#f1f5f9",
                      color: copied ? "white" : "#475569"
                    }}
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>

              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 text-base font-bold rounded-full text-white mb-3 transition-all"
                style={{ backgroundColor: "#FF6B5B" }}
              >
                {copied ? "Copied!" : "Copy Link"}
              </motion.button>

              <motion.button
                onClick={handleGoToRoom}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 text-base font-bold rounded-full bg-slate-900 text-white transition-all"
              >
                Go to Room
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
