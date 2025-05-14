
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventContext";
import MobileMenu from "./MobileMenu";

const Navbar: React.FC<{ onNotificationsClick: () => void }> = ({ onNotificationsClick }) => {
  const { currentUser } = useAuth();
  const { notifications } = useEvents();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contador de notificações não lidas
  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <header className="sticky top-0 z-10 bg-white shadow h-16 flex items-center px-4">
      <div className="flex-1 flex justify-between items-center">
        {/* Botão de menu para mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>

        {/* Título da página (pode ser dinâmico baseado na rota atual) */}
        <h1 className="text-xl font-semibold md:ml-0 ml-2">GestorEventos</h1>

        <div className="flex items-center space-x-2">
          {/* Botão de notificações */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationsClick}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </Button>
          </div>

          {/* Avatar do usuário */}
          {currentUser && (
            <Avatar
              className="cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <AvatarImage
                src={currentUser.photoURL}
                alt={currentUser.displayName}
              />
              <AvatarFallback>
                {currentUser.displayName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Navbar;
