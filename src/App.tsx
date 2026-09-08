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

export default function App() {
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
    // Also remove schedules associated with this member
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
    // Reassign or remove schedules associated with this category
    // Default to first available category if exists
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
      // Update
      setSchedules(prev => prev.map(s => (s.id === scheduleData.id ? (scheduleData as Schedule) : s)));
    } else {
      // Add
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

  return (
    <div className="min-h-screen pb-16 relative overflow-x-hidden">
      {/* Flying Squirrel Animation & Widget */}
      <FlyingSquirrel />

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
        <p>🌰 다람쥐의 스케치북 팀 일정 관리 프로그램 🌰</p>
        <p className="mt-1">© 2026 사내 팀원 일정 관리 서비스 · 모든 데이터는 안전하게 브라우저에 저장됩니다.</p>
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
