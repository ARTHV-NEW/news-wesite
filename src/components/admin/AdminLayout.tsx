import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, Layers, Tag, 
  AlertOctagon, LayoutTemplate, MessageSquare, Users, Megaphone, 
  Search, Settings, History, Bell, HelpCircle, Edit3, LogOut, 
  ChevronRight, ChevronDown, Home, Mail, BarChart3, Globe, 
  Sparkles, Download, Database, Menu as MenuIcon, X
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import ArticleManager from './ArticleManager';
import MenuManager from './MenuManager';
import MediaManager from './MediaManager';
import PageManager from './PageManager';
import AdManager from './AdManager';
import CategoryManager from './CategoryManager';
import TagManager from './TagManager';
import ReaderManager from './ReaderManager';
import SettingsManager from './SettingsManager';
import { useAuth } from '../../AuthContext';

// Import newly designed interactive manager views
import {
  AuthorsManager,
  HomepageBuilderManager,
  UserManager,
  CommentManager,
  NewsletterManager,
  AnalyticsManager,
  SeoManager,
  NotificationManager,
  AiAssistantManager,
  ImportExportManager,
  ActivityLogManager,
  BackupManager
} from './PlaceholderManagers';

export default function AdminLayout() {
  const { logout, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Collapsible section states (collapsed by default for deeper settings/tools to save space)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    Content: false,
    Homepage: false,
    Audience: false,
    Marketing: true,
    Tools: true,
  });

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const menuStructure = [
    {
      title: 'Dashboard',
      collapsible: false,
      items: [
        { name: 'Dashboard', key: 'Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Content',
      collapsible: true,
      items: [
        { name: 'Articles', key: 'Articles', icon: FileText },
        { name: 'Pages', key: 'Pages', icon: FileText },
        { name: 'Categories', key: 'Categories', icon: Layers },
        { name: 'Tags', key: 'Tags', icon: Tag },
        { name: 'Media', key: 'Media', icon: ImageIcon },
        { name: 'Authors', key: 'Authors', icon: Users },
      ]
    },
    {
      title: 'Homepage',
      collapsible: true,
      items: [
        { name: 'Homepage Builder', key: 'Homepage Builder', icon: Home },
        { name: 'Menus', key: 'Menu', icon: LayoutTemplate },
      ]
    },
    {
      title: 'Audience',
      collapsible: true,
      items: [
        { name: 'Users', key: 'Users', icon: Users },
        { name: 'Readers', key: 'Readers', icon: Users },
        { name: 'Comments', key: 'Comments', icon: MessageSquare },
        { name: 'Newsletter', key: 'Newsletter', icon: Mail },
      ]
    },
    {
      title: 'Marketing',
      collapsible: true,
      items: [
        { name: 'Ads', key: 'Ads', icon: Megaphone },
        { name: 'Analytics', key: 'Analytics', icon: BarChart3 },
        { name: 'SEO', key: 'SEO', icon: Globe },
        { name: 'Notifications', key: 'Notifications', icon: Bell },
      ]
    },
    {
      title: 'Tools',
      collapsible: true,
      items: [
        { name: 'AI Assistant', key: 'AI Assistant', icon: Sparkles },
        { name: 'Import/Export', key: 'Import/Export', icon: Download },
        { name: 'Activity Logs', key: 'Activity Logs', icon: History },
        { name: 'Backups', key: 'Backups', icon: Database },
      ]
    }
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full bg-white select-none">
      <div className="overflow-y-auto flex-1 py-4">
        {/* Logo Area */}
        <div className="h-14 flex items-center px-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8232c] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-black text-lg text-gray-900 tracking-tight leading-none">Pulse Editorial</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Newsroom CMS</p>
            </div>
          </div>
        </div>

        {/* Navigation Structure */}
        <div className="space-y-4 px-4">
          {menuStructure.map((section) => {
            const isCollapsed = collapsedSections[section.title];
            return (
              <div key={section.title} className="space-y-1">
                {/* Section Header */}
                {section.collapsible ? (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-black tracking-widest text-gray-400 uppercase hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <span>{section.title}</span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" />
                    )}
                  </button>
                ) : (
                  <div className="px-3 py-1.5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    {section.title}
                  </div>
                )}

                {/* Section Items */}
                {(!section.collapsible || !isCollapsed) && (
                  <nav className="space-y-0.5 transition-all duration-200">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            setActiveTab(item.key);
                            setIsMobileSidebarOpen(false); // Auto-close drawer on mobile
                          }}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                            isActive 
                              ? 'bg-red-50/50 text-red-700 shadow-sm border-l-2 border-[#c8232c] pl-4 font-bold' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:pl-4'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-900'}`} />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Settings Bar */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={() => {
            setActiveTab('Settings');
            setIsMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all duration-150 ${
            activeTab === 'Settings'
              ? 'bg-red-50/50 text-red-700 shadow-sm border-l-2 border-[#c8232c] font-bold'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'Settings' ? 'text-red-600' : 'text-gray-400'}`} />
          Settings Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50/50 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:block w-64 border-r border-gray-200 shrink-0 h-full bg-white">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer Body */}
          <aside className="relative w-64 bg-white h-full flex flex-col border-r border-gray-200 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Close Button Inside Drawer */}
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
          {/* Left Area: Mobile Menu Toggle & Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles, authors, metrics..."
                className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-xs transition-colors"
              />
            </div>
          </div>
          
          {/* Right Header Controls */}
          <div className="flex items-center gap-2 lg:gap-4 ml-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="hidden sm:block p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
            
            <button 
              onClick={() => setActiveTab('Articles')}
              className="flex items-center gap-1.5 bg-[#c8232c] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#a01c23] transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">New Story</span>
            </button>
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            
            {/* User Dropdown */}
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity relative group cursor-pointer">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-xs">
                  <span className="text-gray-500 text-xs font-black uppercase">ED</span>
                </div>
              )}
              {/* Simple logout dropdown on hover */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100 z-50">
                <div className="py-1">
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-gray-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50/30">
          {activeTab === 'Dashboard' && <AdminDashboard />}
          {activeTab === 'Articles' && <ArticleManager />}
          {activeTab === 'Menu' && <MenuManager />}
          {activeTab === 'Media' && <MediaManager />}
          {activeTab === 'Pages' && <PageManager />}
          {activeTab === 'Categories' && <CategoryManager />}
          {activeTab === 'Tags' && <TagManager />}
          {activeTab === 'Readers' && <ReaderManager />}
          {activeTab === 'Ads' && <AdManager />}
          {activeTab === 'Settings' && <SettingsManager />}
          
          {/* Newly designed scalable features */}
          {activeTab === 'Authors' && <AuthorsManager />}
          {activeTab === 'Homepage Builder' && <HomepageBuilderManager />}
          {activeTab === 'Users' && <UserManager />}
          {activeTab === 'Comments' && <CommentManager />}
          {activeTab === 'Newsletter' && <NewsletterManager />}
          {activeTab === 'Analytics' && <AnalyticsManager />}
          {activeTab === 'SEO' && <SeoManager />}
          {activeTab === 'Notifications' && <NotificationManager />}
          {activeTab === 'AI Assistant' && <AiAssistantManager />}
          {activeTab === 'Import/Export' && <ImportExportManager />}
          {activeTab === 'Activity Logs' && <ActivityLogManager />}
          {activeTab === 'Backups' && <BackupManager />}
        </main>
      </div>
    </div>
  );
}
