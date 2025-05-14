
import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Home, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Itens de navegação em português
  const navItems = [
    {
      name: "Painel",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />
    },
    {
      name: "Calendário",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: "Perfil",
      href: "/profile",
      icon: <User className="h-5 w-5" />
    }
  ];

  return (
    <div
      id="sidebar"
      className="bg-white border-r w-64 flex-shrink-0 transition-transform duration-200 ease-in-out md:translate-x-0 -translate-x-full fixed md:relative inset-y-0 left-0 z-20"
    >
      {/* Logo e nome do app */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-xl font-bold">GestorEventos</h1>
        </div>
      </div>

      {/* Navegação */}
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Seção do usuário na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium">
                {currentUser?.displayName?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{currentUser?.displayName}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
