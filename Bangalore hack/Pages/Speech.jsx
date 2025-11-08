import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ToneMeter from '../components/empathy/ToneMeter';
import AICoachBubble from '../components/empathy/AICoachBubble';
import EmotionVibeCard from '../components/empathy/EmotionVibeCard';
import EmpathySuggestions from '../components/empathy/EmpathySuggestions';

export default function Speech() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [coachMessage, setCoachMessage] = useState('');
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
  });

  useEffect(() => {
    if (userProfile) {
      setCoachMessage(`Ready to listen, ${userProfile.display_name}! 🎤 Speak naturally and I'll analyze your tone.`);
    } else {
      setCoachMessage("Click the microphone and speak your message. I'll transcribe and analyze your emotional tone. 🎙️");
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript(prev => prev + finalTranscript);
      };

      recognitionInstance.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        if (isRecording) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  }, [userProfile]);

  useEffect(() => {
    let interval;
    if (isRecording && recordingStartTime) {
      interval = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingStartTime]);

  const startRecording = () => {
    if (!recognition) return;
    
    setError('');
    setTranscript('');
    setAnalysis(null);
    setIsRecording(true);
    setRecordingStartTime(Date.now());
    setRecordingDuration(0);
    
    try {
      recognition.start();
      setCoachMessage("I'm listening... speak naturally! 👂");
    } catch (err) {
      setError('Could not start recording. Please refresh and try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recognition) return;
    
    setIsRecording(false);
    recognition.stop();
    
    if (transcript.trim()) {
      analyzeTranscript();
    }
  };

  const analyzeTranscript = async () => {
    if (!transcript.trim()) return;

    setIsAnalyzing(true);
    setCoachMessage("Analyzing your spoken message... 🔍");

    try {
      const userName = userProfile?.display_name || 'there';
      const userRole = userProfile?.role || 'user';

      const wordCount = transcript.trim().split(/\s+/).length;
      const wordsPerMinute = recordingDuration > 0 ? Math.round((wordCount / recordingDuration) * 60) : 0;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are "Empathy Mirror" — an emotionally intelligent AI specializing in analyzing SPOKEN communication.

User context: ${userName} (${userRole})

VOICE METADATA:
- Recording duration: ${recordingDuration} seconds
- Word count: ${wordCount} words
- Speech speed: ${wordsPerMinute} words per minute
- Delivery: ${wordsPerMinute > 160 ? 'Fast-paced' : wordsPerMinute > 120 ? 'Normal pace' : 'Slow/deliberate'}

SPOKEN TRANSCRIPT:
"${transcript}"

TASK: Perform comprehensive speech analysis:

### Step 1 — Tone & Mood Detection
Analyze as NATURAL SPOKEN LANGUAGE (not written text).
Consider speech patterns and conversational tone.
Classify using ONE label: "😊 Calm", "😡 Frustrated", "😢 Sad", "😐 Neutral", "😃 Friendly", "🤩 Excited", "😰 Anxious", "🛡️ Defensive"
Provide emotion color hex code.

### Step 2 — Vibe Analysis (Speech-Specific)
Based on speech speed and delivery pattern, describe the speaker's energy:
- High energy and confident
- Soft but slightly anxious
- Flat and lacks warmth
- Rushed and intense
- Calm and measured

### Step 3 — Receiver Perception
How might the listener perceive this SPOKEN message?

### Step 4 — Empathy Score & Suggestions
Score 0-100 and provide 3 actionable suggestions with emojis.

### Step 5 — Language & Confidence
Detect language and confidence score.

Return JSON:
{
  "emotion_label": "😊 Calm",
  "emotion_color": "#4ade80",
  "vibe_summary": "Your energy is high and confident",
  "receiver_reaction": "How listener might feel...",
  "empathy_score": 75,
  "empathy_suggestions": ["💬 Tip 1", "💡 Tip 2", "🌿 Tip 3"],
  "confidence_score": 0.87,
  "detected_language": "English",
  "reflection_question": "Would you like to hear how this sounds from the receiver's side?"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            emotion_label: { type: "string" },
            emotion_color: { type: "string" },
            vibe_summary: { type: "string" },
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
        original_text: transcript,
        emotion: emotion,
        empathy_score: result.empathy_score,
        feedback: result.receiver_reaction,
        was_speech: true
      });

      setCoachMessage(result.reflection_question || `Analysis complete! 🌟`);
    } catch (error) {
      console.error('Analysis error:', error);
      setCoachMessage("Oops! Couldn't analyze. Please try again. 💫");
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
            <Mic className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
          Speech-to-Text Analysis
        </h1>
        <p className="text-[#94A3B8] max-w-2xl mx-auto">
          Speak your message aloud and I'll transcribe it, then analyze the emotional tone and delivery. 
          Perfect for practicing conversations! 🎙️
        </p>
      </motion.div>

      {error && (
        <Alert variant="destructive" className="bg-[#FB7185]/10 border-[#FB7185]/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-8 bg-[#1E293B] border-2 border-indigo-500/20 shadow-2xl">
            <div className="flex flex-col items-center gap-6">
              <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing || !recognition}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isRecording 
                    ? 'bg-gradient-to-br from-[#FB7185] to-red-600 shadow-2xl shadow-[#FB7185]/50 animate-pulse' 
                    : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 hover:shadow-2xl hover:shadow-indigo-500/50'
                } ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={!isRecording && recognition ? { scale: 1.05 } : {}}
                whileTap={!isRecording && recognition ? { scale: 0.95 } : {}}
              >
                {isRecording ? (
                  <MicOff className="w-16 h-16 text-white" />
                ) : (
                  <Mic className="w-16 h-16 text-white" />
                )}
              </motion.button>

              <div className="text-center">
                {isRecording ? (
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-[#FB7185]">
                      Recording... {recordingDuration}s
                    </p>
                    <p className="text-sm text-[#94A3B8]">
                      Click to stop and analyze
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-[#E2E8F0]">
                      Ready to Listen
                    </p>
                    <p className="text-sm text-[#94A3B8]">
                      Click the microphone to start
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <AnimatePresence>
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-6 bg-[#1E293B] border border-indigo-500/20">
                  <h3 className="font-semibold text-[#E2E8F0] mb-3">
                    Transcript:
                  </h3>
                  <p className="text-[#94A3B8] leading-relaxed">
                    {transcript}
                  </p>
                  
                  {!isRecording && !isAnalyzing && !analysis && (
                    <Button
                      onClick={analyzeTranscript}
                      className="w-full mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 hover:from-indigo-600 hover:via-purple-600 hover:to-emerald-500 rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 ease-in-out"
                    >
                      Analyze This Transcript
                    </Button>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {isAnalyzing && (
            <Card className="p-8 bg-[#1E293B] flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-3" />
                <p className="text-[#94A3B8]">Analyzing your tone...</p>
              </div>
            </Card>
          )}

          {analysis && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <EmotionVibeCard 
                emotionLabel={analysis.emotion_label}
                emotionColor={analysis.emotion_color}
                receiverReaction={analysis.receiver_reaction}
                vibeSummary={analysis.vibe_summary}
                detectedLanguage={analysis.detected_language}
                confidenceScore={analysis.confidence_score}
              />

              <Card className="p-6 bg-[#1E293B] border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                <ToneMeter 
                  empathyScore={analysis.empathy_score} 
                  emotion={analysis.emotion_label.split(' ')[1] || 'neutral'}
                />
              </Card>

              <EmpathySuggestions suggestions={analysis.empathy_suggestions} />
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-[#1E293B] border border-emerald-400/30">
            <h3 className="font-semibold text-[#E2E8F0] mb-3">
              🎤 Speech Tips
            </h3>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Speak clearly and naturally</motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Pause between sentences</motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Notice your vocal energy</motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Practice difficult conversations</motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors duration-300 hover:text-[#E2E8F0]">• Try different phrasings</motion.li>
            </ul>
          </Card>

          <Card className="p-6 bg-[#1E293B] border border-violet-400/30">
            <h3 className="font-semibold text-[#E2E8F0] mb-3">
              💭 What We Analyze
            </h3>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>✓ Speech speed & pacing</li>
              <li>✓ Emotional tone & mood</li>
              <li>✓ Delivery energy level</li>
              <li>✓ Empathy & warmth</li>
              <li>✓ Receiver's perspective</li>
            </ul>
          </Card>
        </div>
      </div>

      <AICoachBubble message={coachMessage} />
    </div>
  );
}