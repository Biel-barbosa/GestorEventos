/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { EventCategory } from "@/types";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/Events/EventCard";
import FilterBar from "@/components/Events/FilterBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from "@/components/Events/EventForm";

const Dashboard = () => {
  const { events, filterEvents, createEvent } = useEvents();
  const navigate = useNavigate();
  
  // Estado
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filtrar eventos
  const handleFilterChange = (filters: { searchTerm?: string; category?: EventCategory }) => {
    const filtered = filterEvents(filters);
    setFilteredEvents(filtered);
  };
  
  // Criar evento
  const handleCreateEvent = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newEvent = await createEvent(data);
      setIsCreateModalOpen(false);
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error("Erro ao criar evento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Navegar para detalhes do evento
  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  // Próximos eventos (próximos 3 dias)
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);
  
  const upcomingEvents = events.filter(event => {
    const eventStart = new Date(event.start);
    return eventStart >= today && eventStart <= threeDaysFromNow;
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </div>
      
      {/* Seção de próximos eventos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
        {upcomingEvents.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border text-center">
            <p className="text-muted-foreground">Nenhum evento nos próximos 3 dias</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event.id)}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* Seção de todos os eventos */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Todos os Eventos</h2>
        </div>
        
        <FilterBar onFilterChange={handleFilterChange} />
        
        {filteredEvents.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border text-center">
            <p className="text-muted-foreground">Nenhum evento encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event.id)}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* Modal de criação de evento */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Evento</DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setIsCreateModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
