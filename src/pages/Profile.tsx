
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import EventCard from "@/components/Events/EventCard";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();
  
  if (!currentUser) return null;
  
  // Obter eventos criados pelo usuário atual
  const createdEvents = events.filter(
    event => event.createdBy === currentUser.id
  );
  
  // Obter eventos em que o usuário participou
  const attendedEvents = events.filter(
    event => event.attendees?.includes(currentUser.id) && event.createdBy !== currentUser.id
  );
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Perfil</h1>
      
      {/* Card de informações do usuário */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName} />
            <AvatarFallback className="text-xl">
              {currentUser.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{currentUser.displayName}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {currentUser.email}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Membro desde {format(new Date(currentUser.createdAt), "d 'de' MMMM 'de' yyyy", {locale: ptBR})}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {createdEvents.length} evento{createdEvents.length !== 1 ? "s" : ""} criado{createdEvents.length !== 1 ? "s" : ""},
              {" "}{attendedEvents.length} evento{attendedEvents.length !== 1 ? "s" : ""} participado{attendedEvents.length !== 1 ? "s" : ""}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
            onClick={logout}
          >
            Sair
          </Button>
        </CardContent>
      </Card>
      
      {/* Abas de eventos */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">Eventos Criados</TabsTrigger>
          <TabsTrigger value="attended">Eventos Participados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="pt-6">
          {createdEvents.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Você ainda não criou nenhum evento.
                </p>
                <Button className="mt-4" onClick={() => navigate("/dashboard")}>
                  Crie seu primeiro evento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => navigate(`/events/${event.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="attended" className="pt-6">
          {attendedEvents.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Você ainda não participou de nenhum evento.
                </p>
                <Button className="mt-4" onClick={() => navigate("/calendar")}>
                  Explorar eventos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendedEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => navigate(`/events/${event.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
