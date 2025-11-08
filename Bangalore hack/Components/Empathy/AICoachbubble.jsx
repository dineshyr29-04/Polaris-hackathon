import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const AICoachBubble = ({ message, isVisible = true, onDismiss }) => {
  const [show, setShow] = React.useState(isVisible);

  useEffect(() => {
    setShow(isVisible && message);
  }, [isVisible, message]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (show) {
        setShow(false);
        if (onDismiss) onDismiss();
      }
    };

    if (show) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [show, onDismiss]);

  if (!message) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-6 right-6 max-w-md z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-2xl blur-lg opacity-50 animate-pulse" />
            <div className="relative bg-[#1E293B] rounded-2xl shadow-2xl p-5 border-2 border-indigo-500/50">
              <button
                onClick={() => {
                  setShow(false);
                  if (onDismiss) onDismiss();
                }}
                className="absolute top-3 right-3 p-1 hover:bg-[#0F172A] rounded-full transition-colors duration-300 ease-in-out"
              >
                <X className="w-4 h-4 text-[#94A3B8] hover:text-[#E2E8F0]" />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pr-6">
                  <div className="font-semibold text-sm text-indigo-400 mb-1">
                    Your Empathy Coach
                  </div>
                  <p className="text-sm text-[#E2E8F0] leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-[#64748B] text-center">
                Tap anywhere to dismiss
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AICoachBubble;