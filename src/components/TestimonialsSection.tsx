import { motion } from "motion/react";
import { testimonials } from "@/data/staticData";

export default function TestimonialsSection() {
  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-lg font-medium text-slate-900 mb-8">
          What people say
        </h2>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white py-0 px-4 border-l border-orange-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.4 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <blockquote className="text-slate-700 text-sm mb-4">
                {testimonial.text}
              </blockquote>
              <div className="text-sm">
                <div className="font-medium text-slate-900">
                  {testimonial.author}
                </div>
                <div className="text-slate-600">{testimonial.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
