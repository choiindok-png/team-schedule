import React from 'react';
import { ViewMode } from '../types';
import { Calendar, Users, Tag, Plus, BookOpen, Clock } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenAddSchedule: () => void;
  onOpenTeamManager: () => void;
  onOpenCategoryManager: () => void;
  memberCount: number;
  categoryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onOpenAddSchedule,
  onOpenTeamManager,
  onOpenCategoryManager,
  memberCount,
  categoryCount,
}) => {
  return (
    <header className="w-full mb-8 pt-4">
      {/* Sketchbook spiral binding visual effect */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center items-center gap-3 sm:gap-6 mb-6 overflow-x-auto py-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-4 h-6 bg-[#d1c2a5] rounded-full border-2 border-[#8c7355] shadow-inner"></div>
            </div>
          ))}
        </div>

        {/* Main Title & Action Bar */}
        <div className="sketch-card p-6 sm:p-8 bg-gradient-to-r from-[#fffdf9] via-[#fff8f0] to-[#fffdf9] relative overflow-hidden">
          {/* Decorative stickers / doodles */}
          <div className="absolute top-3 right-6 text-2xl animate-acorn hidden sm:block">🌰</div>
          <div className="absolute bottom-3 left-6 text-2xl hidden sm:block">🍁</div>
          <div className="absolute top-2 left-1/4 text-xl opacity-75 hidden md:block">✏️</div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#ffd1dc] text-[#a85555] px-3 py-0.5 rounded-full text-xs font-bold border border-[#f8b4b4]">
                  사내 팀원 일정 관리
                </span>
                <span className="text-xs text-[#8c7355] font-gaegu text-lg">
                  ✨ 5살 아이의 스케치북 감성 ✨
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#5c4033] tracking-wide flex items-center gap-2 font-jua">
                <span>🐿️</span> 다람쥐의 스케치북 팀 일정
              </h1>
              <p className="text-sm text-[#7a6252] mt-1 font-jua">
                우리 팀의 휴가, 야간근무, 출장 일정을 알록달록 파스텔 톤으로 한눈에 관리해요!
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenTeamManager}
                className="sketch-button bg-[#b5ead7] hover:bg-[#a2e3cd] text-[#065f46] px-4 py-2 rounded-2xl font-bold flex items-center gap-2 text-sm cursor-pointer"
              >
                <Users size={18} />
                팀원 관리 ({memberCount})
              </button>

              <button
                onClick={onOpenCategoryManager}
                className="sketch-button bg-[#e2d9f3] hover:bg-[#d4c5f0] text-[#5b21b6] px-4 py-2 rounded-2xl font-bold flex items-center gap-2 text-sm cursor-pointer"
              >
                <Tag size={18} />
                카테고리 ({categoryCount})
              </button>

              <button
                onClick={onOpenAddSchedule}
                className="sketch-button bg-[#ffdac1] hover:bg-[#ffcbb3] text-[#9a5332] px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 text-base cursor-pointer shadow-md transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                일정 등록
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t-2 border-dashed border-[#e2d7c5] items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === 'monthly'
                    ? 'bg-[#5c4033] text-[#fffdf9] shadow-inner'
                    : 'bg-[#fff5e6] hover:bg-[#ffeedd] text-[#5c4033] border border-[#d8c4a9]'
                }`}
              >
                <Calendar size={16} />
                월간 뷰
              </button>

              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === 'weekly'
                    ? 'bg-[#5c4033] text-[#fffdf9] shadow-inner'
                    : 'bg-[#fff5e6] hover:bg-[#ffeedd] text-[#5c4033] border border-[#d8c4a9]'
                }`}
              >
                <Clock size={16} />
                주간 뷰
              </button>

              <button
                onClick={() => setViewMode('team')}
                className={`px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  viewMode === 'team'
                    ? 'bg-[#5c4033] text-[#fffdf9] shadow-inner'
                    : 'bg-[#fff5e6] hover:bg-[#ffeedd] text-[#5c4033] border border-[#d8c4a9]'
                }`}
              >
                <BookOpen size={16} />
                팀원 & 일정 목록
              </button>
            </div>

            <div className="text-xs font-gaegu text-[#8c7355] text-lg hidden lg:block">
              "색칠공부 하듯 즐겁게 일정을 기록해보세요!" 🖍️
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
