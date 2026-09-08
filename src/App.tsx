import React, { useState, useEffect } from 'react';
import { Member, Category, Schedule, ViewMode } from './types';
import { INITIAL_MEMBERS, INITIAL_CATEGORIES, INITIAL_SCHEDULES } from './data/initialData';
import { Header } from './components/Header';
import { MonthlyView } from './components/MonthlyView';
import { WeeklyView } from './components/WeeklyView';
import { TeamListView } from './components/TeamListView';
import { TeamManagerModal } from './components/TeamManagerModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { ScheduleModal } from './components/ScheduleModal';
import { FlyingSquirrel } from './components/FlyingSquirrel';
import { AuthScreen } from './components/AuthScreen';
import { supabase } from './lib/supabase';
import { LogOut, UserCheck } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if session stored in localStorage for demo mode or active login
    return localStorage.getItem('squirrel_auth_user') !== null;
  });
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem('squirrel_auth_user') || '';
  });

  // Check Supabase session on mount if supabase client exists
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentUserEmail(session.user.email || 'team@company.com');
          setIsAuthenticated(true);
          localStorage.setItem('squirrel_auth_user', session.user.email || 'team@company.com');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUserEmail(session.user.email || 'team@company.com');
          setIsAuthenticated(true);
          localStorage.setItem('squirrel_auth_user', session.user.email || 'team@company.com');
        } else {
          // If signed out from supabase
          // Note: we can keep demo mode or clear auth
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleLoginSuccess = (email: string) => {
    setCurrentUserEmail(email);
    setIsAuthenticated(true);
    localStorage.setItem('squirrel_auth_user', email);
  };

  const handleBypassDemo = () => {
    setCurrentUserEmail('demo.squirrel@company.com');
    setIsAuthenticated(true);
    localStorage.setItem('squirrel_auth_user', 'demo.squirrel@company.com');
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCurrentUserEmail('');
    localStorage.removeItem('squirrel_auth_user');
  };

  // Load from localStorage or defaults
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('squirrel_team_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('squirrel_team_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('squirrel_team_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('monthly');

  // Modals state
  const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);
  const [initialDateStr, setInitialDateStr] = useState<string | undefined>(undefined);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('squirrel_team_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('squirrel_team_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('squirrel_team_schedules', JSON.stringify(schedules));
  }, [schedules]);

  // Member CRUD handlers
  const handleAddMember = (newMemberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...newMemberData,
      id: 'mem-' + Date.now(),
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleUpdateMember = (updated: Member) => {
    setMembers(prev => prev.map(m => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setSchedules(prev => prev.filter(s => s.memberId !== id));
  };

  // Category CRUD handlers
  const handleAddCategory = (newCatData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...newCatData,
      id: 'cat-' + Date.now(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateCategory = (updated: Category) => {
    setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    const fallbackCatId = categories.find(c => c.id !== id)?.id || '';
    setSchedules(prev => prev.map(s => (s.categoryId === id ? { ...s, categoryId: fallbackCatId } : s)));
  };

  // Schedule CRUD handlers
  const handleOpenAddSchedule = (dateStr?: string) => {
    setScheduleToEdit(null);
    setInitialDateStr(dateStr || new Date().toISOString().split('T')[0]);
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (sch: Schedule) => {
    setScheduleToEdit(sch);
    setInitialDateStr(undefined);
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (scheduleData: Omit<Schedule, 'id'> | Schedule) => {
    if ('id' in scheduleData) {
      setSchedules(prev => prev.map(s => (s.id === scheduleData.id ? (scheduleData as Schedule) : s)));
    } else {
      const newSchedule: Schedule = {
        ...scheduleData,
        id: 'sch-' + Date.now(),
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // If not authenticated, show AuthScreen
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        onBypassDemo={handleBypassDemo}
      />
    );
  }

  return (
    <div className="min-h-screen pb-16 relative overflow-x-hidden">
      {/* Flying Squirrel Animation & Widget */}
      <FlyingSquirrel />

      {/* Top User Bar */}
      <div className="bg-[#fffdf9]/95 border-b-2 border-dashed border-[#d8c4a9] py-2 px-4 shadow-xs sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs font-jua">
          <div className="flex items-center gap-2 text-[#5c4033]">
            <span className="bg-[#ffd1dc] px-2.5 py-0.5 rounded-full border border-[#f8b4b4] text-[#a85555] font-bold">
              Supabase 인증 완료
            </span>
            <span className="flex items-center gap-1 font-bold">
              <UserCheck size={14} className="text-[#065f46]" />
              {currentUserEmail}님 환영합니다! 🐿️
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="sketch-button px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <LogOut size={13} />
            로그아웃
          </button>
        </div>
      </div>

      {/* Main Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddSchedule={() => handleOpenAddSchedule()}
        onOpenTeamManager={() => setIsTeamManagerOpen(true)}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        memberCount={members.length}
        categoryCount={categories.length}
      />

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4">
        {viewMode === 'monthly' && (
          <MonthlyView
            members={members}
            categories={categories}
            schedules={schedules}
            onAddScheduleOnDate={(dateStr) => handleOpenAddSchedule(dateStr)}
            onEditSchedule={handleEditSchedule}
          />
        )}

        {viewMode === 'weekly' && (
          <WeeklyView
            members={members}
            categories={categories}
            schedules={schedules}
            onAddScheduleOnDate={(dateStr) => handleOpenAddSchedule(dateStr)}
            onEditSchedule={handleEditSchedule}
          />
        )}

        {viewMode === 'team' && (
          <TeamListView
            members={members}
            categories={categories}
            schedules={schedules}
            onOpenAddSchedule={() => handleOpenAddSchedule()}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}
      </main>

      {/* Footer Sketchbook Note */}
      <footer className="max-w-6xl mx-auto px-4 mt-16 text-center text-xs text-[#8c7355] font-gaegu text-xl">
        <p>🌰 다람쥐의 스케치북 팀 일정 관리 프로그램 (Supabase 인증 연동) 🌰</p>
        <p className="mt-1">© 2026 사내 팀원 일정 관리 서비스 · 안전한 보안 로그인 적용됨</p>
      </footer>

      {/* Modals */}
      <TeamManagerModal
        isOpen={isTeamManagerOpen}
        onClose={() => setIsTeamManagerOpen(false)}
        members={members}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onDeleteMember={handleDeleteMember}
      />

      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        members={members}
        categories={categories}
        initialDateStr={initialDateStr}
        scheduleToEdit={scheduleToEdit}
        onSaveSchedule={handleSaveSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />
    </div>
  );
}
