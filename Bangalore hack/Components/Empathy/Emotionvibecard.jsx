import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

const EmotionVibeCard = ({ 
  emotionLabel, 
  emotionColor, 
  receiverReaction, 
  detectedLanguage,
  confidenceScore,
  vibeSummary 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <Card 
        className="p-6 bg-[#1E293B] border-2 shadow-2xl transition-all duration-300 ease-in-out"
        style={{ 
          borderColor: `${emotionColor}40`,
          boxShadow: `0 20px 25px -5px ${emotionColor}15, 0 8px 10px -6px ${emotionColor}15`
        }}
      >
        <div className="space-y-4">
          {/* Emotion Label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${emotionColor}, ${emotionColor}dd)` }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-4xl">{emotionLabel.split(' ')[0]}</span>
              </motion.div>
              <div>
                <div className="text-2xl font-bold text-[#E2E8F0]">
                  {emotionLabel}
                </div>
                <div className="text-sm text-[#94A3B8]">
                  Detected Emotional Tone
                </div>
              </div>
            </div>
            
            {confidenceScore && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-lg font-bold">
                    {Math.round(confidenceScore * 100)}%
                  </span>
                </div>
                <div className="text-xs text-[#94A3B8]">
                  Confidence
                </div>
              </div>
            )}
          </div>

          {/* Receiver Reaction */}
          <div className="relative">
            <div 
              className="absolute -left-2 top-0 bottom-0 w-1 rounded-full"
              style={{ backgroundColor: emotionColor }}
            />
            <div className="pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4" style={{ color: emotionColor }} />
                <span className="text-sm font-semibold text-[#E2E8F0]">
                  How the receiver might feel:
                </span>
              </div>
              <p className="text-[#94A3B8] leading-relaxed">
                {receiverReaction}
              </p>
            </div>
          </div>

          {/* Vibe Summary (if speech) */}
          {vibeSummary && (
            <div className="p-3 bg-[#0F172A] rounded-lg border border-indigo-500/30">
              <div className="text-xs font-semibold text-indigo-400 mb-1">
                🎙️ Vibe Summary:
              </div>
              <p className="text-sm text-[#E2E8F0]">
                {vibeSummary}
              </p>
            </div>
          )}

          {/* Language Info */}
          {detectedLanguage && (
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-indigo-500/20">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-[#94A3B8]">
                Detected Language: <span className="text-[#E2E8F0] font-medium">{detectedLanguage}</span>
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EmotionVibeCard;