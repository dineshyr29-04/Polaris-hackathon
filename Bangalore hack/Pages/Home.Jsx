
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Brain, Loader2, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ToneMeter from '../components/empathy/ToneMeter';
import FeedbackCard from '../components/empathy/FeedbackCard';
import AICoachBubble from '../components/empathy/AICoachBubble';
import EmotionVibeCard from '../components/empathy/EmotionVibeCard';
import EmpathySuggestions from '../components/empathy/EmpathySuggestions';

export default function Home() {
  const location = useLocation();
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coachMessage, setCoachMessage] = useState('');

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
      setInputText(location.state.prefilledText);
    }
  }, [location.state]);

  useEffect(() => {
    if (userProfile) {
      setCoachMessage(`Welcome back, ${userProfile.display_name}! 💙 Let's reflect together on your message.`);
    } else {
      setCoachMessage("Hi! I'm your empathy mirror. Paste or type your message, and I'll reflect your tone back to you. ✨");
    }
  }, [userProfile]);

  const analyzeMessage = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const userName = userProfile?.display_name || 'there';
      const userRole = userProfile?.role || 'user';
      const commStyle = userProfile?.communication_style || 'balanced';
      const defaultLang = userProfile?.default_language || 'English';

      const styleGuidance = {
        direct: "Be straightforward and to the point in your feedback.",
        indirect: "Use gentle, nuanced language in your suggestions.",
        formal: "Maintain a professional, formal tone in your analysis.",
        informal: "Keep the feedback casual and friendly.",
        balanced: "Balance directness with warmth in your feedback."
      };

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are "Empathy Mirror" — an emotionally intelligent AI designed to help users reflect on their communication tone, empathy, and clarity.

User context: ${userName} (${userRole})
Communication style preference: ${commStyle} - ${styleGuidance[commStyle]}
Preferred language: ${defaultLang}

MESSAGE TO ANALYZE:
"${inputText}"

TASK: Perform a comprehensive empathy analysis following these steps:

### Step 1 — Tone & Mood Detection
Analyze word choice, punctuation, and emotional content.
Classify the emotional tone using ONE main label from:
"😊 Calm", "😡 Frustrated", "😢 Sad", "😐 Neutral", "😃 Friendly", "🤩 Excited", "😰 Anxious", "🛡️ Defensive"

Provide a color hex code that represents this emotion.

### Step 2 — Receiver Perception
Explain in 1-2 sentences how the receiver might perceive this message.
Match the ${commStyle} communication style.

### Step 3 — Empathy Score
Rate the message's empathy level from 0-100, where:
- 0-30: Harsh, blaming, or cold
- 31-60: Neutral but could be warmer
- 61-100: Empathetic, constructive, and warm

### Step 4 — Empathy Suggestions
Provide 3 short, actionable suggestions to improve empathy.
Each suggestion should be prefixed with an emoji (💬, 💡, ✅, 🌿, etc.)
Tailor suggestions to ${userName}'s ${commStyle} style.

### Step 5 — Confidence & Language
Detect the language of the message and provide a confidence score (0-1) for your analysis.

