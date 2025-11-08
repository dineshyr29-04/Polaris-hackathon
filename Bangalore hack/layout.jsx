import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Brain, 
  Mic, 
  Edit3, 
  MessageSquare, 
  Settings, 
  History,
  Heart,
  Home as HomeIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Landing"),
    icon: HomeIcon,
    description: "Main page"
  },
  {
    title: "Analyze Tone",
    url: createPageUrl("Home"),
    icon: Brain,
    description: "Emotional impact analysis"
  },
  {
    title: "Speech-to-Text",
    url: createPageUrl("Speech"),
    icon: Mic,
    description: "Voice tone analysis"
  },
  {
    title: "Rewrite",
    url: createPageUrl("Rewrite"),
    icon: Edit3,
    description: "Enhance with empathy"
  },
  {
    title: "Comment Mode",
    url: createPageUrl("Comment"),
    icon: MessageSquare,
    description: "Line-by-line feedback"
  },
  {
    title: "History",
    url: createPageUrl("History"),
    icon: History,
    description: "Past analyses"
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
    description: "Preferences"
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, x: -20, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 20, scale: 0.98 }
  };

  // Check if we're on the landing or login page
  const isLandingPage = location.pathname === createPageUrl('Landing') || location.pathname === '/' || currentPageName === 'Landing';
  const isLoginPage = location.pathname === createPageUrl('Login') || currentPageName === 'Login';

  // If on landing or login page, don't show sidebar
  if (isLandingPage || isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <style>{`
        body {
          background: #0F172A;
          min-height: 100vh;
        }

        .sidebar-glass {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(12px);
          border-right: 1px solid rgba(99, 102, 241, 0.2);
        }

        @media (max-width: 768px) {
          .sidebar-spacing {
            padding-left: 0 !important;
          }
        }

        @media (min-width: 769px) {
          .sidebar-spacing {
            padding-left: 1rem;
          }
        }

        .page-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="min-h-screen flex w-full bg-[#0F172A]">
        <Sidebar className="border-r-0 sidebar-glass shadow-2xl">
          <SidebarHeader className="border-b border-indigo-500/20 p-4 md:p-6">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div 
                className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
              </motion.div>
              <div>
                <h2 className="font-bold text-lg md:text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                  Empathy Mirror
                </h2>
                <p className="text-xs text-[#94A3B8] hidden md:block">
                  AI Emotional Coach
                </p>
              </div>
            </motion.div>
          </SidebarHeader>
          
          <SidebarContent className="p-2 md:p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-[#6366F1] uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item, idx) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          className={`rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
                            location.pathname === item.url 
                              ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-400/20 border border-indigo-500/50 shadow-lg shadow-indigo-500/20' 
                              : 'hover:bg-[#1E293B] border border-transparent hover:border-indigo-500/30'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2 md:py-3 w-full">
                            <motion.div 
                              className={`p-2 rounded-lg ${
                                location.pathname === item.url 
                                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg' 
                                  : 'bg-[#0F172A] group-hover:bg-gradient-to-br group-hover:from-indigo-500/50 group-hover:to-purple-500/50'
                              }`}
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <item.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium text-xs md:text-sm ${
                                location.pathname === item.url 
                                  ? 'text-[#E2E8F0]' 
                                  : 'text-[#94A3B8] group-hover:text-[#E2E8F0]'
                              } transition-colors duration-300`}>
                                {item.title}
                              </div>
                              <div className={`text-xs truncate hidden md:block ${
                                location.pathname === item.url 
                                  ? 'text-[#94A3B8]' 
                                  : 'text-[#64748B] group-hover:text-[#94A3B8]'
                              } transition-colors duration-300`}>
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-indigo-500/20 p-3 md:p-4">
            <div className="text-center text-xs text-[#64748B]">
              <p>© 2025 Empathy Mirror</p>
              <p className="mt-1">Built with <span className="text-[#66fcf1]">💙</span></p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col sidebar-spacing">
          <header className="bg-[#1E293B]/60 backdrop-blur-md border-b border-indigo-500/20 px-4 md:px-6 py-3 md:py-4 lg:hidden shadow-lg">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-indigo-500/20 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-base md:text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                Empathy Mirror
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-3 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}