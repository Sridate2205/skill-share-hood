export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  location: string;
  avatar?: string;
  createdAt: string;
}

export interface SkillRequest {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  compensation: string;
  location: string;
  category: string;
  createdAt: string;
  status: 'open' | 'closed';
}

export interface SkillOffer {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  rate: string;
  location: string;
  category: string;
  createdAt: string;
  availability: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'accepted' | 'denied' | 'new_request';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
