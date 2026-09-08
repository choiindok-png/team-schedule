import React, { useState } from 'react';
import { Member, Category, Schedule } from '../types';
import { Search, Plus, Calendar, Trash2, Edit3, User, Tag } from 'lucide-react';

interface TeamListViewProps {
  members: Member[];
  categories: Category[];
  schedules: Schedule[];
  onOpenAddSchedule: () => void;
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (id: string) => void;
}

export const TeamListView: React.FC<TeamListViewProps> = ({
  members,
  categories,
  schedules,
  onOpenAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const memberMap = new Map<string, Member>(members.map(m => [m.id, m]));
  const categoryMap = new Map<string, Category>(categories.map(c => [c.id, c]));

  const filteredSchedules = schedules.filter(sch => {
    const member = memberMap.get(sch.memberId);
    const cat = categoryMap.get(sch.categoryId);

    if (memberFilter !== 'all' && sch.memberId !== memberFilter) return false;
    if (categoryFilter !== 'all' && sch.categoryId !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = sch.title.toLowerCase().includes(q);
      const matchMemo = sch.memo?.toLowerCase().includes(q) || false;
      const matchMember = member?.name.toLowerCase().includes(q) || false;
      const matchCat = cat?.name.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchMemo && !matchMember && !matchCat) return false;
    }

    return true;
  }).sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="sketch-card p-4 sm:p-5 bg-[#fffdf9] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-[#8c7355]" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="일정 제목, 메모, 팀원 검색..."
            className="sketch-input w-full pl-10 pr-4 py-2 text-sm font-jua"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="sketch-input px-3 py-2 text-sm font-jua cursor-pointer"
          >
            <option value="all">모든 팀원 ({members.length})</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.avatar} {m.name}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="sketch-input px-3 py-2 text-sm font-jua cursor-pointer"
          >
            <option value="all">모든 카테고리 ({categories.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>

          <button
            onClick={onOpenAddSchedule}
            className="sketch-button bg-[#ffdac1] hover:bg-[#ffcbb3] text-[#9a5332] px-4 py-2 rounded-2xl font-bold flex items-center gap-2 text-sm cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            일정 등록
          </button>
        </div>
      </div>

      {/* Schedules List Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-extrabold text-[#5c4033] font-jua">
            📋 전체 일정 목록 ({filteredSchedules.length}건)
          </h2>
          <span className="text-xs text-[#8c7355] font-gaegu text-lg">
            "날짜순으로 정렬된 팀원 일정입니다" 🌰
          </span>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="sketch-card p-12 text-center bg-[#fffdf9]">
            <p className="text-lg text-[#8c7355] font-jua mb-2">검색 결과가 없습니다. 🐿️</p>
            <p className="text-xs text-[#a38a73]">다른 검색어를 입력하거나 새로운 일정을 등록해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchedules.map(sch => {
              const member = memberMap.get(sch.memberId);
              const cat = categoryMap.get(sch.categoryId);
              if (!member || !cat) return null;

              return (
                <div
                  key={sch.id}
                  className="sketch-card p-4 sm:p-5 bg-[#fffdf9] flex flex-col justify-between transition-all hover:scale-[1.01]"
                >
                  <div>
                    {/* Header info: Category & Member */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 shadow-xs"
                        style={{
                          backgroundColor: cat.color,
                          borderColor: cat.borderColor,
                          color: cat.textColor,
                        }}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>

                      <div
                        className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#d8c4a9] text-xs font-bold"
                        style={{ backgroundColor: `${member.color}30` }}
                      >
                        <span className="text-sm">{member.avatar}</span>
                        <span className="text-[#5c4033]">{member.name} ({member.role})</span>
                      </div>
                    </div>

                    {/* Title & Memo */}
                    <h3 className="text-lg font-bold text-[#5c4033] mb-1 font-jua">
                      {sch.title}
                    </h3>
                    {sch.memo && (
                      <p className="text-xs text-[#7a6252] mb-3 bg-[#fff5e6] p-2.5 rounded-xl border border-dashed border-[#e2d7c5]">
                        {sch.memo}
                      </p>
                    )}
                  </div>

                  {/* Footer: Date & Actions */}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-[#e2d7c5] mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#8c7355] font-bold">
                      <Calendar size={14} />
                      <span>
                        {sch.startDate} ~ {sch.endDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditSchedule(sch)}
                        className="sketch-button p-1.5 bg-[#fff5e6] hover:bg-[#ffeedd] text-[#5c4033] text-xs flex items-center gap-1 cursor-pointer"
                        title="수정"
                      >
                        <Edit3 size={14} />
                        수정
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('이 일정을 삭제하시겠습니까?')) {
                            onDeleteSchedule(sch.id);
                          }
                        }}
                        className="sketch-button p-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs flex items-center gap-1 cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 size={14} />
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
