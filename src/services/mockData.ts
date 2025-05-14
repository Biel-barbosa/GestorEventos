
import { v4 as uuidv4 } from 'uuid';
import { Event, User, Notification } from '@/types';

// Opções de categoria para os eventos
export const categoryOptions = [
  {
    value: "personal",
    label: "Pessoal",
    color: "#8b5cf6", // purple-500
  },
  {
    value: "work",
    label: "Trabalho",
    color: "#3b82f6", // blue-500
  },
  {
    value: "social",
    label: "Social",
    color: "#f59e0b", // amber-500
  },
  {
    value: "other",
    label: "Outro",
    color: "#9b87f5", // custom purple
  },
];

// Dados de usuário mocados
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    displayName: 'João Silva',
    photoURL: 'https://i.pravatar.cc/150?img=68',
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 'user-2',
    email: 'mary@example.com',
    displayName: 'Maria Souza',
    photoURL: 'https://i.pravatar.cc/150?img=49',
    createdAt: '2023-02-15T00:00:00.000Z',
  },
];

// Dados de evento mocados
export const mockEvents: Event[] = [
  {
    id: uuidv4(),
    title: "Reunião de Equipe",
    description: "Sincronização semanal com a equipe de desenvolvimento",
    location: "Sala de Conferência A",
    start: new Date().setHours(10, 0, 0, 0).toString(),
    end: new Date().setHours(11, 0, 0, 0).toString(),
    allDay: false,
    category: "work",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Almoço com Sarah",
    description: "Conversar durante o almoço",
    location: "Café Downtown",
    start: new Date().setHours(13, 0, 0, 0).toString(),
    end: new Date().setHours(14, 0, 0, 0).toString(),
    allDay: false,
    category: "social",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Prazo do Projeto",
    description: "Enviar entregas finais do projeto",
    location: "Escritório",
    start: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    allDay: true,
    category: "work",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Consulta Médica",
    description: "Check-up anual",
    location: "Centro Médico",
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(9, 0, 0, 0);
      return date.toISOString();
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(10, 0, 0, 0);
      return date.toISOString();
    })(),
    allDay: false,
    category: "personal",
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Festa de Aniversário",
    description: "Celebração na casa do Miguel",
    location: "Rua da Festa, 123",
    start: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      date.setHours(18, 0, 0, 0);
      return date.toISOString();
    })(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      date.setHours(22, 0, 0, 0);
      return date.toISOString();
    })(),
    allDay: false,
    category: "social",
    createdBy: "user-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attendees: ["user-1", "user-2"],
  },
];

// Dados de notificação mocados
export const mockNotifications: Notification[] = [
  {
    id: uuidv4(),
    title: "Lembrete do evento",
    message: "Reunião de Equipe começa em 1 hora",
    type: "info",
    read: false,
    eventId: mockEvents[0].id,
    userId: "user-1", // Adicionada a propriedade userId
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Evento atualizado",
    message: "Almoço com Sarah foi movido para 13:00",
    type: "info",
    read: true,
    eventId: mockEvents[1].id,
    userId: "user-1", // Adicionada a propriedade userId
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
  },
  {
    id: uuidv4(),
    title: "Prazo se aproximando",
    message: "Prazo do Projeto em 3 dias",
    type: "warning",
    read: false,
    eventId: mockEvents[2].id,
    userId: "user-1", // Adicionada a propriedade userId
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
  }
];
