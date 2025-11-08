import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';

const EmpathySuggestions = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 bg-gradient-to-br from-[#1E293B] to-emerald-900/20 border-2 border-emerald-400/30 shadow-2xl shadow-emerald-400/20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Lightbulb className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-[#E2E8F0]">
                💡 Empathy Suggestions
              </h3>
              <p className="text-xs text-emerald-400">
                Ways to improve your message
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ x: 5, scale: 1.02 }}
                className="flex items-start gap-3 p-4 bg-[#0F172A] rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-400/10 transition-all duration-300 ease-in-out"
              >
                <span className="text-2xl flex-shrink-0">
                  {suggestion.substring(0, 2)}
                </span>
                <p className="text-[#E2E8F0] leading-relaxed flex-1">
                  {suggestion.substring(2).trim()}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="pt-3 border-t border-emerald-400/20">
            <p className="text-xs text-[#94A3B8] text-center italic">
              Apply these tips to communicate with more empathy and warmth
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default EmpathySuggestions;