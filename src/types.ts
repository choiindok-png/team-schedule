export type Member = {
  id: string;
  name: string;
  role: string;
  department: string;
  color: string; // Pastel color code
  avatar: string; // Emoji or icon name
};

export type Category = {
  id: string;
  name: string;
  color: string; // Pastel background/badge color
  textColor: string;
  borderColor: string;
  icon: string; // Emoji
};

export type Schedule = {
  id: string;
  memberId: string;
  categoryId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  title: string;
  memo?: string;
};

export type ViewMode = 'monthly' | 'weekly' | 'team';
