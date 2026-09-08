import React, { useState, useEffect } from 'react';
import { Member, Category, Schedule } from '../types';
import { X, Trash2, Calendar } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  categories: Category[];
  initialDateStr?: string;
  scheduleToEdit?: Schedule | null;
  onSaveSchedule: (schedule: Omit<Schedule, 'id'> | Schedule) => void;
  onDeleteSchedule?: (id: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  members,
  categories,
  initialDateStr,
  scheduleToEdit,
  onSaveSchedule,
  onDeleteSchedule,
}) => {
  const [memberId, setMemberId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (scheduleToEdit) {
      setMemberId(scheduleToEdit.memberId);
      setCategoryId(scheduleToEdit.categoryId);
      setStartDate(scheduleToEdit.startDate);
      setEndDate(scheduleToEdit.endDate);
      setTitle(scheduleToEdit.title);
      setMemo(scheduleToEdit.memo || '');
    } else {
      const today = initialDateStr || new Date().toISOString().split('T')[0];
      setMemberId(members[0]?.id || '');
      setCategoryId(categories[0]?.id || '');
      setStartDate(today);
      setEndDate(today);
      setTitle('');
      setMemo('');
    }
  }, [isOpen, scheduleToEdit, initialDateStr, members, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !categoryId || !startDate || !endDate || !title.trim()) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (startDate > endDate) {
      alert('시작일은 종료일보다 이전이거나 같아야 합니다.');
      return;
    }

    if (scheduleToEdit) {
      onSaveSchedule({
        id: scheduleToEdit.id,
        memberId,
        categoryId,
        startDate,
        endDate,
        title,
        memo,
      });
    } else {
      onSaveSchedule({
        memberId,
        categoryId,
        startDate,
        endDate,
        title,
        memo,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="sketch-card bg-[#fffdf9] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c7355] hover:text-[#5c4033] p-1 cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-between mb-6 border-b-2 border-dashed border-[#d8c4a9] pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#5c4033] font-jua flex items-center gap-2">
              <span>📅</span> {scheduleToEdit ? '일정 수정하기' : '새 일정 등록하기'}
            </h2>
            <p className="text-sm text-[#8c7355] font-jua mt-0.5">
              팀원의 휴가, 야간근무, 출장 등의 일정을 기록하세요.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Member Selection */}
          <div>
            <label className="block text-xs font-bold text-[#5c4033] mb-1">담당 팀원 선택 *</label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
              className="sketch-input w-full px-3 py-2 text-sm font-jua cursor-pointer"
            >
              <option value="">팀원을 선택하세요</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.avatar} {m.name} ({m.role} - {m.department})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-[#5c4033] mb-1">일정 카테고리 *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-2.5 rounded-2xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    categoryId === cat.id
                      ? 'ring-2 ring-offset-2 ring-[#5c4033] scale-105 shadow-inner'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: cat.color,
                    borderColor: categoryId === cat.id ? '#5c4033' : cat.borderColor,
                    color: cat.textColor,
                  }}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5c4033] mb-1">시작일 *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="sketch-input w-full px-3 py-2 text-sm font-jua"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5c4033] mb-1">종료일 *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="sketch-input w-full px-3 py-2 text-sm font-jua"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#5c4033] mb-1">일정 제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 제주도 여름휴가, 시스템 점검 야간근무"
              required
              className="sketch-input w-full px-3 py-2 text-sm font-jua"
            />
          </div>

          {/* Memo */}
          <div>
            <label className="block text-xs font-bold text-[#5c4033] mb-1">상세 메모 (선택)</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="상세한 내용이나 참고사항을 적어주세요."
              rows={3}
              className="sketch-input w-full px-3 py-2 text-sm font-jua resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[#d8c4a9]">
            {scheduleToEdit && onDeleteSchedule ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('이 일정을 삭제하시겠습니까?')) {
                    onDeleteSchedule(scheduleToEdit.id);
                    onClose();
                  }
                }}
                className="sketch-button px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={16} />
                일정 삭제
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="sketch-button px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="sketch-button px-5 py-2 bg-[#ffdac1] hover:bg-[#ffcbb3] text-[#9a5332] text-sm font-bold cursor-pointer shadow-md"
              >
                {scheduleToEdit ? '수정 완료' : '등록 완료'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
