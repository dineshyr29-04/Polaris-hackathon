
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit3, Loader2, Copy, Check, ArrowRight, Share2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AICoachBubble from '../components/empathy/AICoachBubble';

export default function Rewrite() {
  const location = useLocation();
  const [originalText, setOriginalText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [coachMessage, setCoachMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
  });

  // Handle pre-filled text from navigation (e.g., from History page)
  useEffect(() => {
    if (location.state?.prefilledText) {
      setOriginalText(location.state.prefilledText);
    }
  }, [location.state]);

  useEffect(() => {
    if (userProfile) {
      setCoachMessage(`Hi ${userProfile.display_name}! 💛 Let me help you rewrite your message with more empathy and compassion.`);
    } else {
      setCoachMessage("Paste any message and I'll rewrite it with empathy - keeping the meaning but softening the tone. ✨");
    }
  }, [userProfile]);

  const rewriteMessage = async () => {
    if (!originalText.trim()) return;

    setIsRewriting(true);
    setRewrittenText('');
    setIsEditing(false);

    try {
      const userName = userProfile?.display_name || 'there';
      const userRole = userProfile?.role || 'professional';
      const commStyle = userProfile?.communication_style || 'balanced';
      const defaultLang = userProfile?.default_language || 'English';

      const styleGuidance = {
        direct: "Rewrite to be direct and straightforward while maintaining empathy.",
        indirect: "Rewrite with gentle, nuanced language that's considerate.",
        formal: "Rewrite in a professional, formal tone that's still warm.",
        informal: "Rewrite in a casual, friendly tone that's approachable.",
        balanced: "Rewrite with a balanced approach - clear but warm."
      };

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are "Empathy Mirror" — an AI empathy coach helping ${userName} (${userRole}) communicate more compassionately.

User's communication style: ${commStyle}
Preferred language: ${defaultLang}

ORIGINAL MESSAGE:
"${originalText}"

TASK: Rewrite with Empathy

Follow these rules:
1. Keep the EXACT same essential message and intent
2. Replace blame with "I feel" statements
3. Soften harsh or commanding language
4. Add understanding, openness, and warmth
5. Make it constructive, not accusatory
6. Sound natural and human (not corporate or robotic)
7. Match the approximate length
8. ${styleGuidance[commStyle]}
9. Respond in ${defaultLang}

IMPORTANT: Return ONLY the rewritten version as plain text. No explanations, no labels, just the empathetic rewrite.`,
      });

      const rewritten = typeof result === 'string' ? result : result.rewritten || result.toString();
      setRewrittenText(rewritten);

      const analysisResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Quick analysis: Rate empathy score (0-100) and detect emotion for: "${rewritten}"`,
        response_json_schema: {
          type: "object",
          properties: {
            emotion: { type: "string" },
            empathy_score: { type: "number" }
          }
        }
      });

      await base44.entities.AnalysisHistory.create({
        original_text: originalText,
        emotion: analysisResult.emotion || 'calm',
        empathy_score: analysisResult.empathy_score || 75,
        feedback: "Rewritten with empathy",
        rewritten_text: rewritten,
        was_speech: false
      });

      setCoachMessage(`✨ Beautiful, ${userName}! Notice how much kinder this version feels while saying the same thing.`);
    } catch (error) {
      console.error('Rewrite error:', error);
      setCoachMessage("Oops! Something went wrong. Please try again. 💫");
    }

    setIsRewriting(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const shareText = `Original: "${originalText}"\n\nRewritten with empathy: "${rewrittenText}"\n\n— Shared from Empathy Mirror`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Empathy Mirror - Rewritten Message',
          text: shareText,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (error) {
        copyToClipboard();
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const examples = [
    { 
      original: "You never listen to me.", 
      rewritten: "I feel unheard sometimes. Could we talk about ways to improve our communication?" 
    },
    { 
      original: "Your work has been terrible lately.", 
      rewritten: "I've noticed some challenges in recent projects. Can we discuss how I can better support you?" 
    },
    { 
      original: "Stop ignoring my messages!", 
      rewritten: "I've sent a few messages and haven't heard back. Is everything okay? I'd love to connect when you have time." 
    },
    {
      original: "I can't believe you did this again.",
      rewritten: "I'm feeling frustrated by this recurring situation. Can we work together to find a solution?"
    },
    {
      original: "You always make the same mistakes.",
      rewritten: "I've noticed this pattern happening. Let's discuss how we can approach this differently."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
            <Edit3 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
          Rewrite With Empathy
        </h1>
        <p className="text-[#94A3B8] max-w-2xl mx-auto">
          Transform any message to be more compassionate and emotionally intelligent. 
          Same meaning, kinder delivery. Supports multiple languages! 💛🌍
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Original Message */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-[#1E293B] border-2 border-indigo-500/20 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#E2E8F0]">
                  Original Message
                </h3>
                <span className="text-xs text-[#94A3B8] px-2 py-1 bg-[#0F172A] rounded border border-indigo-500/30">
                  Before
                </span>
              </div>
              <Textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste or type your message here... I'll help you make it more empathetic."
                className="min-h-[250px] text-base resize-none bg-[#0F172A] border-indigo-500/30 text-[#E2E8F0] placeholder:text-[#64748B] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={rewriteMessage}
                  disabled={!originalText.trim() || isRewriting}
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 hover:from-indigo-600 hover:via-purple-600 hover:to-emerald-500 text-white shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 ease-in-out rounded-xl py-6"
                >
                  {isRewriting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Rewriting With Empathy...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Rewrite With Empathy
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Rewritten Message */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`p-6 border-2 shadow-2xl transition-all duration-300 ease-in-out ${
            rewrittenText 
              ? 'bg-gradient-to-br from-[#1E293B] to-emerald-900/20 border-emerald-400/50 shadow-emerald-400/20' 
              : 'bg-[#1E293B] border-indigo-500/20'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#E2E8F0]">
                  Empathetic Version
                </h3>
                {rewrittenText && (
                  <div className="flex gap-2">
                    <span className="text-xs text-emerald-400 px-2 py-1 bg-emerald-400/10 rounded border border-emerald-400/30 font-medium">
                      After
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-xs text-[#94A3B8] hover:text-[#E2E8F0]"
                    >
                      {isEditing ? 'View' : 'Edit'}
                    </Button>
                  </div>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {rewrittenText ? (
                  isEditing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Textarea
                        value={rewrittenText}
                        onChange={(e) => setRewrittenText(e.target.value)}
                        className="min-h-[250px] text-base resize-none bg-[#0F172A] border-emerald-400/30 text-[#E2E8F0] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="min-h-[250px] p-4 bg-[#0F172A] rounded-lg border-2 border-emerald-400/30"
                    >
                      <p className="text-[#E2E8F0] leading-relaxed whitespace-pre-wrap">
                        {rewrittenText}
                      </p>
                    </motion.div>
                  )
                ) : (
                  <div className="min-h-[250px] flex items-center justify-center border-2 border-dashed border-indigo-500/30 rounded-lg">
                    <div className="text-center text-[#64748B]">
                      <ArrowRight className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Your rewritten message will appear here</p>
                      <p className="text-xs mt-2">You can edit it after rewriting</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {rewrittenText && (
                <div className="flex gap-2">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="w-full border-emerald-400/30 hover:bg-emerald-400/10 text-[#E2E8F0] rounded-xl transition-all duration-300 ease-in-out"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={shareResults}
                      variant="outline"
                      className="w-full border-indigo-400/30 hover:bg-indigo-400/10 text-[#E2E8F0] rounded-xl transition-all duration-300 ease-in-out"
                    >
                      {shared ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-indigo-400" />
                          Shared!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-[#1E293B] border border-violet-400/30">
          <h3 className="font-semibold text-[#E2E8F0] mb-4">
            ✨ Before & After Examples
          </h3>
          <div className="space-y-4">
            {examples.map((example, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-4 bg-[#0F172A] rounded-lg border border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => setOriginalText(example.original)}
              >
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-[#FB7185]">Before:</span>
                    <p className="text-sm text-[#94A3B8]">"{example.original}"</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-emerald-400">After:</span>
                    <p className="text-sm text-[#E2E8F0]">"{example.rewritten}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-[#64748B] mt-3 text-center">
            Click any example to try it yourself
          </p>
        </Card>
      </motion.div>

      <AICoachBubble message={coachMessage} />
    </div>
  );
}
