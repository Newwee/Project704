'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LandingPage } from '@/components/landing/LandingPage';
import { AuthModal } from '@/components/auth/AuthModal';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { AppHeader } from '@/components/navigation/AppHeader';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { MobileNavBar } from '@/components/navigation/MobileNavBar';
import { SwipeDeck } from '@/components/discovery/SwipeDeck';
import { LikesView } from '@/components/likes/LikesView';
import { ChatView } from '@/components/chat/ChatView';
import { ProfileView } from '@/components/profile/ProfileView';
import { MatchCelebrationModal } from '@/components/matches/MatchCelebrationModal';

export default function Home() {
  const { currentUser } = useApp();
  const [currentTab, setCurrentTab] = useState('discover');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [targetConvoId, setTargetConvoId] = useState<string | undefined>();

  // If user is undergoing onboarding flow
  if (isOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => {
          setIsOnboarding(false);
          setCurrentTab('discover');
        }}
        onCancel={currentUser ? () => setIsOnboarding(false) : undefined}
      />
    );
  }

  // If not logged in and not onboarding, show Landing Page
  if (!currentUser) {
    return (
      <>
        <LandingPage
          onStartRegister={() => setIsOnboarding(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onStartRegister={() => {
            setAuthModalOpen(false);
            setIsOnboarding(true);
          }}
        />
      </>
    );
  }

  // Logged-in full application layout
  return (
    <div className="min-h-screen bg-[#FFF9FA] dark:bg-[#111116] text-[#20202A] dark:text-[#F4F3F9] flex flex-col">
      {/* Sticky Top Header */}
      <AppHeader
        onNavigateToTab={(tab) => {
          setCurrentTab(tab);
        }}
        onOpenRegister={() => setIsOnboarding(true)}
      />

      {/* Main Body Layout: Desktop Sidebar + Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex overflow-hidden">
        {/* Left Desktop Sidebar */}
        <DesktopSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />

        {/* Central Content Canvas */}
        <main className="flex-1 pb-20 lg:pb-6 overflow-y-auto">
          {currentTab === 'discover' && (
            <div className="py-4 sm:py-6 px-3">
              <SwipeDeck />
            </div>
          )}

          {currentTab === 'likes' && <LikesView />}

          {currentTab === 'chat' && (
            <ChatView initialConversationId={targetConvoId} />
          )}

          {currentTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavBar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Global Realtime Match Celebration Modal */}
      <MatchCelebrationModal
        onNavigateToChat={(convoId) => {
          setTargetConvoId(convoId);
          setCurrentTab('chat');
        }}
      />
    </div>
  );
}
