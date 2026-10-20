/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, PriceAlert, UserProfile } from './types/market';
import { STOCKS_DATA } from './data/mockData';
import { HomePage } from './components/home/HomePage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StockDetailsView } from './components/stock/StockDetailsView';
import { DashboardView } from './components/dashboard/DashboardView';
import { StockScreenerView } from './components/screener/StockScreenerView';
import { TradingTerminalView } from './components/terminal/TradingTerminalView';
import { ForexTerminalView } from './components/forex/ForexTerminalView';
import { TradingJournalView } from './components/journal/TradingJournalView';
import { RiskRewardCalculatorView } from './components/calculator/RiskRewardCalculatorView';
import { ImpactedNewsView } from './components/news/ImpactedNewsView';
import { SettingsView } from './components/settings/SettingsView';
import { MarketChartsView } from './components/tradingview/MarketChartsView';
import { CommandPalette } from './components/modals/CommandPalette';
import { AlertModal } from './components/modals/AlertModal';
import { NotificationsDrawer, NotificationItem } from './components/modals/NotificationsDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/auth/UserProfileModal';

export default function App() {
  // Navigation: defaults to 'home' landing page or hash if present
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'login', 'register', 'forgot-password', 'market-charts'].includes(hash)) {
        return hash as ScreenId;
      }
    }
    return 'home';
  });

  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('RELIANCE');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS', 'HDFCBANK']);
  
  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('marketpulse_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return null;
  });

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Technical & Fundamental Notifications (No orders)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Price Alert Triggered',
      message: 'RELIANCE crossed above ₹2,980.00 (Current: ₹2,984.50).',
      time: '14:48 IST',
      read: false,
      type: 'alert',
    },
    {
      id: 'notif-2',
      title: 'RBI Monetary Policy Catalyst',
      message: 'Repo rate held at 6.50% with neutral stance; Banking sector margins intact.',
      time: '12:00 IST',
      read: false,
      type: 'news',
    },
    {
      id: 'notif-3',
      title: 'Earnings Disclosure: TCS Q2',
      message: 'TCS reports 8.2% YoY net profit growth; Operating margin solid at 24.8%.',
      time: '09:30 IST',
      read: false,
      type: 'news',
    },
  ]);

  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'login', 'register', 'forgot-password', 'market-charts'].includes(hash)) {
        setCurrentScreen(hash as ScreenId);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (screen: ScreenId) => {
    const publicScreens: ScreenId[] = ['home', 'login', 'register', 'forgot-password'];
    const requiresAuthentication = !publicScreens.includes(screen);

    if (requiresAuthentication && !user) {
      setToastMessage('Please log in or sign up to access the dashboard.');
      setCurrentScreen('login');
      window.location.hash = 'login';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (publicScreens.includes(screen)) {
      window.location.hash = screen;
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Auth Handlers
  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    if (mode === 'signup') {
      navigateTo('register');
    } else {
      navigateTo('login');
    }
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    try {
      localStorage.setItem('marketpulse_user', JSON.stringify(loggedInUser));
    } catch {
      // Ignore
    }
    navigateTo('market-charts');
    showToast(`Welcome to Smart Market, ${loggedInUser.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('marketpulse_user');
    } catch {
      // Ignore
    }
    navigateTo('login');
    showToast('Signed out of terminal session. Please sign in to resume.');
  };


  // Global keybindings (Search, Alert)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAlertModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStockSymbol]);

  // Current selected stock object
  const currentStock = STOCKS_DATA[selectedStockSymbol] || STOCKS_DATA.RELIANCE;

  // Watchlist toggle handler
  const handleToggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter(s => s !== symbol));
      showToast(`${symbol} removed from Watchlist`);
    } else {
      setWatchlist([...watchlist, symbol]);
      showToast(`${symbol} added to Watchlist`);
    }
  };

  const handleSetAlert = (newAlert: PriceAlert) => {
    setAlerts([...alerts, newAlert]);
    showToast(`Price Alert armed for ${newAlert.symbol} at ₹${newAlert.targetPrice.toFixed(2)}`);
  };

  const handleOpenStockDetails = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    navigateTo('stock-details');
  };

  const handleGetStarted = () => {
    if (!user) {
      navigateTo('login');
      return;
    }
    navigateTo('dashboard');
    showToast('Smart Market dashboard loaded');
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-white px-4 py-2.5 rounded-lg shadow-xl font-mono-xs text-mono-xs font-bold flex items-center gap-2 border border-primary/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toastMessage}
        </div>
      )}

      {/* 1. Dedicated Full-Screen Login Webpage */}
      {currentScreen === 'login' ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
        />
      ) : currentScreen === 'register' ? (
        /* 2. Dedicated Full-Screen Register Webpage */
        <RegisterPage
          onRegisterSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
        />
      ) : currentScreen === 'forgot-password' ? (
        /* 3. Dedicated Full-Screen Forgot Password Webpage */
        <ForgotPasswordPage
          onNavigate={navigateTo}
        />
      ) : currentScreen === 'home' ? (
        /* 4. High-Impact Landing Home Page */
        <HomePage
          onGetStarted={handleGetStarted}
          onNavigateToSection={navigateTo}
          onSelectStock={handleOpenStockDetails}
          user={user}
          onOpenAuth={handleOpenAuth}
        />
      ) : (
        /* 5. Institutional Workstation Layout (Header + Sidebar + Active View) */
        <>
          {/* Top Header */}
          <Header
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            onOpenSearch={() => setIsCommandPaletteOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadCount={notifications.filter(n => !n.read).length}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            user={user}
            onOpenAuth={() => navigateTo('login')}
            onOpenUserProfile={() => setIsProfileModalOpen(true)}
          />

          {/* Left Sidebar */}
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            user={user}
          />

          {/* Main Content Area */}
          <div className={`transition-all duration-200 flex-1 flex flex-col ${sidebarOpen ? 'lg:pl-[260px]' : 'pl-0'}`}>
            <main className="w-full pt-[105px] pb-10 bg-surface px-space-md min-h-screen flex-1">
              {/* Flagship TradingView Market Charts Section */}
              {currentScreen === 'market-charts' && (
                <MarketChartsView />
              )}

              {/* Technical & Fundamental Stock Deep Dive */}
              {currentScreen === 'stock-details' && (
                <StockDetailsView
                  stock={currentStock}
                  onOpenAlertModal={() => setIsAlertModalOpen(true)}
                  isWatchlisted={watchlist.includes(selectedStockSymbol)}
                  onToggleWatchlist={() => handleToggleWatchlist(selectedStockSymbol)}
                  onSelectStock={handleOpenStockDetails}
                />
              )}

              {/* Market Breadth & Indices Dashboard */}
              {currentScreen === 'dashboard' && (
                <DashboardView
                  onSelectStock={handleOpenStockDetails}
                />
              )}

              {/* Technical Stock Screener */}
              {(currentScreen === 'stock-screener' || currentScreen === 'indian-stocks') && (
                <StockScreenerView
                  onSelectStock={handleOpenStockDetails}
                />
              )}

              {/* Level-2 Order Flow & Market Depth */}
              {currentScreen === 'indian-market-terminal' && (
                <TradingTerminalView
                  onSelectStock={handleOpenStockDetails}
                />
              )}

              {/* Forex & Currency Technicals */}
              {(currentScreen === 'forex' || currentScreen === 'forex-terminal') && (
                <ForexTerminalView />
              )}

              {/* Indices & Sector Breadth */}
              {currentScreen === 'indices-and-sectors' && (
                <DashboardView
                  onSelectStock={handleOpenStockDetails}
                />
              )}

              {/* Research & Setup Notes Journal */}
              {currentScreen === 'trading-journal' && (
                <TradingJournalView />
              )}

              {/* Technical Risk & Position Calculator */}
              {currentScreen === 'risk-reward-calculator' && (
                <RiskRewardCalculatorView />
              )}

              {/* Fundamental Impacted News & Macro Feed */}
              {currentScreen === 'impacted-news' && (
                <ImpactedNewsView onSelectStock={handleOpenStockDetails} />
              )}

              {/* Workstation Settings */}
              {(currentScreen === 'settings' || currentScreen === 'help-and-support') && (
                <SettingsView />
              )}
            </main>

            {/* Global Institutional Footer */}
            <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-2.5 px-space-md flex flex-wrap items-center justify-between gap-space-sm shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="font-mono-xs text-mono-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  ← Home Landing Page
                </button>
                <span className="text-outline">·</span>
                <p className="font-mono-xs text-mono-xs text-outline">
                  Smart Market Trading · Precision Technical Analysis &amp; Currency Research.
                </p>
              </div>
              <div className="flex items-center gap-space-md font-mono-xs text-mono-xs text-outline">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Live Liquidity Feed
                </span>
                <span>TradingView Embed Active</span>
                <span>UTC+00:00</span>
                <span className="text-primary font-bold">Smart Market Dark Theme</span>
              </div>
            </footer>
          </div>
        </>
      )}

      {/* Global Command Palette & Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectStock={handleOpenStockDetails}
        onNavigate={navigateTo}
      />

      <AlertModal
        stock={currentStock}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSetAlert={handleSetAlert}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearAll={() => setNotifications([])}
      />

      {/* Authentication Modal (for in-page quick prompts if needed) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalMode}
      />

      {/* User Profile Modal */}
      {user && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
