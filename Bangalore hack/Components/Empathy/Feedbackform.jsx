import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const FeedbackCard = ({ feedback, title = "How This Might Feel", icon: Icon = MessageCircle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-6 shadow-xl border-2 border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out"
    >
      <div className="flex items-start gap-4 mb-4">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[#E2E8F0]">{title}</h3>
          <p className="text-xs text-indigo-400 font-medium">AI Analysis</p>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-400 rounded-full"></div>
        <p className="text-[#94A3B8] leading-relaxed pl-4 text-base">
          {feedback}
        </p>
      </div>
    </motion.div>
  );
};

export default FeedbackCard;