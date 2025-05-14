
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, List, UserCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Seção do hero */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Gerencie seus eventos com facilidade
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                O GestorEventos ajuda você a criar, organizar e acompanhar todos os seus eventos em um só lugar.
                Nunca mais perca uma reunião importante ou encontro social.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/register">Criar Conta</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute -bottom-8 right-0 w-72 h-72 bg-indigo-300 rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-16 right-20 w-72 h-72 bg-pink-300 rounded-full opacity-30 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <AspectRatio ratio={16/12} className="bg-muted rounded-md overflow-hidden">
                    <img
                      src="/calendar-image.jpg"
                      alt="Ilustração de calendário"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjhmN2ZjIi8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgcng9IjIwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjOGI1Y2Y2IiBzdHJva2Utd2lkdGg9IjQiLz4KPHJlY3QgeD0iMTUwIiB5PSIxMDAiIHdpZHRoPSI1MDAiIGhlaWdodD0iODAiIGZpbGw9IiM4YjVjZjYiIHN0cm9rZT0iIzhiNWNmNiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE0MCIgcj0iMTUiIGZpbGw9IiNkZGQ2ZmUiLz4KPGNpcmNsZSBjeD0iNjAwIiBjeT0iMTQwIiByPSIxNSIgZmlsbD0iI2RkZDZmZSIvPgo8dGV4dCB4PSIzMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSI+TUFJTSBDT05UQSBERSBDQU5FTkRBUklPPC90ZXh0Pgo8IS0tIERheXMgb2YgdGhlIHdlZWsgLS0+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIyMCIgcj0iMzAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNkZGQ2ZmUiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIyODAiIGN5PSIyMjAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZGRkNmZlIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMzYwIiBjeT0iMjIwIiByPSIzMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI2RkZDZmZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQ0MCIgY3k9IjIyMCIgcj0iMzAiIGZpbGw9IiM4YjVjZjYiLz4KPGNpcmNsZSBjeD0iNTIwIiBjeT0iMjIwIiByPSIzMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI2RkZDZmZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjYwMCIgY3k9IjIyMCIgcj0iMzAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNkZGQ2ZmUiIHN0cm9rZS13aWR0aD0iMiIvPgo8IS0tIE51bWJlcnMgLS0+Cjx0ZXh0IHg9IjE5NSIgeT0iMjI3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NDc0OGIiPjE8L3RleHQ+Cjx0ZXh0IHg9IjI3NSIgeT0iMjI3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NDc0OGIiPjI8L3RleHQ+Cjx0ZXh0IHg9IjM1NSIgeT0iMjI3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NDc0OGIiPjM8L3RleHQ+Cjx0ZXh0IHg9IjQzNSIgeT0iMjI3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIj40PC90ZXh0Pgo8dGV4dCB4PSI1MTUiIHk9IjIyNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjNjQ3NDhiIj41PC90ZXh0Pgo8dGV4dCB4PSI1OTUiIHk9IjIyNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjNjQ3NDhiIj42PC90ZXh0Pgo8IS0tIE90aGVyIHJvd3Mgb2YgZGF5cyAtLT4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMzAwIiByPSIzMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI2RkZDZmZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjI4MCIgY3k9IjMwMCIgcj0iMzAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNkZGQ2ZmUiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIzNjAiIGN5PSIzMDAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZGRkNmZlIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iNDQwIiBjeT0iMzAwIiByPSIzMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI2RkZDZmZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjUyMCIgY3k9IjMwMCIgcj0iMzAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNkZGQ2ZmUiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMDAiIHI9IjMwIiBmaWxsPSIjYTc4YmZhIiBzdHJva2U9IiM4YjVjZjYiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxOTUiIHk9IjMwNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjNjQ3NDhiIj43PC90ZXh0Pgo8dGV4dCB4PSIyNzUiIHk9IjMwNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjNjQ3NDhiIj44PC90ZXh0Pgo8dGV4dCB4PSIzNTUiIHk9IjMwNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjNjQ3NDhiIj45PC90ZXh0Pgo8dGV4dCB4PSI0MzAiIHk9IjMwNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjNjQ3NDhiIj4xMDwvdGV4dD4KPHRleHQgeD0iNTEwIiB5PSIzMDciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY0NzQ4YiI+MTE8L3RleHQ+Cjx0ZXh0IHg9IjU5MCIgeT0iMzA3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NDc0OGIiPjEyPC90ZXh0Pgo8IS0tIEV2ZW50IGJhciAtLT4KPHJlY3QgeD0iMjAwIiB5PSIzNjAiIHdpZHRoPSIxODAiIGhlaWdodD0iMzAiIHJ4PSI1IiBmaWxsPSIjOGI1Y2Y2IiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8dGV4dCB4PSIyMzAiIHk9IjM4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSI+UmV1bmlhbyAxMGg8L3RleHQ+CjxyZWN0IHg9IjQ0MCIgeT0iNDAwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMwIiByeD0iNSIgZmlsbD0iI2Y5NzMxNiIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KPHRleHQgeD0iNDcwIiB5PSI0MjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiPkV2ZW50byAxNWg8L3RleHQ+Cjwvc3ZnPg==";
                      }}
                    />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de recursos */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Principais Recursos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <Calendar className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visualização de Calendário</h3>
              <p className="text-gray-600">
                Veja seus eventos em uma interface de calendário intuitiva com visualizações diárias, semanais e mensais.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <List className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Eventos</h3>
              <p className="text-gray-600">
                Crie, edite e exclua eventos com todos os detalhes necessários para manter-se organizado.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <Filter className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Filtros Inteligentes</h3>
              <p className="text-gray-600">
                Filtre eventos por categorias, intervalos de datas e termos de pesquisa para encontrar rapidamente o que precisa.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <UserCheck className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfis de Usuário</h3>
              <p className="text-gray-600">
                Gerencie seu perfil pessoal e acompanhe seu histórico de eventos, tudo em um só lugar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção CTA */}
      <div className="bg-purple-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
            Junte-se ao GestorEventos hoje e assuma o controle da sua agenda. Nunca mais perca um evento importante.
          </p>
          <Button size="lg" asChild className="w-full sm:w-auto max-w-xs mx-auto">
            <Link to="/register">Criar Conta Gratuita</Link>
          </Button>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="h-6 w-6 text-purple-600 mr-2" />
              <span className="text-xl font-bold">GestorEventos</span>
            </div>
            <div className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} GestorEventos. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
