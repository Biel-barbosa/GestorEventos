
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { Event, EventCategory } from "@/types";
import { Button } from "@/components/ui/button";
import FilterBar from "@/components/Events/FilterBar";
import CalendarView from "@/components/Events/CalendarView";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from "@/components/Events/EventForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const CalendarPage = () => {
  const { events, filterEvents, createEvent } = useEvents();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Estado
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Atualiza eventos filtrados quando os eventos mudam
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);
  
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
  
  // Manipular clique do evento no calendário
  const handleEventClick = (event: Event) => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Calendário</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {isMobile ? "Novo" : "Novo Evento"}
        </Button>
      </div>
      
      <div className="mb-4">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>
      
      {/* Visualização do Calendário */}
      <div className={cn("bg-white rounded-lg shadow", 
        isMobile ? "p-2" : "p-4")}>
        <CalendarView events={filteredEvents} onEventClick={handleEventClick} />
      </div>
      
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

export default CalendarPage;
