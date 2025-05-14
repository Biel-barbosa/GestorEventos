
export type EventCategory = 'personal' | 'work' | 'social' | 'other';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string; // ISO date string
  end: string; // ISO date string
  allDay: boolean;
  category: EventCategory;
  createdBy: string; // User ID
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  attendees?: string[]; // Array of User IDs
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string; // ISO date string
  eventId?: string; // Optional reference to an event
  userId: string;
}
