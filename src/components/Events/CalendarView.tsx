
import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isValid } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Event } from "@/types";
import { categoryOptions } from "@/services/mockData";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

// Personalizando o localizador do calendário para PT-BR
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales: {
    'pt-BR': ptBR,
  },
});

// Tradução para os textos do calendário
const messages = {
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  allDay: 'Dia todo',
  week: 'Semana',
  work_week: 'Semana de trabalho',
  day: 'Dia',
  month: 'Mês',
  previous: 'Anterior',
  next: 'Próximo',
  yesterday: 'Ontem',
  tomorrow: 'Amanhã',
  today: 'Hoje',
  agenda: 'Agenda',
  noEventsInRange: 'Não há eventos neste período.',
  showMore: (total: number) => `+ ${total} mais`,
};

const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick }) => {
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mobileEvents, setMobileEvents] = useState<Event[]>([]);
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const isMobile = useIsMobile();
  
  // Extrai todas as datas de eventos para marcar no calendário móvel
  useEffect(() => {
    try {
      const dates = events.map(event => {
        const date = new Date(event.start);
        if (isValid(date)) {
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        return null;
      }).filter((date): date is Date => date !== null);
      
      setEventDates(dates);
    } catch (error) {
      console.error("Error extracting event dates:", error);
    }
  }, [events]);
  
  // Filtra eventos para o dia selecionado na visualização mobile
  useEffect(() => {
    if (selectedDate) {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);
      
      const filteredEvents = events.filter(event => {
        try {
          const eventStart = new Date(event.start);
          return isValid(eventStart) && eventStart >= start && eventStart <= end;
        } catch (error) {
          console.error("Error filtering event:", error, event);
          return false;
        }
      });
      
      setMobileEvents(filteredEvents);
    }
  }, [selectedDate, events]);

  // Formatar eventos para o React Big Calendar
  const calendarEvents = events.map((event) => {
    try {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      if (!isValid(startDate) || !isValid(endDate)) {
        console.warn("Invalid date for event:", event);
        return null;
      }
      
      return {
        id: event.id,
        title: event.title,
        start: startDate,
        end: endDate,
        allDay: event.allDay,
        resource: event, // Armazena o evento original como recurso
      };
    } catch (error) {
      console.error("Error processing event:", error, event);
      return null;
    }
  }).filter(Boolean);

  // Componente de evento customizado para mostrar as cores baseadas na categoria
  const EventComponent = ({ event }: any) => {
    const originalEvent = event.resource as Event;
    const categoryInfo = categoryOptions.find(cat => cat.value === originalEvent.category);
    const bgColor = categoryInfo?.color || "#9b87f5";

    return (
      <div
        className={cn(
          "px-2 py-1 text-xs overflow-hidden text-white rounded",
          "overflow-hidden text-ellipsis whitespace-nowrap"
        )}
        style={{ backgroundColor: bgColor }}
      >
        {event.title}
      </div>
    );
  };

  // Função para verificar se uma data tem eventos
  const hasEventsOnDate = (date: Date): boolean => {
    return eventDates.some(eventDate => 
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    );
  };

  // Função para personalizar datas no calendário mobile
  const dayClassNames = (date: Date): string => {
    return hasEventsOnDate(date) ? "bg-primary/20 font-bold" : "";
  };

  // Renderiza um calendário adaptado para dispositivos móveis
  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {/* Seletor de data simplificado para mobile */}
        <div className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="flex items-center justify-center w-full"
            onClick={() => setIsDrawerOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{format(selectedDate, 'dd/MM/yyyy')}</span>
          </Button>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
            >
              Dia anterior
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Hoje
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            >
              Próximo dia
            </Button>
          </div>
        </div>
        
        {/* Lista de eventos do dia */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium mb-4">
            Eventos para {format(selectedDate, 'dd/MM/yyyy')}
          </h3>
          
          {mobileEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum evento para este dia
            </p>
          ) : (
            <div className="space-y-3">
              {mobileEvents.map((event) => {
                try {
                  const categoryInfo = categoryOptions.find(cat => cat.value === event.category);
                  const bgColor = categoryInfo?.color || "#9b87f5";
                  
                  return (
                    <div
                      key={event.id}
                      className="p-3 rounded-md cursor-pointer hover:bg-muted/50"
                      style={{ borderLeft: `4px solid ${bgColor}` }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.allDay ? (
                          "Dia inteiro"
                        ) : (
                          `${format(new Date(event.start), 'HH:mm')} - ${format(new Date(event.end), 'HH:mm')}`
                        )}
                      </div>
                    </div>
                  );
                } catch (error) {
                  console.error("Error rendering event:", error, event);
                  return null;
                }
              }).filter(Boolean)}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handler para seleção de data no drawer
  const handleDateSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      setSelectedDate(date);
      setIsDrawerOpen(false);
    }
  };

  return (
    <>
      {/* Visualização para desktop */}
      {!isMobile && (
        <div className="h-[70vh] w-full">
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={["month", "week", "day", "agenda"]}
            view={view}
            onView={(newView: any) => setView(newView)}
            components={{
              event: EventComponent,
            }}
            onSelectEvent={(event) => onEventClick(event.resource)}
            messages={messages}
            culture="pt-BR"
            date={selectedDate}
            onNavigate={date => setSelectedDate(date)}
          />
        </div>
      )}
      
      {/* Visualização para mobile */}
      {isMobile && renderMobileView()}
      
      {/* Drawer com calendar para seleção de data no mobile */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Selecione uma data</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 px-4 pointer-events-auto">
            <div className="flex justify-center mb-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
                modifiers={{
                  hasEvent: (date) => hasEventsOnDate(date)
                }}
                modifiersClassNames={{
                  hasEvent: "bg-primary/20 font-bold"
                }}
                classNames={{
                  day_selected: cn(
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  ),
                  day_today: cn(
                    "bg-accent text-accent-foreground",
                    hasEventsOnDate(new Date()) && "bg-primary/50 text-primary-foreground",
                  ),
                }}
                disabled={(date) => false}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={() => setIsDrawerOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CalendarView;
