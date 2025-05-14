
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NotificationsPanel from "../Notifications/NotificationsPanel";
import { useState } from "react";

const MainLayout: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onNotificationsClick={() => setNotificationsPanelOpen(true)} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Notifications panel */}
      <NotificationsPanel 
        open={notificationsPanelOpen} 
        onClose={() => setNotificationsPanelOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;