Return response in this exact JSON structure (respond in ${defaultLang}):
{
  "emotion_label": "😊 Calm",
  "emotion_color": "#4ade80",
  "receiver_reaction": "How the receiver might feel...",
  "empathy_score": 75,
  "empathy_suggestions": [
    "💬 Suggestion 1",
    "💡 Suggestion 2", 
    "🌿 Suggestion 3"
  ],
  "confidence_score": 0.87,
  "detected_language": "English",
  "reflection_question": "Would you like me to rewrite that more warmly, ${userName}?"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            emotion_label: { type: "string" },
            emotion_color: { type: "string" },
            receiver_reaction: { type: "string" },
            empathy_score: { type: "number" },
            empathy_suggestions: { 
              type: "array",
              items: { type: "string" }
            },
            confidence_score: { type: "number" },
            detected_language: { type: "string" },
            reflection_question: { type: "string" }
          }
        }
      });

      setAnalysis(result);

      const emotion = result.emotion_label.split(' ')[1] || 'neutral';
      await base44.entities.AnalysisHistory.create({
        original_text: inputText,
        emotion: emotion,
        empathy_score: result.empathy_score,
        feedback: result.receiver_reaction,
        was_speech: false
      });

      setCoachMessage(result.reflection_question || `Great work reflecting on your message, ${userName}! 🌟`);
    } catch (error) {
      console.error('Analysis error:', error);
      setCoachMessage("Oops! Something went wrong. Please try again. 💫");
    }

    setIsAnalyzing(false);
  };

  const examples = [
    "You never listen to me.",
    "I'm disappointed by your work lately.",
    "Can we talk? I've been feeling unheard.",
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 md:space-y-4 px-2"
      >
        <motion.div 
          className="flex items-center justify-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
            <Brain className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
        </motion.div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
          Analyze Your Message's Tone
        </h1>
        <p className="text-sm md:text-base text-[#94A3B8] max-w-2xl mx-auto">
          Type or paste any message, and I'll help you understand its emotional impact. 
          Together, we can make communication more compassionate. 💬
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left: Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 md:p-6 bg-[#1E293B] border-2 border-indigo-500/20 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold bg-gradient-to-r from-indigo-500 to-emerald-400 bg-clip-text text-transparent mb-2">
                    Your Message
                  </label>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or paste your message here... I support many languages! 🌍"
                    className="min-h-[180px] md:min-h-[200px] text-base resize-none bg-[#0F172A] border-indigo-500/30 text-[#E2E8F0] placeholder:text-[#64748B] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={analyzeMessage}
                    disabled={!inputText.trim() || isAnalyzing}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 hover:from-indigo-600 hover:via-purple-600 hover:to-emerald-500 text-white shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 ease-in-out text-base md:text-lg py-5 md:py-6 rounded-xl"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Tone...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze Tone & Empathy
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Examples */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 md:p-5 bg-[#1E293B] border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-[#E2E8F0]">
                  Try These Examples:
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setInputText(example)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 bg-[#0F172A] rounded-xl text-xs md:text-sm text-[#94A3B8] hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 hover:text-[#E2E8F0] transition-all border border-indigo-500/30 hover:border-indigo-500/50 shadow-md hover:shadow-lg hover:shadow-indigo-500/20 ease-in-out duration-300"
                  >
                    "{example}"
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Analysis Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <EmotionVibeCard 
                emotionLabel={analysis.emotion_label}
                emotionColor={analysis.emotion_color}
                receiverReaction={analysis.receiver_reaction}
                detectedLanguage={analysis.detected_language}
                confidenceScore={analysis.confidence_score}
              />

              <Card className="p-4 md:p-6 bg-[#1E293B] border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                <ToneMeter 
                  empathyScore={analysis.empathy_score} 
                  emotion={analysis.emotion_label.split(' ')[1] || 'neutral'}
                />
              </Card>

              <EmpathySuggestions suggestions={analysis.empathy_suggestions} />
            </motion.div>
          )}
        </div>

        {/* Right: Tips & Stats */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-5 md:p-6 bg-[#1E293B] border border-emerald-400/30 hover:shadow-xl hover:shadow-emerald-400/20 transition-all duration-300 ease-in-out">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#E2E8F0] text-base">
                  💡 How It Works
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-[#94A3B8]">
                <motion.li 
                  className="flex items-start gap-2 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-emerald-400 mt-0.5 text-lg">✓</span>
                  <span className="group-hover:text-[#E2E8F0] transition-colors duration-300">Detects emotional tone & mood</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-2 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-emerald-400 mt-0.5 text-lg">✓</span>
                  <span className="group-hover:text-[#E2E8F0] transition-colors duration-300">Shows receiver's perspective</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-2 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-emerald-400 mt-0.5 text-lg">✓</span>
                  <span className="group-hover:text-[#E2E8F0] transition-colors duration-300">Provides empathy suggestions</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-2 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-emerald-400 mt-0.5 text-lg">✓</span>
                  <span className="group-hover:text-[#E2E8F0] transition-colors duration-300">Supports multiple languages 🌍</span>
                </motion.li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-5 md:p-6 bg-[#1E293B] border border-violet-400/30 hover:shadow-xl hover:shadow-violet-400/20 transition-all duration-300 ease-in-out">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#E2E8F0] text-base">
                  🎯 Quick Tips
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Use "I feel" instead of "You never"</motion.li>
                <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Ask questions rather than accuse</motion.li>
                <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Express needs, not blame</motion.li>
                <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Take a breath before sending</motion.li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>

      <AICoachBubble message={coachMessage} />
    </div>
  );
}
