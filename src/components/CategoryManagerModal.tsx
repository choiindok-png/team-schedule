import React, { useState } from 'react';
import { Category } from '../types';
import { X, Plus, Trash2, Edit3, Tag } from 'lucide-react';
import { PASTEL_COLORS } from '../data/initialData';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const EMOJI_LIST = ['🏖️', '🌙', '✈️', '🏠', '💻', '💡', '📚', '🎯', '🏃', '☕', '🌿', '🎁'];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0]);
  const [icon, setIcon] = useState('🏖️');
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSelectedColor(PASTEL_COLORS[0]);
    setIcon('🏖️');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    // Find matching pastel color or default
    const matched = PASTEL_COLORS.find(c => c.bg === cat.color) || PASTEL_COLORS[0];
    setSelectedColor(matched);
    setIcon(cat.icon);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCatData = {
      name,
      color: selectedColor.bg,
      textColor: selectedColor.text,
      borderColor: selectedColor.bg,
      icon,
    };

    if (editingId) {
      onUpdateCategory({
        id: editingId,
        ...newCatData,
      });
    } else {
      onAddCategory(newCatData);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="sketch-card bg-[#fffdf9] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c7355] hover:text-[#5c4033] p-1 cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-between mb-6 border-b-2 border-dashed border-[#d8c4a9] pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#5c4033] font-jua flex items-center gap-2">
              <span>🏷️</span> 일정 카테고리 관리
            </h2>
            <p className="text-sm text-[#8c7355] font-jua mt-0.5">
              초기 카테고리(휴가, 야간근무, 출장) 외에 새로운 카테고리를 추가/수정/삭제할 수 있습니다.
            </p>
          </div>
          {!isFormOpen && (
            <button
              onClick={handleOpenAdd}
              className="sketch-button bg-[#e2d9f3] hover:bg-[#d4c5f0] text-[#5b21b6] px-4 py-2 rounded-2xl font-bold flex items-center gap-2 text-sm cursor-pointer shadow-sm"
            >
              <Plus size={18} />
              새 카테고리
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {isFormOpen ? (
          <form onSubmit={handleSubmit} className="bg-[#fff5e6] p-5 rounded-2xl border-2 border-dashed border-[#d8c4a9] mb-6 space-y-4">
            <h3 className="text-lg font-bold text-[#5c4033]">
              {editingId ? '✏️ 카테고리 수정' : '✨ 새 카테고리 등록'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#5c4033] mb-1">카테고리 이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 휴가, 야간근무, 출장, 재택근무"
                required
                className="sketch-input w-full px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5c4033] mb-1">아이콘 이모지</label>
              <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-xl border border-[#d8c4a9]">
                {EMOJI_LIST.map(em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setIcon(em)}
                    className={`text-xl p-2 rounded-lg transition-transform cursor-pointer ${
                      icon === em ? 'bg-[#ffd1dc] scale-110 ring-2 ring-[#a85555]' : 'hover:bg-gray-100'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5c4033] mb-1">파스텔 색상 테마</label>
              <div className="flex flex-wrap gap-2">
                {PASTEL_COLORS.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                      selectedColor.bg === c.bg ? 'ring-2 ring-offset-2 ring-[#5c4033] scale-105' : 'opacity-80 hover:opacity-100'
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
                className="sketch-button px-5 py-2 bg-[#e2d9f3] hover:bg-[#d4c5f0] text-[#5b21b6] text-sm font-bold cursor-pointer"
              >
                {editingId ? '수정 완료' : '등록하기'}
              </button>
            </div>
          </form>
        ) : null}

        {/* Categories List */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#5c4033] mb-2">등록된 카테고리 ({categories.length}개)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="p-3.5 rounded-2xl border-2 border-dashed flex items-center justify-between shadow-xs"
                style={{ backgroundColor: cat.color, borderColor: cat.textColor, color: cat.textColor }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-bold text-base font-jua">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 bg-white/60 hover:bg-white rounded-xl transition-colors cursor-pointer"
                    title="수정"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => {
                      if (categories.length <= 1) {
                        alert('최소 1개 이상의 카테고리가 필요합니다.');
                        return;
                      }
                      if (confirm(`정말 "${cat.name}" 카테고리를 삭제하시겠습니까?`)) {
                        onDeleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 bg-red-100/60 hover:bg-red-200 rounded-xl text-red-600 transition-colors cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
