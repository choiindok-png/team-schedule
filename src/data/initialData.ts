import { Member, Category, Schedule } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: '휴가',
    color: '#ffdfdf', // Pastel Pink
    textColor: '#a85555',
    borderColor: '#f8b4b4',
    icon: '🏖️',
  },
  {
    id: 'cat-2',
    name: '야간근무',
    color: '#e2d9f3', // Pastel Lavender
    textColor: '#6b4f91',
    borderColor: '#c4b5fd',
    icon: '🌙',
  },
  {
    id: 'cat-3',
    name: '출장',
    color: '#d1fae5', // Pastel Mint
    textColor: '#065f46',
    borderColor: '#a7f3d0',
    icon: '✈️',
  },
  {
    id: 'cat-4',
    name: '재택근무',
    color: '#fef3c7', // Pastel Yellow
    textColor: '#92400e',
    borderColor: '#fde68a',
    icon: '🏠',
  },
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    name: '다람이',
    role: '팀장',
    department: '도토리수집팀',
    color: '#ffd1dc', // Pastel pink
    avatar: '🐿️',
  },
  {
    id: 'mem-2',
    name: '토리',
    role: '선임',
    department: '도토리수집팀',
    color: '#b5ead7', // Pastel mint
    avatar: '🐹',
  },
  {
    id: 'mem-3',
    name: '몽실이',
    role: '대리',
    department: '나무오르기팀',
    color: '#ffdac1', // Pastel peach
    avatar: '🐰',
  },
  {
    id: 'mem-4',
    name: '밤톨이',
    role: '사원',
    department: '겨울잠준비팀',
    color: '#e2f0cb', // Pastel green
    avatar: '🦊',
  },
];

// Helper to get today's date YYYY-MM-DD
const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sch-1',
    memberId: 'mem-1',
    categoryId: 'cat-1',
    startDate: getTodayStr(1),
    endDate: getTodayStr(3),
    title: '여름휴가 다녀오기',
    memo: '가족들과 계곡 여행',
  },
  {
    id: 'sch-2',
    memberId: 'mem-2',
    categoryId: 'cat-2',
    startDate: getTodayStr(0),
    endDate: getTodayStr(0),
    title: '서버 점검 야간근무',
    memo: 'AWS 인프라 업데이트',
  },
  {
    id: 'sch-3',
    memberId: 'mem-3',
    categoryId: 'cat-3',
    startDate: getTodayStr(4),
    endDate: getTodayStr(6),
    title: '부산 지사 출장',
    memo: '신규 파트너 미팅',
  },
  {
    id: 'sch-4',
    memberId: 'mem-4',
    categoryId: 'cat-4',
    startDate: getTodayStr(-1),
    endDate: getTodayStr(1),
    title: '재택 근무',
    memo: '보고서 집중 작성',
  },
  {
    id: 'sch-5',
    memberId: 'mem-1',
    categoryId: 'cat-3',
    startDate: getTodayStr(10),
    endDate: getTodayStr(12),
    title: '제주 워케이션 출장',
    memo: '전략 워크숍 참석',
  },
];

export const PASTEL_COLORS = [
  { name: '딸기우유', bg: '#ffd1dc', text: '#a85555' },
  { name: '민트초코', bg: '#b5ead7', text: '#065f46' },
  { name: '피치복숭아', bg: '#ffdac1', text: '#9a5332' },
  { name: '연두잎', bg: '#e2f0cb', text: '#3f6212' },
  { name: '라벤더', bg: '#e2d9f3', text: '#5b21b6' },
  { name: '바나나', bg: '#fef3c7', text: '#92400e' },
  { name: '하늘색', bg: '#c7d2fe', text: '#3730a3' },
  { name: '레몬크림', bg: '#fef08a', text: '#713f12' },
];

export const AVATAR_EMOJIS = ['🐿️', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐧', '🐥'];
