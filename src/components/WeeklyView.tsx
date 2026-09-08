import React, { useState } from 'react';
import { Member, Category, Schedule } from '../types';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';

interface WeeklyViewProps {
  members: Member[];
  categories: Category[];
  schedules: Schedule[];
  onAddScheduleOnDate: (dateStr: string) => void;
  onEditSchedule: (schedule: Schedule) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  members,
  categories,
  schedules,
  onAddScheduleOnDate,
  onEditSchedule,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get start of week (Sunday or Monday)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Sunday start
    return new Date(d.setDate(diff));
  };

  const [weekStartDate, setWeekStartDate] = useState(() => getStartOfWeek(new Date()));

  const handlePrevWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(newDate.getDate() - 7);
    setWeekStartDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(newDate.getDate() + 7);
    setWeekStartDate(newDate);
  };

  const handleCurrentWeek = () => {
    setWeekStartDate(getStartOfWeek(new Date()));
  };

  // Generate 7 days of the week
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + i);
    weekDays.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: ['일', '월', '화', '수', '목', '금', '토'][i],
      dayNum: d.getDate(),
      monthNum: d.getMonth() + 1,
    });
  }

  const categoryMap = new Map<string, Category>(categories.map(c => [c.id, c]));
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Week Toolbar */}
      <div className="sketch-card p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#fffdf9]">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevWeek}
            className="sketch-button p-2 bg-[#fff5e6] hover:bg-[#ffeedd] text-[#5c4033] cursor-pointer"
            title="이전 주"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#5c4033] min-w-[200px] text-center font-jua">
            {weekDays[0].monthNum}월 {weekDays[0].dayNum}일 ~ {weekDays[6].monthNum}월 {weekDays[6].dayNum}일
          </h2>
          <button
            onClick={handleNextWeek}
            className="sketch-button p-2 bg-[#fff5e6] hover:bg-[#ffeedd] text-[#5c4033] cursor-pointer"
            title="다음 주"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={handleCurrentWeek}
            className="sketch-button px-3 py-1.5 bg-[#ffd1dc] hover:bg-[#ffb6c1] text-[#a85555] text-sm font-bold cursor-pointer"
          >
            이번 주
          </button>
        </div>

        <div className="text-sm font-gaegu text-[#8c7355] text-xl">
          "팀원별 주간 스케줄을 한눈에 확인하세요!" 📅
        </div>
      </div>

      {/* Weekly Table View (Rows = Members, Cols = Days) */}
      <div className="sketch-card overflow-x-auto bg-[#fffdf9]">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#fff5e6] border-b-2 border-dashed border-[#d8c4a9] text-[#5c4033]">
              <th className="p-3 text-left w-48 font-bold border-r-2 border-dashed border-[#d8c4a9] font-jua">
                팀원 / 요일
              </th>
              {weekDays.map((wd, i) => {
                const isToday = wd.dateStr === todayStr;
                return (
                  <th
                    key={i}
                    className={`p-3 text-center border-r-2 border-dashed border-[#d8c4a9] last:border-r-0 ${
                      isToday ? 'bg-[#ffd1dc]/40' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${
                          i === 0
                            ? 'text-red-500 bg-red-50'
                            : i === 6
                            ? 'text-blue-500 bg-blue-50'
                            : 'text-[#5c4033]'
                        }`}
                      >
                        {wd.dayName요일.replace('요일', '')}요일
                      </span>
                      <span
                        className={`text-lg font-extrabold ${
                          isToday
                            ? 'bg-[#a85555] text-white px-2 rounded-full'
                            : 'text-[#5c4033]'
                        }`}
                      >
                        {wd.monthNum}/{wd.dayNum}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-[#8c7355] font-jua">
                  등록된 팀원이 없습니다. 상단의 '팀원 관리' 버튼을 눌러 팀원을 등록해주세요! 🐿️
                </td>
              </tr>
            ) : (
              members.map(member => (
                <tr
                  key={member.id}
                  className="border-b-2 border-dashed border-[#e2d7c5] hover:bg-[#fffdf0] transition-colors"
                >
                  {/* Member Info Cell */}
                  <td
                    className="p-3 border-r-2 border-dashed border-[#d8c4a9] font-bold text-[#5c4033]"
                    style={{ backgroundColor: `${member.color}25` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs border border-[#8c7355]/30"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.avatar}
                      </div>
                      <div>
                        <div className="text-base font-jua text-[#5c4033]">
                          {member.name}
                        </div>
                        <div className="text-xs text-[#8c7355] font-gaegu text-sm">
                          {member.role} · {member.department}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Days Columns */}
                  {weekDays.map((wd, i) => {
                    const daySchedules = schedules.filter(
                      sch =>
                        sch.memberId === member.id &&
                        wd.dateStr >= sch.startDate &&
                        wd.dateStr <= sch.endDate
                    );

                    return (
                      <td
                        key={i}
                        className="p-2 border-r-2 border-dashed border-[#e2d7c5] last:border-r-0 align-top h-28 relative group"
                      >
                        <div className="space-y-1.5 min-h-[90px]">
                          {daySchedules.map(sch => {
                            const cat = categoryMap.get(sch.categoryId);
                            if (!cat) return null;

                            return (
                              <div
                                key={sch.id}
                                onClick={() => onEditSchedule(sch)}
                                className="p-2 rounded-xl border text-xs cursor-pointer shadow-xs transition-transform hover:scale-[1.02]"
                                style={{
                                  backgroundColor: cat.color,
                                  borderColor: cat.borderColor,
                                  color: cat.textColor,
                                }}
                                title={`${sch.title} (${cat.name})`}
                              >
                                <div className="font-bold flex items-center gap-1">
                                  <span>{cat.icon}</span>
                                  <span className="truncate">{sch.title}</span>
                                </div>
                                <div className="text-[10px] opacity-80 truncate mt-0.5">
                                  {cat.name}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add button on hover */}
                        <button
                          onClick={() => onAddScheduleOnDate(wd.dateStr)}
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ffdac1] hover:bg-[#ffcbb3] text-[#9a5332] p-1 rounded-full cursor-pointer shadow-sm"
                          title={`${wd.dateStr}에 일정 추가`}
                        >
                          <Plus size={14} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
