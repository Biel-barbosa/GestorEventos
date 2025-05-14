
import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format, isValid } from "date-fns";
import { Event } from "@/types";
import { categoryOptions } from "@/services/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const categoryInfo = categoryOptions.find(cat => cat.value === event.category);
  
  const formatEventTime = () => {
    try {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      // Check if dates are valid before formatting
      if (!isValid(startDate) || !isValid(endDate)) {
        console.error("Invalid date values:", { start: event.start, end: event.end });
        return "Invalid date";
      }
      
      if (event.allDay) {
        return `All day · ${format(startDate, 'MMM d, yyyy')}`;
      }
      
      // Same day event
      if (startDate.toDateString() === endDate.toDateString()) {
        return `${format(startDate, 'MMM d, yyyy')} · ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
      }
      
      // Multi-day event
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    } catch (error) {
      console.error("Error formatting event time:", error);
      return "Date error";
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div 
        className="h-2" 
        style={{ backgroundColor: categoryInfo?.color || '#9b87f5' }} 
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg mb-1">{event.title}</h3>
          <Badge className={cn(
            "bg-opacity-20 text-xs",
            event.category === 'personal' && "bg-event-personal/20 text-event-personal border-event-personal",
            event.category === 'work' && "bg-event-work/20 text-event-work border-event-work",
            event.category === 'social' && "bg-event-social/20 text-event-social border-event-social",
            event.category === 'other' && "bg-event-other/20 text-event-other border-event-other"
          )}>
            {categoryInfo?.label || event.category}
          </Badge>
        </div>
        
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatEventTime()}</span>
          </div>
          {event.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        {event.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
