
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEvents } from "@/contexts/EventContext";
import NotificationItem from "./NotificationItem";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  const { notifications } = useEvents();

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 max-w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Cabeçalho */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Notificações</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Lista de notificações */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma notificação
              </p>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default NotificationsPanel;
