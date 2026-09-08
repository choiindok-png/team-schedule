import React, { useState } from 'react';
import { Member } from '../types';
import { PASTEL_COLORS, AVATAR_EMOJIS } from '../data/initialData';
import { X, Plus, Trash2, Edit3, UserPlus } from 'lucide-react';

interface TeamManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

export const TeamManagerModal: React.FC<TeamManagerModalProps> = ({
  isOpen,
  onClose,
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [color, setColor] = useState(PASTEL_COLORS[0].bg);
  const [avatar, setAvatar] = useState(AVATAR_EMOJIS[0]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setRole('사원');
    setDepartment('도토리수집팀');
    setColor(PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)].bg);
    setAvatar(AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setDepartment(member.department);
    setColor(member.color);
    setAvatar(member.avatar);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateMember({
        id: editingId,
        name,
        role,
        department,
        color,
        avatar,
      });
    } else {
      onAddMember({
        name,
        role,
        department,
        color,
        avatar,
      });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="sketch-card bg-[#fffdf9] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c7355] hover:text-[#5c4033] p-1 cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-between mb-6 border-b-2 border-dashed border-[#d8c4a9] pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#5c4033] font-jua flex items-center gap-2">
              <span>🐿️</span> 팀원 관리하기
            </h2>
            <p className="text-sm text-[#8c7355] font-jua mt-0.5">
              사내 팀원들을 등록하고 수정 및 삭제할 수 있습니다.
            </p>
          </div>
          {!isFormOpen && (
            <button
              onClick={handleOpenAdd}
              className="sketch-button bg-[#b5ead7] hover:bg-[#a2e3cd] text-[#065f46] px-4 py-2 rounded-2xl font-bold flex items-center gap-2 text-sm cursor-pointer shadow-sm"
            >
              <UserPlus size={18} />
              새 팀원 등록
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {isFormOpen ? (
          <form onSubmit={handleSubmit} className="bg-[#fff5e6] p-5 rounded-2xl border-2 border-dashed border-[#d8c4a9] mb-6 space-y-4">
            <h3 className="text-lg font-bold text-[#5c4033]">
              {editingId ? '✏️ 팀원 정보 수정' : '✨ 새 팀원 등록'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5c4033] mb-1">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 다람이"
                  required
                  className="sketch-input w-full px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c4033] mb-1">직책 / 직급</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="예: 팀장, 선임, 사원"
                  className="sketch-input w-full px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c4033] mb-1">부서 / 팀명</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="예: 도토리수집팀"
                  className="sketch-input w-full px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c4033] mb-1">아바타 이모지</label>
                <div className="flex flex-wrap gap-1 bg-white p-2 rounded-xl border border-[#d8c4a9]">
                  {AVATAR_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      className={`text-xl p-1.5 rounded-lg transition-transform cursor-pointer ${
                        avatar === emoji ? 'bg-[#ffd1dc] scale-110 ring-2 ring-[#a85555]' : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pastel Color Picker */}
            <div>
              <label className="block text-xs font-bold text-[#5c4033] mb-1">파스텔 컬러 테마</label>
              <div className="flex flex-wrap gap-2">
                {PASTEL_COLORS.map(c => (
                  <button
                    key={c.bg}
                    type="button"
                    onClick={() => setColor(c.bg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                      color === c.bg ? 'ring-2 ring-offset-2 ring-[#5c4033] scale-105' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.bg, color: c.text, borderColor: c.text }}
                  >
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="sketch-button px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="sketch-button px-5 py-2 bg-[#ffdac1] hover:bg-[#ffcbb3] text-[#9a5332] text-sm font-bold cursor-pointer"
              >
                {editingId ? '수정 완료' : '등록하기'}
              </button>
            </div>
          </form>
        ) : null}

        {/* Member List Grid */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#5c4033] mb-2">등록된 팀원 목록 ({members.length}명)</h3>
          {members.length === 0 ? (
            <p className="text-center py-8 text-[#8c7355] font-jua">등록된 팀원이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map(member => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl border-2 border-dashed flex items-center justify-between shadow-xs bg-white"
                  style={{ borderColor: member.color, backgroundColor: `${member.color}15` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-[#8c7355]/30"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-[#5c4033] text-base flex items-center gap-1.5">
                        {member.name}
                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white/80 border border-[#d8c4a9]">
                          {member.role}
                        </span>
                      </div>
                      <div className="text-xs text-[#8c7355]">
                        {member.department}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 hover:bg-white/80 rounded-xl text-[#5c4033] transition-colors cursor-pointer"
                      title="수정"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`정말 "${member.name}" 팀원을 삭제하시겠습니까?`)) {
                          onDeleteMember(member.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-100 rounded-xl text-red-500 transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
