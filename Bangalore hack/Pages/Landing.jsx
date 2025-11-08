import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Brain, Edit3, Mic, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "Tone Analyzer",
      description: "Understand how your message feels to others with AI-powered emotional analysis",
      color: "#66fcf1"
    },
    {
      icon: Edit3,
      title: "Empathy Rewriter",
      description: "Transform harsh messages into kind, constructive communication",
      color: "#a8dadc"
    },
    {
      icon: Mic,
      title: "Vibe Detector",
      description: "Analyze your speech patterns and vocal tone for better conversations",
      color: "#f1c40f"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Write",
      description: "Type or speak your message in any language",
      icon: "✍️"
    },
    {
      number: "02",
      title: "Analyze",
      description: "Get instant feedback on tone, empathy, and emotional impact",
      icon: "🔍"
    },
    {
      number: "03",
      title: "Rewrite",
      description: "Transform your message with AI-powered empathy suggestions",
      icon: "✨"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c10] via-[#1f2833] to-[#0b0c10] text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#66fcf1] to-[#45a29e] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#66fcf1]/50">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-[#66fcf1] to-white bg-clip-text text-transparent">
              Empathy Mirror
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            AI-Powered Communication Coach
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Reflect on your communication tone and empathy. Write or speak naturally, 
            and let AI help you communicate with more warmth and understanding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={createPageUrl('Home')}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-[#66fcf1] to-[#45a29e] hover:from-[#45a29e] hover:to-[#66fcf1] text-[#0b0c10] rounded-xl shadow-2xl shadow-[#66fcf1]/50 transition-all duration-300">
                  Try It Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
            
            <Link to={createPageUrl('Login')}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="px-8 py-6 text-lg font-semibold border-2 border-[#66fcf1] text-[#66fcf1] hover:bg-[#66fcf1]/10 rounded-xl transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg">Three simple steps to better communication</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="p-8 bg-[#1f2833] border-2 border-[#66fcf1]/20 hover:border-[#66fcf1]/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#66fcf1]/20 transition-all duration-300">
                <div className="text-6xl mb-4">{step.icon}</div>
                <div className="text-5xl font-bold text-[#66fcf1] mb-3">{step.number}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Empathy Matters */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-12 bg-gradient-to-br from-[#1f2833] to-[#0b0c10] border-2 border-[#66fcf1]/30 rounded-3xl shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Why Empathy <span className="text-[#66fcf1]">Matters</span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Words carry emotional weight. How we say something often matters more than what we say. 
                  Empathy Mirror helps you see your messages through others' eyes, creating stronger, 
                  more meaningful connections.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#66fcf1]" />
                    <span className="text-gray-300">Build stronger relationships</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#66fcf1]" />
                    <span className="text-gray-300">Reduce misunderstandings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#66fcf1]" />
                    <span className="text-gray-300">Express yourself clearly</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-64 h-64 bg-gradient-to-br from-[#66fcf1]/20 to-[#45a29e]/20 rounded-full flex items-center justify-center shadow-2xl shadow-[#66fcf1]/30"
                >
                  <Heart className="w-32 h-32 text-[#66fcf1]" strokeWidth={1.5} />
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-lg">Everything you need for empathetic communication</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.03 }}
            >
              <Card 
                className="p-8 bg-[#1f2833] border-2 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                style={{
                  borderColor: `${feature.color}40`,
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${feature.color}15, transparent 70%)`
                  }}
                />
                <div className="relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`
                    }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-12 md:p-16 bg-gradient-to-br from-[#66fcf1]/10 via-[#45a29e]/10 to-[#66fcf1]/10 border-2 border-[#66fcf1] rounded-3xl shadow-2xl shadow-[#66fcf1]/30 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#66fcf1]/5 via-transparent to-[#66fcf1]/5"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="relative z-10">
              <Sparkles className="w-16 h-16 text-[#66fcf1] mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Start Your Journey Today
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of people improving their communication skills with AI-powered empathy coaching.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl('Login')}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="px-10 py-7 text-xl font-bold bg-gradient-to-r from-[#66fcf1] to-[#45a29e] hover:from-[#45a29e] hover:to-[#66fcf1] text-[#0b0c10] rounded-xl shadow-2xl shadow-[#66fcf1]/50 transition-all duration-300">
                      Get Started Free
                      <Sparkles className="ml-2 w-6 h-6" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#66fcf1]/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Empathy Mirror | Built with <span className="text-[#66fcf1]">💙</span> for better communication
          </p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        h1, h2, h3 {
          font-weight: 700;
        }
        
        p, span {
          font-weight: 400;
        }
        
        button {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}