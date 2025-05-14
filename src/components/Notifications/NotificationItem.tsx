
import React from "react";
import { 
  CalendarClock, 
  Bell, 
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Notification } from "@/types";
import { useEvents } from "@/contexts/EventContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markNotificationAsRead } = useEvents();
  const navigate = useNavigate();
  
  const handleClick = () => {
    markNotificationAsRead(notification.id);
    
    // Se a notificação estiver relacionada a um evento, navegue para ele
    if (notification.eventId) {
      navigate(`/events/${notification.eventId}`);
    }
  };
  
  // Escolha o ícone baseado no tipo de notificação
  const getIcon = () => {
    switch (notification.type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div 
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-colors",
        notification.read ? "bg-gray-50" : "bg-blue-50",
        "hover:bg-gray-100"
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium",
            !notification.read && "font-semibold"
          )}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
          <div className="flex items-center mt-1 text-xs text-gray-400">
            <CalendarClock className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ptBR })}
          </div>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
