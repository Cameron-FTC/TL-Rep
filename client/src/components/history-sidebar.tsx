import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { History, X, GraduationCap, AlertTriangle, Mic } from "lucide-react";
import { Session } from "@shared/schema";

interface HistorySidebarProps {
  onSelectSession?: (session: Session) => void;
}

export function HistorySidebar({ onSelectSession }: HistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return new Date(date).toLocaleDateString();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
          <History className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Session History</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full mt-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-slate-500 py-8">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center text-slate-500 py-8">No sessions yet</div>
            ) : (
              sessions.map((session) => (
                <Card 
                  key={session.id} 
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    onSelectSession?.(session);
                    setIsOpen(false);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {session.type} Session
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatTimeAgo(session.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {session.scenario.slice(0, 100)}...
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        session.type === 'lesson' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {session.type === 'lesson' ? (
                          <GraduationCap className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {session.type}
                      </span>
                      {session.problemType && (
                        <span className="text-xs text-slate-500 capitalize">
                          {session.problemType}
                        </span>
                      )}
                      {session.audioFiles && session.audioFiles.length > 0 && (
                        <Mic className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
