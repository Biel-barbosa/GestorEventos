import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Edit2, 
  Trash2, 
  ArrowLeft,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEvents } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryOptions } from "@/services/mockData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from "@/components/Events/EventForm";
import { cn } from "@/lib/utils";
import type { Event } from "@/types"; // Ajuste conforme a localização do tipo

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getEventById, updateEvent, deleteEvent } = useEvents();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | undefined>(id ? getEventById(id) : undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const eventData = getEventById(id);
      setEvent(eventData);
      if (!eventData) {
        navigate("/dashboard");
      }
    }
  }, [id, getEventById, navigate]);

  if (!event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatEventDateTime = () => {
    const start = new Date(event.start);
    const end = new Date(event.end);

    if (event.allDay) {
      if (start.toDateString() === end.toDateString()) {
        return `${format(start, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })} · Dia inteiro`;
      }
      return `${format(start, "d 'de' MMM", { locale: ptBR })} - ${format(end, "d 'de' MMM 'de' yyyy", { locale: ptBR })} · Dia inteiro`;
    }

    if (start.toDateString() === end.toDateString()) {
      return `${format(start, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })} · ${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
    }

    return `${format(start, "d 'de' MMM, HH:mm", { locale: ptBR })} - ${format(end, "d 'de' MMM, HH:mm", { locale: ptBR })}`;
  };

  const categoryInfo = categoryOptions.find(cat => cat.value === event.category);

  const getLocalizedCategory = (category: string) => {
    switch (category) {
      case "personal": return "Pessoal";
      case "work": return "Trabalho";
      case "social": return "Social";
      case "other": return "Outro";
      default: return category;
    }
  };

  const handleEditEvent = async (data: Partial<Event>) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const updated = await updateEvent(id, data);
      setEvent(updated);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!id) return;

    try {
      await deleteEvent(id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div 
          className="h-2" 
          style={{ backgroundColor: categoryInfo?.color || "#9b87f5" }} 
        />

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                <Edit2 className="mr-2 h-4 w-4" /> Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso excluirá permanentemente o evento. Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteEvent} 
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex">
              <Badge className={cn(
                "bg-opacity-20 text-xs",
                event.category === "personal" && "bg-event-personal/20 text-event-personal border-event-personal",
                event.category === "work" && "bg-event-work/20 text-event-work border-event-work",
                event.category === "social" && "bg-event-social/20 text-event-social border-event-social",
                event.category === "other" && "bg-event-other/20 text-event-other border-event-other"
              )}>
                {getLocalizedCategory(categoryInfo?.label || event.category)}
              </Badge>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{formatEventDateTime()}</span>
            </div>

            {event.location && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{event.location}</span>
              </div>
            )}

            {event.attendees?.length > 0 && (
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">
                  {event.attendees.length} {event.attendees.length === 1 ? "participante" : "participantes"}
                </span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Descrição</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={event}
            onSubmit={handleEditEvent}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetail;
