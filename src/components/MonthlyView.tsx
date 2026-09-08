import React, { useState } from 'react';
import { Member, Category, Schedule } from '../types';
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';

interface MonthlyViewProps {
  members: Member[];
  categories: Category[];
  schedules: Schedule[];
  onAddScheduleOnDate: (dateStr: string) => void;
  onEditSchedule: (schedule: Schedule) => void;
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({
  members,
  categories,
  schedules,
  onAddScheduleOnDate,
  onEditSchedule,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // First day of month
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build days array
  const calendarDays = [];
  // Padding for previous month
  for (let i = 0; i < startDayOfWeek; i++) {
    const prevDate = new Date(year, month, 1 - (startDayOfWeek - i));
    calendarDays.push({
      dateStr: prevDate.toISOString().split('T')[0],
      dayNum: prevDate.getDate(),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({
      dateStr: dStr,
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Next month padding to fill grid (multiple of 7)
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(year, month + 1, i);
    calendarDays.push({
      dateStr: nextDate.toISOString().split('T')[0],
      dayNum: nextDate.getDate(),
      isCurrentMonth: false,
    });
  }

  // Filter schedules
  const filteredSchedules = schedules.filter(sch => {
    if (selectedMemberFilter !== 'all' && sch.memberId !== selectedMemberFilter) return false;
    if (selectedCategoryFilter !== 'all' && sch.categoryId !== selectedCategoryFilter) return false;
    return true;
  });

  const getSchedulesForDate = (dateStr: string) => {
    return filteredSchedules.filter(sch => {
      return dateStr >= sch.startDate && dateStr <= sch.endDate;
    });
  };

  const memberMap = new Map<string, Member>(members.map(m => [m.id, m]));
  const categoryMap = new Map<string, Category>(categories.map(c => [c.id, c]));

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Month Toolbar & Filters */}
      <div className="sketch-card p-4 sm:p-5 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#fffdf9]">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="sketch-button p-2 bg-[#fff5e6] hover:bg-[#ffeedd] text-[#5c4033] cursor-pointer"
            title="이전 달"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-extrabold text-[#5c4033] min-w-[160px] text-center font-jua">
            {year}년 {month + 1}월
          </h2>
          <button
            onClick={handleNextMonth}
            className="sketch-button p-2 bg-[#fff5e6] hover:bg-[#ffeedd] text-[#5c4033] cursor-pointer"
            title="다음 달"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={handleToday}
            className="sketch-button px-3 py-1.5 bg-[#ffd1dc] hover:bg-[#ffb6c1] text-[#a85555] text-sm font-bold cursor-pointer"
          >
            오늘
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 bg-[#fff8f0] px-3 py-1.5 rounded-2xl border border-[#d8c4a9] text-xs">
            <Filter size={14} className="text-[#8c7355]" />
            <span className="font-bold text-[#5c4033]">필터:</span>
            <select
              value={selectedMemberFilter}
              onChange={(e) => setSelectedMemberFilter(e.target.value)}
              className="bg-transparent font-jua text-[#5c4033] outline-none cursor-pointer"
            >
              <option value="all">모든 팀원 ({members.length})</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#fff8f0] px-3 py-1.5 rounded-2xl border border-[#d8c4a9] text-xs">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-transparent font-jua text-[#5c4033] outline-none cursor-pointer"
            >
              <option value="all">모든 카테고리 ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="sketch-card overflow-hidden bg-[#fffdf9]">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b-2 border-dashed border-[#d8c4a9] bg-[#fff5e6]/50 text-center py-2 font-bold text-sm">
          <div className="text-red-500">일요일</div>
          <div className="text-[#5c4033]">월요일</div>
          <div className="text-[#5c4033]">화요일</div>
          <div className="text-[#5c4033]">수요일</div>
          <div className="text-[#5c4033]">목요일</div>
          <div className="text-[#5c4033]">금요일</div>
          <div className="text-blue-500">토요일</div>
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr bg-[#e2d7c5]/30 gap-[1px]">
          {calendarDays.map((cell, idx) => {
            const daySchedules = getSchedulesForDate(cell.dateStr);
            const isToday = cell.dateStr === todayStr;

            return (
              <div
                key={idx}
                className={`min-h-[120px] bg-[#fffdf9] p-2 flex flex-col justify-between transition-colors relative group ${
                  !cell.isCurrentMonth ? 'bg-[#f7f3ed] opacity-50' : ''
                } ${isToday ? 'bg-[#fff9e6]' : ''}`}
              >
                {/* Date header & Add button */}
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                      isToday
                        ? 'bg-[#ffdac1] text-[#9a5332] font-extrabold ring-2 ring-[#f6ad55]'
                        : idx % 7 === 0
                        ? 'text-red-500'
                        : idx % 7 === 6
                        ? 'text-blue-500'
                        : 'text-[#5c4033]'
                    }`}
                  >
                    {cell.dayNum}
                    {cell.dayNum === 1 && cell.isCurrentMonth && (
                      <span className="text-[10px] ml-1 text-[#8c7355]">
                        {month + 1}월
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => onAddScheduleOnDate(cell.dateStr)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#b5ead7] hover:bg-[#a2e3cd] text-[#065f46] p-1 rounded-full cursor-pointer shadow-sm"
                    title="이 날짜에 일정 추가"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Schedules list in cell */}
                <div className="space-y-1 overflow-y-auto max-h-[90px] pr-1">
                  {daySchedules.map(sch => {
                    const member = memberMap.get(sch.memberId);
                    const cat = categoryMap.get(sch.categoryId);
                    if (!member || !cat) return null;

                    return (
                      <div
                        key={sch.id}
                        onClick={() => onEditSchedule(sch)}
                        className="text-xs p-1 rounded-lg border cursor-pointer truncate transition-transform hover:scale-[1.02] shadow-xs flex items-center gap-1"
                        style={{
                          backgroundColor: cat.color,
                          borderColor: cat.borderColor,
                          color: cat.textColor,
                        }}
                        title={`${member.name} - ${cat.name}: ${sch.title} (${sch.startDate} ~ ${sch.endDate})`}
                      >
                        <span className="shrink-0">{member.avatar}</span>
                        <span className="truncate font-bold">
                          {cat.icon} {sch.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Empty cell helper prompt */}
                {daySchedules.length === 0 && cell.isCurrentMonth && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 pointer-events-none text-2xl">
                    ✏️
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
