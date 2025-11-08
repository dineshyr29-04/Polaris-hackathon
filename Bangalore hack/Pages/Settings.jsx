import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, User, Eye, Check, LogOut, MessageSquare, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    display_name: '',
    role: 'professional',
    communication_style: 'balanced',
    default_language: 'English',
    accessibility_high_contrast: false,
    accessibility_large_text: false,
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!user) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0] || null;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name || '',
        role: userProfile.role || 'professional',
        communication_style: userProfile.communication_style || 'balanced',
        default_language: userProfile.default_language || 'English',
        accessibility_high_contrast: userProfile.accessibility_high_contrast || false,
        accessibility_large_text: userProfile.accessibility_large_text || false,
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        display_name: user.full_name || user.email.split('@')[0],
      }));
    }
  }, [userProfile, user]);

  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.UserProfile.update(userProfile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = async () => {
    if (userProfile) {
      updateProfileMutation.mutate(formData);
    } else {
      createProfileMutation.mutate(formData);
    }
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Login'));
  };

  useEffect(() => {
    if (formData.accessibility_large_text) {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }

    if (formData.accessibility_high_contrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [formData.accessibility_high_contrast, formData.accessibility_large_text]);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 
    'Hindi', 'Bengali', 'Turkish', 'Polish', 'Ukrainian', 'Vietnamese',
    'Thai', 'Hebrew', 'Greek', 'Swedish', 'Norwegian', 'Danish', 'Finnish'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/50">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
          Settings & Preferences
        </h1>
        <p className="text-[#94A3B8] max-w-2xl mx-auto">
          Personalize your Empathy Mirror experience. ⚙️
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card className="p-6 bg-[#1E293B] border-2 border-indigo-500/20 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold text-[#E2E8F0]">
              Profile Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="display_name" className="text-[#E2E8F0]">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="How should we call you?"
                className="mt-2 bg-[#0F172A] border-indigo-500/30 text-[#E2E8F0]"
              />
              <p className="text-xs text-[#94A3B8] mt-1">
                This name will appear in your personalized coaching messages.
              </p>
            </div>

            <div>
              <Label htmlFor="role" className="text-[#E2E8F0]">Your Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="mt-2 bg-[#0F172A] border-indigo-500/30 text-[#E2E8F0]">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="educator">Educator</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[#94A3B8] mt-1">
                Helps us tailor feedback to your context.
              </p>
            </div>

            <div>
              <Label className="text-[#E2E8F0]">Email (Account)</Label>
              <Input
                value={user?.email || ''}
                disabled
                className="mt-2 bg-[#0F172A] border-indigo-500/20 text-[#94A3B8]"
              />
              <p className="text-xs text-[#94A3B8] mt-1">
                Your account email cannot be changed.
              </p>
            </div>
          </div>
        </Card>

        {/* Communication Preferences */}
        <Card className="p-6 bg-[#1E293B] border-2 border-purple-500/20 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-[#E2E8F0]">
              Communication Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="communication_style" className="text-[#E2E8F0]">Communication Style</Label>
              <Select
                value={formData.communication_style}
                onValueChange={(value) => setFormData({ ...formData, communication_style: value })}
              >
                <SelectTrigger className="mt-2 bg-[#0F172A] border-purple-500/30 text-[#E2E8F0]">
                  <SelectValue placeholder="Select your style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct - Straight to the point</SelectItem>
                  <SelectItem value="indirect">Indirect - Gentle and nuanced</SelectItem>
                  <SelectItem value="formal">Formal - Professional tone</SelectItem>
                  <SelectItem value="informal">Informal - Casual and friendly</SelectItem>
                  <SelectItem value="balanced">Balanced - Mix of all styles</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[#94A3B8] mt-1">
                AI feedback will match your preferred communication style.
              </p>
            </div>

            <div>
              <Label htmlFor="default_language" className="text-[#E2E8F0]">Default Language</Label>
              <Select
                value={formData.default_language}
                onValueChange={(value) => setFormData({ ...formData, default_language: value })}
              >
                <SelectTrigger className="mt-2 bg-[#0F172A] border-purple-500/30 text-[#E2E8F0]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-[#94A3B8] mt-1">
                AI will provide feedback in this language by default.
              </p>
            </div>
          </div>
        </Card>

        {/* Accessibility Section */}
        <Card className="p-6 bg-[#1E293B] border-2 border-emerald-500/20 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold text-[#E2E8F0]">
              Accessibility
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-emerald-500/30">
              <div>
                <Label htmlFor="high_contrast" className="text-base font-medium text-[#E2E8F0]">
                  High Contrast Mode
                </Label>
                <p className="text-sm text-[#94A3B8]">
                  Increase color contrast for better visibility
                </p>
              </div>
              <Switch
                id="high_contrast"
                checked={formData.accessibility_high_contrast}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, accessibility_high_contrast: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-emerald-500/30">
              <div>
                <Label htmlFor="large_text" className="text-base font-medium text-[#E2E8F0]">
                  Larger Text
                </Label>
                <p className="text-sm text-[#94A3B8]">
                  Increase default text size throughout the app
                </p>
              </div>
              <Switch
                id="large_text"
                checked={formData.accessibility_large_text}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, accessibility_large_text: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="p-6 bg-[#1E293B] border-2 border-red-500/20 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <LogOut className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-[#E2E8F0]">
              Account Actions
            </h2>
          </div>

          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-6"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1E293B] border-2 border-red-500/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#E2E8F0]">Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription className="text-[#94A3B8]">
                    You'll be redirected to the login page. Your data will be saved and available when you log back in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-[#0F172A] border-indigo-500/30 text-[#E2E8F0]">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                    Log Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-[#94A3B8] text-center">
              Logged in as: <span className="font-medium text-[#E2E8F0]">{user?.email}</span>
            </p>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl('Home'))}
            className="border-indigo-500/30 text-[#E2E8F0] hover:bg-indigo-500/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 hover:from-indigo-600 hover:via-purple-600 hover:to-emerald-500 text-white min-w-[120px] rounded-xl shadow-lg hover:shadow-indigo-500/50"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : createProfileMutation.isPending || updateProfileMutation.isPending ? (
              'Saving...'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}