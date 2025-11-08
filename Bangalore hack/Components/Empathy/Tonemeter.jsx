import React from 'react';
import { motion } from 'framer-motion';

const ToneMeter = ({ empathyScore, emotion }) => {
  const getColor = () => {
    if (empathyScore >= 70) return { 
      bg: 'from-emerald-400 to-green-500', 
      glow: 'shadow-emerald-400/50', 
      text: 'text-emerald-400',
      ring: 'ring-emerald-400/30'
    };
    if (empathyScore >= 40) return { 
      bg: 'from-violet-400 to-purple-500', 
      glow: 'shadow-violet-400/50', 
      text: 'text-violet-400',
      ring: 'ring-violet-400/30'
    };
    return { 
      bg: 'from-[#FB7185] to-red-500', 
      glow: 'shadow-[#FB7185]/50', 
      text: 'text-[#FB7185]',
      ring: 'ring-[#FB7185]/30'
    };
  };

  const getEmoji = () => {
    if (empathyScore >= 70) return '🟢';
    if (empathyScore >= 40) return '🟡';
    return '🔴';
  };

  const color = getColor();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full space-y-4 p-4 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl border border-indigo-500/20"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <motion.span 
            className="text-3xl md:text-4xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 0.6,
              repeat: 0
            }}
          >
            {getEmoji()}
          </motion.span>
          <div>
            <div className="font-bold text-lg md:text-xl text-[#E2E8F0]">
              {empathyScore}/100
            </div>
            <div className="text-xs text-[#94A3B8]">
              Empathy Level
            </div>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`px-4 py-2 rounded-full text-sm font-bold ${color.text} bg-[#0F172A] border-2 ${color.ring} shadow-lg`}
        >
          {emotion}
        </motion.div>
      </div>
      
      <div className="relative h-6 bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] rounded-full overflow-hidden shadow-inner border border-indigo-500/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${empathyScore}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color.bg} rounded-full shadow-2xl ${color.glow} relative overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>

      <div className="flex justify-between text-xs font-medium text-[#94A3B8] px-1">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-[#FB7185] rounded-full"></span>
          Harsh
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
          Neutral
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          Kind
        </span>
      </div>
    </motion.div>
  );
};

export default ToneMeter;