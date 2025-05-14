
import React, { createContext, useContext, useState, useEffect } from "react";
import { Event, EventCategory, Notification } from "../types";
import { mockEvents, mockNotifications } from "../services/mockData";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface EventContextType {
  events: Event[];
  notifications: Notification[];
  createEvent: (eventData: Omit<Event, "id" | "createdBy" | "createdAt" | "updatedAt">) => Promise<Event>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  filterEvents: (filters: { category?: EventCategory; startDate?: Date; endDate?: Date; searchTerm?: string }) => Event[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;
  loading: boolean;
}

const LOCAL_STORAGE_EVENTS_KEY = "gestor-eventos-events";
const LOCAL_STORAGE_NOTIFICATIONS_KEY = "gestor-eventos-notifications";
const DEMO_EVENTS_LOADED_KEY = "gestor-eventos-demo-loaded";
const DEMO_NOTIFICATIONS_LOADED_KEY = "gestor-eventos-demo-notifications-loaded";

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carrega eventos e notificações do localStorage ou mockData quando o usuário muda
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      
      try {
        // Tenta carregar do localStorage primeiro
        const storedEvents = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
        const storedNotifications = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
        const demoEventsLoaded = localStorage.getItem(DEMO_EVENTS_LOADED_KEY);
        const demoNotificationsLoaded = localStorage.getItem(DEMO_NOTIFICATIONS_LOADED_KEY);
        
        let userEvents: Event[] = [];
        let userNotifications: Notification[] = [];
        
        if (storedEvents) {
          // Se temos eventos armazenados, filtramos para o usuário atual
          const parsedEvents = JSON.parse(storedEvents) as Event[];
          userEvents = parsedEvents.filter(event => 
            event.createdBy === currentUser.id || 
            event.attendees?.includes(currentUser.id)
          );
        }
        
        // Verificar se os eventos demo já foram carregados para este usuário
        const isDemoUser = currentUser.email === "john@example.com";
        if (isDemoUser && !demoEventsLoaded) {
          // Para o usuário demo, só carregamos os eventos mockados uma vez
          userEvents = mockEvents.filter(event => 
            event.createdBy === currentUser.id || 
            event.attendees?.includes(currentUser.id)
          );
          
          // Salvamos no localStorage para uso futuro
          localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify([...mockEvents]));
          localStorage.setItem(DEMO_EVENTS_LOADED_KEY, "true");
        }
        
        if (storedNotifications) {
          // Se temos notificações armazenadas, filtramos para o usuário atual
          const parsedNotifications = JSON.parse(storedNotifications) as Notification[];
          userNotifications = parsedNotifications.filter(
            notif => notif.userId === currentUser.id
          );
          
          // Para o usuário demo, verificamos se as notificações já foram carregadas
          if (isDemoUser && !demoNotificationsLoaded) {
            // Se não foram, usamos as mockNotifications
            userNotifications = mockNotifications.filter(
              notif => notif.userId === currentUser.id
            );
            
            // Salvamos as notificações demo no localStorage
            const allNotifications = [...mockNotifications];
            localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
            localStorage.setItem(DEMO_NOTIFICATIONS_LOADED_KEY, "true");
          }
        } else {
          // Se não há notificações armazenadas
          if (isDemoUser) {
            // Para usuário demo, carregamos notificações mockadas
            userNotifications = mockNotifications.filter(
              notif => notif.userId === currentUser.id
            );
            // Salvamos no localStorage para uso futuro
            localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify([...mockNotifications]));
            localStorage.setItem(DEMO_NOTIFICATIONS_LOADED_KEY, "true");
          }
        }
        
        setEvents(userEvents);
        setNotifications(userNotifications);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar eventos");
      } finally {
        setLoading(false);
      }
    } else {
      setEvents([]);
      setNotifications([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Salvar eventos no localStorage quando mudam
  useEffect(() => {
    if (events.length > 0 && currentUser && currentUser.email !== "john@example.com") {
      // Obtemos todos os eventos existentes primeiro
      const existingEventsString = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
      let allEvents: Event[] = [];
      
      if (existingEventsString) {
        try {
          const existingEvents = JSON.parse(existingEventsString) as Event[];
          
          // Filtramos os eventos que não pertencem ao usuário atual
          const otherUsersEvents = existingEvents.filter(event => 
            event.createdBy !== currentUser?.id && 
            !event.attendees?.includes(currentUser?.id || '')
          );
          
          // Combinamos com os eventos atuais do usuário
          allEvents = [...otherUsersEvents, ...events];
        } catch (error) {
          console.error("Erro ao analisar eventos existentes:", error);
          allEvents = [...events];
        }
      } else {
        allEvents = [...events];
      }
      
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(allEvents));
    }
  }, [events, currentUser]);

  // Salvar notificações no localStorage quando mudam
  useEffect(() => {
    if (notifications.length > 0 && currentUser && currentUser.email !== "john@example.com") {
      // Obtemos todas as notificações existentes primeiro
      const existingNotificationsString = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
      let allNotifications: Notification[] = [];
      
      if (existingNotificationsString) {
        try {
          const existingNotifications = JSON.parse(existingNotificationsString) as Notification[];
          
          // Filtramos as notificações que não pertencem ao usuário atual
          const otherUsersNotifications = existingNotifications.filter(notif => 
            notif.userId !== currentUser?.id
          );
          
          // Combinamos com as notificações atuais do usuário
          allNotifications = [...otherUsersNotifications, ...notifications];
        } catch (error) {
          console.error("Erro ao analisar notificações existentes:", error);
          allNotifications = [...notifications];
        }
      } else {
        allNotifications = [...notifications];
      }
      
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
    }
  }, [notifications, currentUser]);

  // Calcular contagem de notificações não lidas
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Criar um novo evento
  const createEvent = async (eventData: Omit<Event, "id" | "createdBy" | "createdAt" | "updatedAt">) => {
    if (!currentUser) throw new Error("Usuário não autenticado");
    
    // Não permitir criação de novos eventos para conta demo
    if (currentUser.email === "john@example.com") {
      toast.info("Conta de demonstração: Os eventos não podem ser modificados");
      return mockEvents[0]; // Retorna um evento mock apenas para não quebrar a UI
    }
    
    setLoading(true);
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Adicionar evento à lista local
      setEvents(prev => [...prev, newEvent]);
      
      // Criar notificação para o evento
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        title: "Evento criado",
        message: `Você criou o evento: ${newEvent.title}`,
        type: "success",
        read: false,
        userId: currentUser.id,
        eventId: newEvent.id,
        createdAt: new Date().toISOString()
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      toast.success("Evento criado com sucesso");
      return newEvent;
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      toast.error("Falha ao criar evento");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar um evento existente
  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    if (!currentUser) throw new Error("Usuário não autenticado");
    
    // Não permitir atualização de eventos para conta demo
    if (currentUser.email === "john@example.com") {
      toast.info("Conta de demonstração: Os eventos não podem ser modificados");
      return events.find(e => e.id === id) || mockEvents[0];
    }
    
    setLoading(true);
    try {
      const eventIndex = events.findIndex(e => e.id === id);
      if (eventIndex === -1) throw new Error("Evento não encontrado");
      
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedEvent: Event = {
        ...events[eventIndex],
        ...eventData,
        updatedAt: new Date().toISOString()
      };
      
      // Atualizar estado local
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = updatedEvent;
      setEvents(updatedEvents);
      
      toast.success("Evento atualizado com sucesso");
      return updatedEvent;
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      toast.error("Falha ao atualizar evento");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Excluir um evento
  const deleteEvent = async (id: string) => {
    if (!currentUser) throw new Error("Usuário não autenticado");
    
    // Não permitir exclusão de eventos para conta demo
    if (currentUser.email === "john@example.com") {
      toast.info("Conta de demonstração: Os eventos não podem ser modificados");
      return;
    }
    
    setLoading(true);
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Atualizar estado local
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success("Evento excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Falha ao excluir evento");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obter evento por ID
  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  // Filtrar eventos
  const filterEvents = ({ category, startDate, endDate, searchTerm }: { 
    category?: EventCategory; 
    startDate?: Date; 
    endDate?: Date;
    searchTerm?: string;
  }) => {
    return events.filter(event => {
      // Filtrar por categoria, se fornecida
      if (category && event.category !== category) return false;
      
      // Filtrar por intervalo de datas, se fornecido
      if (startDate && new Date(event.end) < startDate) return false;
      if (endDate && new Date(event.start) > endDate) return false;
      
      // Filtrar por termo de pesquisa, se fornecido
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };

  // Marcar notificação como lida
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const value = {
    events,
    notifications,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    filterEvents,
    markNotificationAsRead,
    unreadNotificationsCount,
    loading
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents deve ser usado dentro de um EventProvider");
  }
  return context;
};
